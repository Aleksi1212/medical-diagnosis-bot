import { NextResponse, type NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

import type { Symptom } from '@/lib/types/prisma.types';
import type {
    MessageBody,
    DialogFlowParameters,
    DialogFlowFulfillment,
} from '@/lib/types/dialogflow.types';

import findSymptomWithSameDiagnosiId from '@/lib/utils/medical/findSymptomWithSameDiagnosisId';
import checkConfidence from '@/lib/utils/ai/checkConfidence';

import removeValueFromArray from '@/lib/utils/anon/removeValueFromArray';
import getRandomNumber from '@/lib/utils/anon/getRandomNumber';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    const sessionStore = kv;
    const body = await request.json();

    const messageBody: MessageBody[] = [
        {
            text: {
                text: ['En saanut vastausta :('],
            },
        },
    ];
    const parameters: DialogFlowParameters = body.sessionInfo?.parameters;

    if (parameters) {
        const {
            symptom,
            sessionId,
            diagnosisId,
            answer,
            asking,
            asked,
            diagnosisConfidence,
            concurrentNegative,
            possibleDiagnosis,
        } = parameters;
        let sessionData: Symptom[] = [];

        if (sessionId && answer === 'Joo') {
            sessionData = (await sessionStore.get(sessionId)) as Symptom[];
            const nextSymptom = await findSymptomWithSameDiagnosiId(
                diagnosisId,
                sessionData,
                asking,
                asked
            );

            parameters.symptom = [...symptom, asking];
            parameters.asking = nextSymptom?.name || '';
            parameters.asked = [...asked, nextSymptom?.name || ''];
            parameters.diagnosisConfidence = [
                ...diagnosisConfidence,
                parameters.diagnosisId,
            ];
            parameters.answer = '';
            parameters.concurrentNegative = 0;

            const { endQuestions, question } = await checkConfidence(
                diagnosisConfidence.length,
                nextSymptom
            );
            parameters.endQuestions = endQuestions;
            messageBody[0].text.text = [question];
        } else if (sessionId && answer === 'Ei' && concurrentNegative < 3) {
            sessionData = (await sessionStore.get(sessionId)) as Symptom[];
            const nextSymptom = await findSymptomWithSameDiagnosiId(
                diagnosisId,
                sessionData,
                asking,
                asked
            );

            parameters.asking = nextSymptom?.name || '';
            parameters.asked = [...asked, nextSymptom?.name || ''];
            parameters.answer = '';
            parameters.concurrentNegative = concurrentNegative + 1;

            const { endQuestions, question } = await checkConfidence(
                diagnosisConfidence.length,
                nextSymptom
            );
            parameters.endQuestions = endQuestions;
            messageBody[0].text.text = [question];
        } else if (sessionId && answer === 'Ei' && concurrentNegative >= 3) {
            sessionData = (await sessionStore.get(sessionId)) as Symptom[];

            const updatedDiagnosis = removeValueFromArray<number>(
                possibleDiagnosis,
                diagnosisId
            );
            const diagnosisIndex = getRandomNumber(updatedDiagnosis.length);
            const nextDiagnosis = updatedDiagnosis[diagnosisIndex];

            const nextSymptom = await findSymptomWithSameDiagnosiId(
                nextDiagnosis,
                sessionData,
                asking,
                asked
            );

            parameters.asking = nextSymptom?.name || '';
            parameters.asked = [...asked, nextSymptom?.name || ''];
            parameters.answer = '';
            parameters.concurrentNegative = 0;
            parameters.possibleDiagnosis = updatedDiagnosis;
            parameters.diagnosisId = nextDiagnosis;

            const { endQuestions, question } = await checkConfidence(
                diagnosisConfidence.length,
                nextSymptom
            );
            parameters.endQuestions = endQuestions;
            messageBody[0].text.text = [question];
        }
    }

    const dialogFlowFulfillment: DialogFlowFulfillment = {
        fulfillmentResponse: {
            messages: messageBody,
        },
        sessionInfo: {
            parameters,
        },
    };

    return NextResponse.json<DialogFlowFulfillment>(dialogFlowFulfillment, {
        status: 200,
    });
}
