import axios from 'axios';
import { config } from '../config/index';
import { QuestionType } from './getReCaptchaQuestion';

const API_URL = config.baseUrl.default;

type CheckAnswerRequest = {
    apiKey: string;
    type: QuestionType | 'null';
    question: string | number;
    answer: string | number;
    hiddenValue?: string;
}

type CheckAnswerResponse = {
    verified: boolean;
}

async function answerReCaptchaQuestion(
    question: string | number, 
    answer: string | number, 
    apiKey: string,
    type?: QuestionType,
    hiddenValue?: string
): Promise<CheckAnswerResponse> {
    try {
        const requestData: CheckAnswerRequest = {
            apiKey,
            type: type ?? 'null',
            question: String(question),
            answer: String(answer),
            hiddenValue: hiddenValue ?? 'null'
        };

        const response = await axios.post<CheckAnswerResponse>(
            `${API_URL}check-answer`,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // sample response:
        // {
        //     "verified": true
        // }
        return response.data
       
    } catch (error: any) {
        if (error.response) {
            const errorResponse = error.response.data;
            throw new Error(
                Array.isArray(errorResponse.message) 
                    ? errorResponse.message.join(', ') 
                    : errorResponse.message || 'Request failed'
            );
        }
        
        if (error.request) {
            throw new Error('No response received from server');
        }
        
        throw new Error(`Request failed: ${error.message}`);
    }
}

export { answerReCaptchaQuestion, CheckAnswerRequest, CheckAnswerResponse };
