import { NextResponse, type NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

import type {
    MessageBody,
    DialogFlowParameters,
    DialogFlowFulfillment,
} from '@/lib/types/dialogflow.types';

import { v4 as uuidv4 } from 'uuid';
import getPossibleSymptoms from '@/lib/prisma/queries/medical/symptoms/getPossibleSymptoms';
import getRandomNumber from '@/lib/utils/anon/getRandomNumber';

// export const runtime = 'edge';

export async function POST(request: NextRequest) {
    const sessionId = uuidv4();
    const sessionStore = kv;

    const body = await request.json();
    const symptoms = body.sessionInfo?.parameters.symptom;

    const messageBody: MessageBody[] = [
        {
            text: {
                text: ['En saanut oireita :('],
            },
        },
    ];
    const parameters: DialogFlowParameters = {
        symptom: [],
        sessionId,
        diagnosisId: 0,
        asking: '',
        asked: [],
        diagnosisConfidence: [],
        endQuestions: 'False',
        startQuestions: 'True',
        answer: '',
        ended: 'False',
        concurrentNegative: 0,
        possibleDiagnosis: [],
    };

    if (symptoms) {
        parameters.symptom = symptoms;
        const symptomString = symptoms.join(', ');

        const { error, errorMessage, possibleSymptoms, possibleDiagnosis } =
            await getPossibleSymptoms(symptoms);

        if (possibleSymptoms.length < 1) {
            const message = `En löytänyt diagnoosia oirella ${symptomString} :(`;
            messageBody[0].text.text = [message];
        }
        if (error) {
            messageBody[0].text.text = [errorMessage];
        }

        if (!error && possibleSymptoms.length >= 1) {
            const symptomIndex = getRandomNumber(possibleSymptoms.length);
            const { name } = possibleSymptoms[symptomIndex];

            const diagnosisIndex = getRandomNumber(possibleDiagnosis.length);
            const diagnosisId = possibleDiagnosis[diagnosisIndex];

            await sessionStore.set(sessionId, possibleSymptoms);

            parameters.startQuestions = 'True';
            parameters.diagnosisId = diagnosisId;
            parameters.asking = name;
            parameters.asked = [...symptoms, name];
            parameters.diagnosisConfidence = [diagnosisId];
            parameters.possibleDiagnosis = possibleDiagnosis;
            messageBody[0].text.text = [`Onko sinulla ${name}?`];
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
