export declare const QuestionType: readonly ["CHARACTERS", "NUMBERS", "RANDOM", "COMPLEX"];
export type QuestionType = (typeof QuestionType)[number];
declare function getReCaptchaQuestion(questionType: QuestionType, wordLength: number, apiKey: string): Promise<any>;
export { getReCaptchaQuestion };
