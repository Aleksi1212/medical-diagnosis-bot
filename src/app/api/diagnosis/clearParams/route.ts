import { type NextRequest, NextResponse } from 'next/server';
import type {
    DialogFlowFulfillment,
    DialogFlowParameters,
    MessageBody,
} from '@/lib/types/dialogflow.types';
import removeKeysFromObjects from '@/lib/utils/anon/removeKeysFromObject';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const excludedParam = searchParams.get('exclude');

    const messageBody: MessageBody[] = [
        {
            text: {
                text: ['Tapahtui virhe :('],
            },
        },
    ];
    const parameters: DialogFlowParameters = body.sessionInfo?.parameters;
    let modifiedParameters: any = {};

    if (parameters) {
        messageBody[0].text.text = [''];
        if (excludedParam) {
            modifiedParameters = removeKeysFromObjects(
                parameters,
                excludedParam
            );
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
