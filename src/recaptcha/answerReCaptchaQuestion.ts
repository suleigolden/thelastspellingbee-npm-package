import axios from 'axios';
import { config } from '../config/index';

const API_URL = config.baseUrl.default;

async function answerReCaptchaQuestion(question: string, answer: string, apiKey: string) {
    try {
        const response = await axios.post(
            `${API_URL}answer-re-captcha`,
            {
                question,
                answer
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    apikey: apiKey
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
            console.log(`Request failed with status ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            throw new Error(`Request failed: ${error.message}`);
        } else {
            console.error(error);
            throw new Error(`Request failed: ${error.message}`);
        }
    }
}

export { answerReCaptchaQuestion };
