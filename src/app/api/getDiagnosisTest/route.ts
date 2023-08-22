import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import getDiagnosis from '@/lib/medicalQueries/diagnosis/getDiagnosis';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const symptoms = searchParams.get('symptoms');
    let decoded: any[] = [];
    if (symptoms) decoded = JSON.parse(decodeURIComponent(symptoms));

    const diagnosis = await getDiagnosis(decoded);
    return NextResponse.json(diagnosis);
}
