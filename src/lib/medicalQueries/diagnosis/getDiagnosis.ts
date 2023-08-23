import { prisma, type DiagnosisReturnTypes } from '@/lib/prisma/prismaInit';
import {
    findDiagnosisQuery,
} from '@/lib/prisma/prismaQueryObjects';

async function getDiagnosis(symptoms: string[]): Promise<DiagnosisReturnTypes> {
    try {
        const diagnosisQueryObject = findDiagnosisQuery(symptoms);
        const diagnosis = await prisma.diagnosis.findMany(diagnosisQueryObject);

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
