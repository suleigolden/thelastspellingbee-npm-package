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
exports.getReCaptchaQuestion = void 0;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../config/index");
const API_URL = index_1.config.baseUrl.default;
function getReCaptchaQuestion(questionType, wordLength, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${API_URL}re-captcha/${questionType}/${wordLength}/${apiKey}`);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response && error.response.status === 409) {
                console.log('Request failed with status code 409');
            }
            else {
                console.error(error);
            }
        }
    });
}
exports.getReCaptchaQuestion = getReCaptchaQuestion;
//# sourceMappingURL=getReCaptchaQuestion.js.map