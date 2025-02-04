import { QuestionType } from './getReCaptchaQuestion';
type CheckAnswerRequest = {
    apiKey: string;
    type: QuestionType | 'null';
    question: string | number;
    answer: string | number;
    hiddenValue?: string;
};
type CheckAnswerResponse = {
    verified: boolean;
};
declare function answerReCaptchaQuestion(question: string | number, answer: string | number, apiKey: string, type?: QuestionType, hiddenValue?: string): Promise<CheckAnswerResponse>;
export { answerReCaptchaQuestion, CheckAnswerRequest, CheckAnswerResponse };
