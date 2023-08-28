import { NextResponse, type NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

import type { Symptom } from '@/lib/types/prisma.types';
import type {
    MessageBody,
    DialogFlowParameters,
    DialogFlowFulfillment,
} from '@/lib/types/dialogflow.types';

import findSymptomWithSameDiagnosiId from '@/lib/utils/diagnosis/findSymptomWithSameDiagnosisId';
import findNewDiagnosisFromSymptoms from '@/lib/utils/diagnosis/findNewDiagnosisFromSymptoms';
import checkConfidence from '@/lib/utils/ai/checkConfidence';

import getRandomNumber from '@/lib/utils/anon/getRandomNumber';
import getDiagnosisWithSameSymptoms from '@/lib/prisma/queries/medical/diagnosis/getDiagnosisWithSameSymptoms';

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

            const { endQuestions, question } = checkConfidence(
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

            const { endQuestions, question } = checkConfidence(
                diagnosisConfidence.length,
                nextSymptom
            );
            parameters.endQuestions = endQuestions;
            messageBody[0].text.text = [question];
        } else if (sessionId && answer === 'Ei' && concurrentNegative >= 3) {
            sessionData = (await sessionStore.get(sessionId)) as Symptom[];

            const { error, errorMessage, diagnosis } =
                await getDiagnosisWithSameSymptoms(diagnosisId, symptom);
            const diagnosisIds = diagnosis.map((obj) => obj.id);

            if (error) {
                console.error(errorMessage);
                messageBody[0].text.text = [errorMessage];
            }
            if (diagnosis.length < 1) {
                parameters.endQuestions = 'True';
                messageBody[0].text.text = [''];
            }
            if (!error && diagnosis.length >= 1) {
                const newSymptoms = findNewDiagnosisFromSymptoms(
                    sessionData,
                    diagnosisIds
                );
                const index = getRandomNumber(newSymptoms.length);
                const nextSymptom = newSymptoms[index];

                parameters.asking = nextSymptom.name;
                parameters.asked = [...asked, nextSymptom.name];
                parameters.answer = '';
                parameters.concurrentNegative = concurrentNegative + 1;
                parameters.diagnosisId = nextSymptom.diagnosis[0].diagnosisId

                const { endQuestions, question } = checkConfidence(
                    diagnosisConfidence.length,
                    nextSymptom
                );
                parameters.endQuestions = endQuestions;
                messageBody[0].text.text = [question];
            }
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
