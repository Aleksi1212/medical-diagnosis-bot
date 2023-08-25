import { prisma } from '@/lib/prisma/prismaInit';
import type { DiagnosisReturnTypes, Diagnosis } from '@/lib/types/prisma.types';
import { findSingleDiagnosisQuery } from '@/lib/prisma/prismaQueryObjects';

async function getDiagnosis(
    diagnosisId: number
): Promise<DiagnosisReturnTypes> {
    try {
        const diagnosisQueryObject = findSingleDiagnosisQuery(diagnosisId);
        const diagnosis = (await prisma.diagnosis.findUnique(
            diagnosisQueryObject
        )) as Diagnosis;

        return {
            error: false,
            errorMessage: '',
            diagnosis,
        };
    } catch (error: any) {
        console.error(error);
        return {
            error: true,
            errorMessage: error.message,
            diagnosis: {
                id: 0,
                name: '',
                severity: 'MEDIUM',
            },
        };
    }
}

export default getDiagnosis;
