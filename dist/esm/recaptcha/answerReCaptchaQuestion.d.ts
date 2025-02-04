import { QuestionType } from './getReCaptchaQuestion';
declare function answerReCaptchaQuestion(question: string | number, answer: string | number, apiKey: string, type?: QuestionType, hiddenValue?: string): Promise<any>;
export { answerReCaptchaQuestion };
