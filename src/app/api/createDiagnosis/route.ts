import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import createDiangosis from '@/medicalQueries/diagnosis/createDiagnosis';

export async function GET(request: NextRequest) {
    // const testDiagnosis1 = await createDiangosis('Fungal infection', 'MEDIUM', ['itching', 'skin rash', 'nodal skin eruptions', 'dischromic patches'])
    // const testDiagnosis2 = await createDiangosis('Drug reaction', 'MEDIUM', ['itching', 'skin rash', 'stomach pain', 'buring micturition', 'spotting urination'])
    const test = await createDiangosis('Gastroenteritis', 'MEDIUM', [
        'vomiting',
        'sunken eyes',
        'dehydration',
        'diarrhoea',
    ]);

    return NextResponse.json(test);
}
