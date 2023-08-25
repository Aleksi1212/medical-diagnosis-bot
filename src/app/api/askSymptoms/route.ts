import { NextResponse, type NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

import type { Symptom } from '@/lib/types/prisma.types';
import type {
    MessageBody,
    DialogFlowParameters,
    DialogFlowFulfillment,
} from '@/lib/types/dialogflow.types';

import findSymptomWithSameDiagnosiId from '@/lib/utils/diagnosis/findSymptomWithSameDiangosisId';
import getRandomNumber from '@/lib/utils/anon/getRandomNumber';

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

            if (diagnosisConfidence.length > 4 || !nextSymptom) {
                parameters.endQuestions = 'True';
                messageBody[0].text.text = [''];
            } else {
                const question = `Onko sinulla ${nextSymptom?.name}`;
                messageBody[0].text.text = [question];
            }
        } else if (sessionId && answer === 'Ei') {
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

            if (diagnosisConfidence.length > 4 || !nextSymptom) {
                parameters.endQuestions = 'True';
                messageBody[0].text.text = [''];
            } else {
                const question = `Onko sinulla ${nextSymptom?.name}`;
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
