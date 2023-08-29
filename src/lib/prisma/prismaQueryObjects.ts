import type { DiagnosisSeverity, SymptomQuery } from '../types/prisma.types';

const findSingleDiagnosisQuery = (diagnosisId: number) => {
    return {
        where: {
            id: diagnosisId,
        },
    };
};

const findMutltipleDiagnosisQuery = (symptoms: string[]) => {
    return {
        where: {
            symptoms: {
                some: {
                    symptom: {
                        name: { in: symptoms }
                    }
                }
            }
        },
    };
};
const findDiagnosisWithSameSymptoms = (
    diagnosisId: number,
    symptoms: string[]
) => {
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
            id: {
                not: diagnosisId,
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

const findSymptomIdQuery = (symptoms: string[]) => {
    return {
        where: {
            name: { in: symptoms },
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
    findSingleDiagnosisQuery,
    findMutltipleDiagnosisQuery,
    findDiagnosisWithSameSymptoms,
    findCreatedSymptomsQuery,
    findSymptomsFromDiagnosisQuery,
    diagnosisCreateQuery,
    findSymptomIdQuery,
};
