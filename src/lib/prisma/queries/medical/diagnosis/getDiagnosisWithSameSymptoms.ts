import { prisma } from '@/lib/prisma/prismaInit';
import { findDiagnosisWithSameSymptoms } from '@/lib/prisma/prismaQueryObjects';
import type { DiangnosisArrayReturnTypes } from '@/lib/types/prisma.types';

async function getDiagnosisWithSameSymptoms(
    diagnosisId: number,
    symptoms: string[]
): Promise<DiangnosisArrayReturnTypes> {
    try {
        const queryObject = findDiagnosisWithSameSymptoms(
            diagnosisId,
            symptoms
        );
        const diagnosis = await prisma.diagnosis.findMany(queryObject);

        return {
            error: false,
            errorMessage: '',
            diagnosis,
        };
    } catch (error: any) {
        console.error(error.message);
        return {
            error: true,
            errorMessage: error.message,
            diagnosis: [],
        };
    }
}

export default getDiagnosisWithSameSymptoms;
