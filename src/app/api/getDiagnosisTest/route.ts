import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import getDiagnosis from '@/medicalQueries/diagnosis/getDiagnosis';

export async function GET(request: NextRequest) {
    const diagnosis = await getDiagnosis(['vomiting', 'itching']);
    return NextResponse.json(diagnosis);
}
