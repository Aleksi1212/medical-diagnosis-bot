import { prisma } from '@/lib/prisma/prismaInit';
import {
    findMutltipleDiagnosisQuery,
    findSymptomsFromDiagnosisQuery,
} from '@/lib/prisma/prismaQueryObjects';
import type { SymptomReturnTypes } from '@/lib/types/prisma.types';

async function getSymptomsFromDiagnosis(
    symptoms: string[]
): Promise<SymptomReturnTypes> {
    try {
        const diagnosisQueryObject = findMutltipleDiagnosisQuery(symptoms);
        const diagnosis = await prisma.diagnosis.findMany(diagnosisQueryObject);
        const diagnosisIds = diagnosis.map((obj) => obj.id);

        const symptomsQueryObject =
            findSymptomsFromDiagnosisQuery(diagnosisIds);
        const possibleSymptoms = await prisma.symptom.findMany(
            symptomsQueryObject
        );

        return {
            error: false,
            errorMessage: '',
            possibleSymptoms,
        };
    } catch (error: any) {
        console.error(error);
        return {
            error: true,
            errorMessage: error.message,
            possibleSymptoms: [],
        };
    }
}

export default getSymptomsFromDiagnosis;
