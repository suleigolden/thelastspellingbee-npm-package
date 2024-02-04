import axios from 'axios';
import { config } from '../config/index';

const API_URL = config.baseUrl.default;

async function getReCaptchaQuestion(questionType: any, wordLength: number, apiKey: any) {
    try {
        const response = await axios.get(`${API_URL}re-captcha/${questionType}/${wordLength}/${apiKey}`);
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
