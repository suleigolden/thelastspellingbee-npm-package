var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { config } from '../config/index';
const API_URL = config.baseUrl.default;
export const QuestionType = [
    'CHARACTERS',
    'NUMBERS',
    'RANDOM',
    'COMPLEX',
];
function getReCaptchaQuestion(questionType, wordLength, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get(`${API_URL}generate/${questionType}/${wordLength}/${apiKey}`);
            return response.data;
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 409) {
                console.log('Request failed with status code 409');
            }
            else {
                console.error(error);
            }
        }
    });
}
export { getReCaptchaQuestion };
//# sourceMappingURL=getReCaptchaQuestion.js.map