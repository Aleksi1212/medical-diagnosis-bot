import { prisma, type SymptomQuery } from '@/lib/prisma/prismaInit';
import { findCreatedSymptomsQuery } from '@/lib/prisma/prismaQueries';

async function getSymptoms(symptoms: string[]): Promise<SymptomQuery[]> {
    try {
        const queryObject = findCreatedSymptomsQuery(symptoms);
        const createdSymptoms = await prisma.symptom.findMany(queryObject);

        if (createdSymptoms.length > 0) {
            return createdSymptoms.map((symptom) => {
                const { id, name } = symptom;
                return {
                    symptom: {
                        connect: { id, name },
                    },
                };
            });
        }
        return symptoms.map((symptom) => {
            return {
                symptom: {
                    create: {
                        name: symptom,
                    },
                },
            };
        });
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export default getSymptoms
