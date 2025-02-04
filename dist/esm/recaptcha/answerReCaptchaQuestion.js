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
function answerReCaptchaQuestion(question, answer, apiKey, type, hiddenValue) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestData = {
                apiKey,
                type: type !== null && type !== void 0 ? type : 'null',
                question: String(question),
                answer: String(answer),
                hiddenValue: hiddenValue !== null && hiddenValue !== void 0 ? hiddenValue : 'null'
            };
            const response = yield axios.post(`${API_URL}check-answer`, requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // sample response:
            // {
            //     "verified": true
            // }
            return response.data;
        }
        catch (error) {
            if (error.response) {
                const errorResponse = error.response.data;
                throw new Error(Array.isArray(errorResponse.message)
                    ? errorResponse.message.join(', ')
                    : errorResponse.message || 'Request failed');
            }
            if (error.request) {
                throw new Error('No response received from server');
            }
            throw new Error(`Request failed: ${error.message}`);
        }
    });
}
export { answerReCaptchaQuestion };
//# sourceMappingURL=answerReCaptchaQuestion.js.map