import { prisma, type SymptomQuery } from '@/lib/prisma/prismaInit';
import { findCreatedSymptomsQuery } from '@/lib/prisma/prismaQueryObjects';

async function getSymptoms(symptoms: string[]): Promise<SymptomQuery[]> {
    try {
        let symptomQueryArray: SymptomQuery[] = [];

        for (const symptom in symptoms) {
            const symptomName = symptoms[symptom];

            const queryObject = findCreatedSymptomsQuery(symptomName);
            const createdSymptom = await prisma.symptom.findFirst(queryObject);

            let symptomQuery: SymptomQuery;

            if (createdSymptom) {
                const { id } = createdSymptom;
                symptomQuery = {
                    symptom: {
                        connect: { id },
                    },
                };
                symptomQueryArray.push(symptomQuery);
            } else {
                symptomQuery = {
                    symptom: {
                        create: {
                            name: symptomName,
                        },
                    },
                };
                symptomQueryArray.push(symptomQuery);
            }
            await prisma.$disconnect();
        }
        return symptomQueryArray;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export default getSymptoms;
