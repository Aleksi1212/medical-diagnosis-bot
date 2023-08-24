type StringBoolean = 'True' | 'False';

interface MessageBody {
    text: {
        text: string[];
    };
}
interface DialogFlowParameters {
    symptom: string[];
    sessionId: string;
}
interface DialogFlowFulfillment {
    fulfillmentResponse: {
        messages: MessageBody[];
    };
}