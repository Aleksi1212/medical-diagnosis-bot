import { NextResponse, type NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

import getDiagnosis from '@/lib/medicalQueries/diagnosis/getDiagnosis';
import mostConfidentDiagnosis from '@/lib/utils/diagnosis/mostConfidentDiagnosis';

export async function POST(request: NextRequest) {
    const sessionStore = kv
    const body = await request.json();
    const parameters: DialogFlowParameters = body.sessionInfo?.parameters;

    let messageBody: MessageBody[] = [
        {
            text: {
                text: ['En saanut oireita :('],
            },
        },
    ];

    if (parameters) {
        const { diagnosisConfidence, sessionId } = parameters;
        const diagnosisId = mostConfidentDiagnosis(diagnosisConfidence);
        const { error, errorMessage, diagnosis } = await getDiagnosis(
            diagnosisId
        );

        if (error) {
            messageBody[0].text.text = [errorMessage];
        } else {
            const { name } = diagnosis;
            const message = `
                Oireiden perusteella sinulla saattaa olla ${name}\n
                Suosittelen käymään lääkärissä ja saada ammattilaisen mielipide.
            `;
            messageBody[0].text.text = [message];
        }
        parameters.ended = 'True';
        await sessionStore.del(sessionId)
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
