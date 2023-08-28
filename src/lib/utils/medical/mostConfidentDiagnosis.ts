function mostConfidentDiagnosis(diagnosisIds: number[]): number {
    const frequencyMap = new Map();

    for (const element of diagnosisIds) {
        if (frequencyMap.has(element)) {
            frequencyMap.set(element, frequencyMap.get(element) + 1);
        } else {
            frequencyMap.set(element, 1);
        }
    }

    let maxFrequency = 0;
    let mostFrequentElement;

    for (const [element, frequency] of [...frequencyMap]) {
        if (frequency > maxFrequency) {
            maxFrequency = frequency;
            mostFrequentElement = element;
        }
    }

    return mostFrequentElement;
}

export default mostConfidentDiagnosis;
