type StringBoolean = 'True' | 'False';

interface MessageBody {
    text: {
        text: string[];
    };
}
interface DialogFlowParameters {
    symptom: string[];
    sessionId: string;
    diagnosisId: number;
    asking: string;
    asked: string[];
    diagnosisConfidence: number[];
}
interface DialogFlowFulfillment {
    fulfillmentResponse: {
        messages: MessageBody[];
    };
}
