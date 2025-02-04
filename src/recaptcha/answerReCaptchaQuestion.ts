import axios from 'axios';
import { config } from '../config/index';
import { QuestionType } from './getReCaptchaQuestion';

const API_URL = config.baseUrl.default;

async function answerReCaptchaQuestion(
    question: string | number, 
    answer: string | number, 
    apiKey: string,
    type?: QuestionType,
    hiddenValue?: string
) {
    try {
        const response = await axios.post(
            `${API_URL}check-answer`,
            {
                question,
                answer,
                type: type ?? "null",
                hiddenValue: hiddenValue ?? 'null'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apiKey': apiKey
                }
            }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Request failed with status ${response.status}: --${response.data.errorMessage}`);
        }
    } catch (error: any) {
        if (error.response) {
            console.error('Error response:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            throw new Error(error.response.data.message || 'Request failed');
        } else if (error.request) {
            throw new Error(`Request failed: ${error.message}`);
        } else {
            console.error(error);
            throw new Error(`Request failed: ${error.message}`);
        }
    }
}

export { answerReCaptchaQuestion };
