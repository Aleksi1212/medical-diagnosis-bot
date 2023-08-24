import { NextResponse, type NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

import { v4 as uuidv4 } from 'uuid';
import getSymptomsFromDiagnosis from '@/lib/medicalQueries/symptoms/getSymptomsFromDiagnosis';
import getRandomNumber from '@/lib/utils/anon/getRandomNumber';

// export const runtime = 'edge';

export async function POST(request: NextRequest) {
    const sessionId = uuidv4();
    const sessionStore = kv;

    const body = await request.json();
    const symptoms: string[] = body.sessionInfo?.parameters.symptom;

    let messageBody: MessageBody[] = [
        {
            text: {
                text: ['En saanut oireita :('],
            },
        },
    ];
    let parameters: DialogFlowParameters = {
        symptom: [],
        startQuestions: 'False',
        diagnosisId: 0,
        sessionId,
        asking: '',
        asked: [],
        answer: '',
        endQuestions: 'False',
        diagnosisConfidence: [],
        ended: 'False'
    };

    if (symptoms) {
        parameters.symptom = symptoms;
        const symptomString = symptoms.join(', ');
        const { error, errorMessage, possibleSymptoms } =
            await getSymptomsFromDiagnosis(symptoms);

        if (possibleSymptoms.length < 1) {
            const message = `En löytänyt diagnoosia oirella ${symptomString} :(`;
            messageBody[0].text.text = [message];
        }
        if (error) {
            messageBody[0].text.text = [errorMessage];
        }

        if (!error && possibleSymptoms.length >= 1) {
            const randomIndex = getRandomNumber(possibleSymptoms.length);
            const firstSymptom = possibleSymptoms[randomIndex];
            const diagnosisId = firstSymptom.diagnosis[0].diagnosisId;

            await sessionStore.set(sessionId, possibleSymptoms);

            messageBody[0].text.text = [`Tunnetko ${firstSymptom.name}`];
            parameters.startQuestions = 'True';
            parameters.diagnosisId = diagnosisId;
            parameters.asking = firstSymptom.name;
            parameters.asked = [...symptoms, firstSymptom.name];
            parameters.diagnosisConfidence = [diagnosisId];
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
