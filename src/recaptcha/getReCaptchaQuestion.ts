import axios from 'axios';
import { config } from '../config/index';

const API_URL = config.baseUrl.default;
export const QuestionType = [
    'CHARACTERS',
    'NUMBERS',
    'RANDOM',
    'COMPLEX',
  ] as const;
  
export type QuestionType = (typeof QuestionType)[number];

async function getReCaptchaQuestion(questionType: QuestionType, wordLength: number, apiKey: string) {
    try {
        const response = await axios.get(`${API_URL}generate/${questionType}/${wordLength}/${apiKey}`);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 409) {
            console.log('Request failed with status code 409');
        } else {
            console.error(error);
        }
    }
}

export { getReCaptchaQuestion };
