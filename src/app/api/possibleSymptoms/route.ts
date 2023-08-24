import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

import { v4 as uuidv4 } from 'uuid';
import getSymptomsFromDiagnosis from '@/lib/medicalQueries/symptoms/getSymptomsFromDiagnosis';

// export const runtime = 'edge';

interface PossibleDiagnosisParameters extends DialogFlowParameters {
    startQuestions: StringBoolean;
    diagnosisId: number
}
interface PossibleDiagnosisFulfillment extends DialogFlowFulfillment {
    sessionInfo: {
        parameters: PossibleDiagnosisParameters;
    };
}

export async function POST(request: NextRequest) {
    const sessionId = uuidv4();
    const sessionStore = kv;

    let messageBody: MessageBody[] = [
        {
            text: {
                text: ['En saanut oireita :('],
            },
        },
    ];
    let parameters: PossibleDiagnosisParameters = {
        symptom: [],
        startQuestions: 'False',
        diagnosisId: 0,
        sessionId,
    };

    const body = await request.json();
    const symptoms: string[] = body.sessionInfo?.parameters.symptom;

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
            const randomIndex = Math.floor(
                Math.random() * possibleSymptoms.length
            );
            const firstSymptom = possibleSymptoms[randomIndex];
            const diagnosisId = firstSymptom.diagnosis[0].diagnosisId;

            await sessionStore.set(sessionId, possibleSymptoms);

            messageBody[0].text.text = [`Tunnetko ${firstSymptom.name}`];
            parameters.startQuestions = 'True';
            parameters.diagnosisId = diagnosisId
        }
    }

    const dialogFlowFulfillment: PossibleDiagnosisFulfillment = {
        fulfillmentResponse: {
            messages: messageBody,
        },
        sessionInfo: {
            parameters,
        },
    };
    return NextResponse.json<PossibleDiagnosisFulfillment>(
        dialogFlowFulfillment,
        {
            status: 200,
        }
    );
}
