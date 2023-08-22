import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

import createDiagnosis from '@/lib/medicalQueries/diagnosis/createDiagnosis';
import type { DiagnosisSeverity } from '@/lib/prisma/prismaInit';

interface DiagnosisData {
    name: string;
    severity: DiagnosisSeverity;
    symptoms: string[];
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const diagnosisData: DiagnosisData[] = body.diagnosisData || [];
    let createdDiagnosis: any[] = [];

    if (diagnosisData.length < 1) {
        return NextResponse.json('No data received');
    }

    for (const data in diagnosisData) {
        const { name, severity, symptoms } = diagnosisData[data];
        const { error, errorMessage, diagnosis } = await createDiagnosis(
            name,
            severity,
            symptoms
        );

        if (error) {
            console.log(
                '\x1b[31m%s\x1b[0m',
                `An error ocurred: ${errorMessage}`
            );
            continue;
        }
        createdDiagnosis.push(diagnosis);
    }

    return NextResponse.json(createdDiagnosis, { status: 201 });
}
