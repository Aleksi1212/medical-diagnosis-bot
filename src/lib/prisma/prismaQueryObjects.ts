import type { DiagnosisSeverity, SymptomQuery } from './prismaInit';

const findDiagnosisQuery = (symptoms: string[]) => {
    return {
        where: {
            symptoms: {
                some: {
                    symptom: {
                        name: {
                            in: symptoms,
                        },
                    },
                },
            },
        },
    };
};

const findCreatedSymptomsQuery = (symptom: string) => {
    return {
        where: {
            name: symptom,
        },
    };
};

const findSymptomsFromDiagnosisQuery = (diagnosisIds: number[]) => {
    return {
        include: {
            diagnosis: true,
        },
        where: {
            diagnosis: {
                some: {
                    diagnosisId: {
                        in: diagnosisIds,
                    },
                },
            },
        },
    };
};

const diagnosisCreateQuery = (
    name: string,
    severity: DiagnosisSeverity,
    symptomQuery: SymptomQuery[]
) => {
    return {
        data: {
            name,
            severity,
            symptoms: {
                create: symptomQuery,
            },
        },
    };
};

export {
    findDiagnosisQuery,
    findCreatedSymptomsQuery,
    findSymptomsFromDiagnosisQuery,
    diagnosisCreateQuery,
};
