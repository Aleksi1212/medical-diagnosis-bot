import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    let message: string = 'Sinussa ei ole vikaa (hosted on vercel)';
    const body = await request.json()
    const symptoms: string[] = body.sessionInfo?.parameters.symptom;

    if (symptoms) {
        message = `Sinulla on ${symptoms.join(', ')} (hosted on vercel)`;
    }

    const dialogFlowFulfillment = {
        fulfillment_response: {
            messages: [
                {
                    text: {
                        text: [message],
                    },
                },
            ],
        },
    };
    return NextResponse.json(dialogFlowFulfillment, {
        status: 200,
    });
}
