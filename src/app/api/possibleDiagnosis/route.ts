import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

import { v4 as uuidv4 } from 'uuid';
import getSymptomsFromDiagnosis from '@/lib/medicalQueries/symptoms/getSymptomsFromDiagnosis';

// export const runtime = 'edge';

type StartQuestion = 'True' | 'False';
interface MessageBody {
    text: {
        text: string[];
    };
}
interface Parameters {
    symptom: string[];
    startQuestions: StartQuestion;
    sessionId: string;
}

interface Fulfillment {
    fulfillmentResponse: {
        messages: MessageBody[];
    };
    sessionInfo: {
        parameters: Parameters;
    };
}

export async function POST(request: NextRequest) {
    const sessionId = uuidv4();
    const sessionStore = kv

    let messageBody: MessageBody[] = [
        {
            text: {
                text: ['En saanut oireita :('],
            },
        },
    ];
    let parameters: Parameters = {
        symptom: [],
        startQuestions: 'False',
        sessionId,
    };

    const body = await request.json();
    const symptoms: string[] = body.sessionInfo?.parameters.symptom;

    if (symptoms) {
        parameters.symptom = symptoms
        const symptomString = symptoms.join(', ');
        const { error, errorMessage, possibleDiagnosis } =
            await getSymptomsFromDiagnosis(symptoms);

        if (possibleDiagnosis.length < 1) {
            const message = `En löytänyt diagnoosia oirella ${symptomString} :(`;
            messageBody[0].text.text = [message];
        }
        if (error) {
            messageBody[0].text.text = [errorMessage];
        }

        if (!error && possibleDiagnosis.length >= 1) {
            await sessionStore.set(sessionId, possibleDiagnosis);
            messageBody[0].text.text = ['']
            parameters.startQuestions = 'True'
        }
    }

    const dialogFlowFulfillment: Fulfillment = {
        fulfillmentResponse: {
            messages: messageBody,
        },
        sessionInfo: {
            parameters,
        },
    };
    return NextResponse.json<Fulfillment>(dialogFlowFulfillment, {
        status: 200,
    });
}
