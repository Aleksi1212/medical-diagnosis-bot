import { prisma } from '@/lib/prisma/prismaInit';
import type {
    DiagnosisSeverity,
    DiangnosisArrayReturnTypes,
} from '@/lib/types/prisma.types';

import { diagnosisCreateQuery } from '@/lib/prisma/prismaQueryObjects';
import getSymptoms from '../symptoms/getSymptoms';

async function createDiagnosis(
    diagnosisName: string,
    severity: DiagnosisSeverity,
    symptoms: string[]
): Promise<DiangnosisArrayReturnTypes> {
    try {
        const symptomCreationData = await getSymptoms(symptoms);
        const queryObject = diagnosisCreateQuery(
            diagnosisName,
            severity,
            symptomCreationData
        );

        const diagnosis = await prisma.diagnosis.create(queryObject);
        return {
            error: false,
            errorMessage: '',
            diagnosis: [diagnosis],
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

export default createDiagnosis;
