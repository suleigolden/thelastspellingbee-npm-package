import { QuestionType } from './getReCaptchaQuestion';
declare function answerReCaptchaQuestion(question: string, answer: string, apiKey: string, type?: QuestionType, hiddenValue?: string): Promise<any>;
export { answerReCaptchaQuestion };
