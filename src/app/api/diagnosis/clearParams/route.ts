import { type NextRequest, NextResponse } from 'next/server';
import type {
    DialogFlowFulfillment,
    DialogFlowParameters,
    MessageBody,
} from '@/lib/types/dialogflow.types';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const excludedParam = searchParams.get(
        'exclude'
    ) as keyof DialogFlowParameters;

    const messageBody: MessageBody[] = [
        {
            text: {
                text: ['Tapahtui virhe :('],
            },
        },
    ];
    const parameters: DialogFlowParameters = body.sessionInfo?.parameters;
    let modifiedParameters: DialogFlowParameters = {
        symptom: [],
        sessionId: '',
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

    if (parameters) {
        messageBody[0].text.text = ['params cleared'];
        if (excludedParam) {
            modifiedParameters = {
                ...modifiedParameters,
                [excludedParam]: parameters[excludedParam],
            };
        }
    }

    const dialogFlowFulfillment: DialogFlowFulfillment = {
        fulfillmentResponse: {
            messages: messageBody,
        },
        sessionInfo: {
            parameters: modifiedParameters,
        },
    };

    return NextResponse.json<DialogFlowFulfillment>(dialogFlowFulfillment, {
        status: 200,
    });
}
