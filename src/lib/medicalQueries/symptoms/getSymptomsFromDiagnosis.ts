// import { prisma, type DiagnosisReturnTypes } from '@/lib/prisma/prismaInit';
// import {
//     findDiagnosisQuery,
//     findSymptomsFromDiagnosisQuery,
// } from '@/lib/prisma/prismaQueryObjects';

// async function getSymptomsFromDiagnosis(
//     symptoms: string[]
// ): Promise<DiagnosisReturnTypes> {
//     try {
//         const diagnosisQueryObject = findDiagnosisQuery(symptoms);
//         const diagnosis = await prisma.diagnosis.findMany(diagnosisQueryObject);
//         const diagnosisIds = diagnosis.map((obj) => obj.id);

//         const symptomsQueryObject =
//             findSymptomsFromDiagnosisQuery(diagnosisIds);
//         const everySymptom = await prisma.symptom.findMany(symptomsQueryObject);

//         return {
//             error: false,
//             errorMessage: '',
//             diagnosis,
//             everySymptom,
//         };
//     } catch (error: any) {
//         console.error(error);
//         return {
//             error: true,
//             errorMessage: error.message,
//             diagnosis: [],
//             everySymptom: [],
//         };
//     }
// }

// export default getSymptomsFromDiagnosis;
