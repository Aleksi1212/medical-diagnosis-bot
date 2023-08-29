import { NextResponse, type NextRequest } from 'next/server';
import makeBetterSymptomQuestion from '@/lib/openAi/queries/betterQuestion';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const symptom = searchParams.get('symptom') || ''
    const test = await makeBetterSymptomQuestion(symptom)
    return NextResponse.json(test)
}