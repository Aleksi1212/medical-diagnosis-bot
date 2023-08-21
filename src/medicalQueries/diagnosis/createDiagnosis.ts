import {
    prisma,
    type DiagnosisReturnTypes,
    type DiagnosisSeverity,
} from '@/lib/prisma/prismaInit';

import { diagnosisCreateQuery } from '@/lib/prisma/prismaQueries';
import getSymptoms from '../symptoms/getSymptoms';

async function createDiangosis(
    diagnosisName: string,
    severity: DiagnosisSeverity,
    symptoms: string[]
): Promise<DiagnosisReturnTypes> {
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

export default createDiangosis;
