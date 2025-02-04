"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerReCaptchaQuestion = answerReCaptchaQuestion;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../config/index");
const API_URL = index_1.config.baseUrl.default;
function answerReCaptchaQuestion(question, answer, apiKey, type, hiddenValue) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(`${API_URL}check-answer`, {
                question,
                answer,
                type: type !== null && type !== void 0 ? type : "null",
                hiddenValue: hiddenValue !== null && hiddenValue !== void 0 ? hiddenValue : 'null'
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'apiKey': apiKey
                }
            });
            if (response.status === 200) {
                return response.data;
            }
            else {
                throw new Error(`Request failed with status ${response.status}: --${response.data.errorMessage}`);
            }
        }
        catch (error) {
            if (error.response) {
                console.error('Error response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
                throw new Error(error.response.data.message || 'Request failed');
            }
            else if (error.request) {
                throw new Error(`Request failed: ${error.message}`);
            }
            else {
                console.error(error);
                throw new Error(`Request failed: ${error.message}`);
            }
        }
    });
}
//# sourceMappingURL=answerReCaptchaQuestion.js.map