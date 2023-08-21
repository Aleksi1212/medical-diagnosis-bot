import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import getDiagnosis from '@/medicalQueries/diagnosis/getDiagnosis';

// export const runtime = 'edge';

interface MessageBody {
    text: {
        text: string[];
    };
}

interface Fulfillment {
    fulfillmentResponse: {
        messages: MessageBody[];
    };
}

export async function POST(request: NextRequest) {
    let messageBody: MessageBody[] = [
        {
            text: {
                text: ['En saanut oireiat :('],
            },
        },
    ];

    const body = await request.json();
    const symptoms: string[] = body.sessionInfo?.parameters.symptom;

    if (symptoms) {
        const { error, errorMessage, diagnosis } = await getDiagnosis(symptoms);
        if (diagnosis.length > 0) {
            messageBody[0].text.text = [
                `En löytänyt diagnoosia oirella ${symptoms} :(`,
            ];
        }
    }

    const dialogFlowFulfillment: Fulfillment = {
        fulfillmentResponse: {
            messages: messageBody,
        },
    };
    return NextResponse.json<Fulfillment>(dialogFlowFulfillment, {
        status: 200,
    });
}
