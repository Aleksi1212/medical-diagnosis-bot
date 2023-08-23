import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import getSymptomsFromDiagnosis from '@/lib/medicalQueries/symptoms/getSymptomsFromDiagnosis';
import getDiagnosis from '@/lib/medicalQueries/diagnosis/getDiagnosis';

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
    sessionInfo: {
        parameters: {
            symptom: any[];
        };
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
        if (diagnosis.length < 1) {
            messageBody[0].text.text = [
                `En löytänyt diagnoosia oirella ${symptoms.join(', ')} :(`,
            ];
        }
        if (error) {
            messageBody[0].text.text = [errorMessage];
        }

        if (!error && diagnosis.length >= 1) {
            messageBody[0].text.text = ['Sinulla saattaa olla.'];
            const diagnosisMessages: MessageBody[] = diagnosis.map((data) => {
                return {
                    text: {
                        text: [data.name],
                    },
                };
            });
            messageBody = [
                ...messageBody,
                ...diagnosisMessages,
                {
                    text: {
                        text: [
                            'Suosittelen käymään lääkärissä, ja saada ammattilaisen mielipide',
                        ],
                    },
                },
            ];
        }
    }

    const dialogFlowFulfillment: Fulfillment = {
        fulfillmentResponse: {
            messages: messageBody,
        },
        sessionInfo: {
            parameters: {
                symptom: ['this is a test', 'testpt2'],
            },
        },
    };
    return NextResponse.json<Fulfillment>(dialogFlowFulfillment, {
        status: 200,
    });
}
