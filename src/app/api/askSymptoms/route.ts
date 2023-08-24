import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

// import getDiagnosis from '@/lib/medicalQueries/diagnosis/getDiagnosis';
import type { Symptom } from '@/lib/prisma/prismaInit';
import findSymptomWithSameDiagnosiId from '@/lib/utils/diagnosis/findSymptomWithSameDiangosisId';
import getRandomNumber from '@/lib/utils/anon/getRandomNumber';

interface QuestionParameters extends DialogFlowParameters {
    endQuestions: StringBoolean;
    answer: string;
}
interface QuestionFulfillment extends DialogFlowFulfillment {
    sessionInfo: {
        parameters: QuestionParameters;
    };
}

export async function POST(request: NextRequest) {
    const sessionStore = kv;
    const body = await request.json();

    let messageBody: MessageBody[] = [
        {
            text: {
                text: ['En saanut vastausta :('],
            },
        },
    ];
    const parameters: QuestionParameters = body.sessionInfo?.parameters;

    if (parameters) {
        console.log(parameters)
        const { symptom, sessionId, diagnosisId, answer, asking } = parameters;
        let sessionData: Symptom[] = [];

        if (sessionId && answer === 'Joo') {
            sessionData = (await sessionStore.get(sessionId)) as Symptom[];
            const nextSymptom = await findSymptomWithSameDiagnosiId(
                diagnosisId,
                sessionData
            );

            parameters.symptom = [...symptom, asking];
            parameters.asking = nextSymptom?.name || '';
            parameters.answer = ''
            // parameters.diagnosisId = nextSymptom?.diagnosis[0].diagnosisId || 0

            messageBody[0].text.text = [`Tunnetko ${nextSymptom?.name}`];
        } else if (sessionId && answer === 'Ei') {
            sessionData = (await sessionStore.get(sessionId)) as Symptom[];

            const randomIndex = getRandomNumber(sessionData.length)
            const nextSymptom = sessionData[randomIndex]

            parameters.asking = nextSymptom.name
            parameters.diagnosisId = nextSymptom.diagnosis[0].diagnosisId
            parameters.answer = ''
            
            messageBody[0].text.text = [`Tunnetko ${nextSymptom.name}`]
        }
    }

    const dialogFlowFulfillment: QuestionFulfillment = {
        fulfillmentResponse: {
            messages: messageBody,
        },
        sessionInfo: {
            parameters,
        },
    };

    return NextResponse.json<QuestionFulfillment>(dialogFlowFulfillment, {
        status: 200,
    });
}
