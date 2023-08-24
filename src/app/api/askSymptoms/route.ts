import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

interface QuestionParameters extends DialogFlowParameters {
    endQuestions: StringBoolean
}
interface QuestionFulfillment extends DialogFlowFulfillment {
    sessionInfo: {
        parameters: QuestionParameters
    }
}

export async function POST(request: NextRequest) {
    return NextResponse.json('hello world', { status: 200 })
}