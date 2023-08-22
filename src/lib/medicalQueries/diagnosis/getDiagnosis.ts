import { prisma, type DiagnosisReturnTypes } from '@/lib/prisma/prismaInit';
import { findDiagnosisQuery } from '@/lib/prisma/prismaQueries';

async function getDiagnosis(symptoms: string[]): Promise<DiagnosisReturnTypes> {
    try {
        const queryObject = findDiagnosisQuery(symptoms);
        const diagnosis = await prisma.diagnosis.findMany(queryObject);

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
            diagnosis: [],
        };
    }
}

export default getDiagnosis;
