"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.TheLastSpellingBeeReCaptcha = void 0;
const react_1 = __importStar(require("react"));
const recaptcha_1 = require("../recaptcha");
const react_2 = require("@chakra-ui/react");
const icons_1 = require("@chakra-ui/icons");
const CircleLoader_1 = __importDefault(require("./CircleLoader"));
const TheLastSpellingBeeReCaptcha = ({ questionType = 'CHARACTERS', wordLength = 3, reCaptchaKey, onVerifyCaptcha }) => {
    const [answer, setAnswer] = (0, react_1.useState)('');
    const [question, setQuestion] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isVerified, setIsVerified] = (0, react_1.useState)(false);
    const toast = (0, react_2.useToast)();
    const fetchQuestion = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!reCaptchaKey) {
            toast({
                title: 'Error',
                description: 'ReCaptcha key not provided',
                status: 'error',
                duration: 3000
            });
            return;
        }
        try {
            const response = yield (0, recaptcha_1.getReCaptchaQuestion)(questionType, wordLength, reCaptchaKey);
            if ((_a = response[0]) === null || _a === void 0 ? void 0 : _a.question) {
                setQuestion(parseQuestion(response[0].question));
            }
        }
        catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch question',
                status: 'error',
                duration: 3000
            });
        }
    });
    const parseQuestion = (input) => {
        const hasAlphaNumeric = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(input.replace(/[^\w\s]/gi, ''));
        if (hasAlphaNumeric)
            return input.split('-');
        if (/[a-zA-Z]/.test(input))
            return input.split('');
        return input.split('-');
    };
    const verifyAnswer = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!answer.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter an answer',
                status: 'warning',
                duration: 3000
            });
            return;
        }
        setIsLoading(true);
        try {
            const formattedQuestion = question.join(/^\d/.test(question[0]) ? '-' : '');
            const result = yield (0, recaptcha_1.answerReCaptchaQuestion)(formattedQuestion, answer, reCaptchaKey);
            setIsVerified(result.verified);
            onVerifyCaptcha(result.verified);
            if (!result.verified) {
                toast({
                    title: 'Incorrect Answer',
                    description: 'Please try again',
                    status: 'error',
                    duration: 3000
                });
                setAnswer('');
            }
        }
        catch (error) {
            toast({
                title: 'Error',
                description: 'Verification failed',
                status: 'error',
                duration: 3000
            });
        }
        finally {
            setIsLoading(false);
        }
    });
    const getStyleProps = () => {
        const colors = [
            '#ff6347', '#4682b4', '#6a5acd', '#008080',
            '#a6d9fd', '#73c2fb', '#F26B3A', '#db7093',
            '#ffa07a', '#9acd32'
        ];
        return {
            color: colors[Math.floor(Math.random() * colors.length)],
            border: Math.random() >= 0.5
                ? `2px dotted ${colors[Math.floor(Math.random() * colors.length)]}`
                : `1px ${colors[Math.floor(Math.random() * colors.length)]} solid`
        };
    };
    const handleInputChange = (e) => {
        const value = e.target.value;
        const lastChar = value[value.length - 1];
        // Only allow one character at a time (prevent paste)
        if (value.length > answer.length + 1) {
            toast({
                title: 'Warning',
                description: 'Please type the answer manually',
                status: 'warning',
                duration: 2000
            });
            return;
        }
        // Only allow letters and numbers
        if (lastChar && /^[a-zA-Z0-9]$/.test(lastChar)) {
            setAnswer(value.toUpperCase());
        }
    };
    const handleKeyDown = (e) => {
        // Prevent paste operation
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'v' || e.key === 'V') {
                e.preventDefault();
                toast({
                    title: 'Warning',
                    description: 'Please type the answer manually',
                    status: 'warning',
                    duration: 2000
                });
                return;
            }
        }
        // Handle Enter key
        if (e.key === 'Enter') {
            e.preventDefault();
            verifyAnswer();
        }
    };
    (0, react_1.useEffect)(() => {
        fetchQuestion();
    }, []);
    return (react_1.default.createElement(react_2.VStack, { spacing: 4, p: 6, borderRadius: "lg", boxShadow: "sm", bg: "white", width: "100%", maxW: "400px" },
        react_1.default.createElement(react_2.FormControl, null,
            react_1.default.createElement(react_2.VStack, { spacing: 4, align: "stretch" },
                react_1.default.createElement(react_2.FormLabel, { fontWeight: "bold" },
                    react_1.default.createElement(react_2.Text, null, "I'm not a robot"),
                    react_1.default.createElement(react_2.Text, { color: "blue.500", fontSize: "sm" }, "TheLastSpellingBee Re-Captcha")),
                react_1.default.createElement(react_2.Box, null,
                    react_1.default.createElement(react_2.Text, { fontWeight: "bold", mb: 2 }, "IF A = 1, B = 2, 1 = A, 2 = B. What is"),
                    react_1.default.createElement(react_2.Flex, { align: "center", wrap: "wrap", gap: 2 },
                        question.map((char, index) => (react_1.default.createElement(react_2.Box, Object.assign({ key: index, fontSize: "xl", p: 2, borderRadius: "md", backgroundColor: "white", boxShadow: "sm" }, getStyleProps()), char))),
                        !isVerified && (react_1.default.createElement(react_2.IconButton, { "aria-label": "Refresh captcha", icon: react_1.default.createElement(icons_1.RepeatIcon, null), size: "sm", onClick: fetchQuestion, ml: 2 })))),
                isVerified ? (react_1.default.createElement(CircleLoader_1.default, { loadComplete: true, setLoadComplete: () => { } })) : (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(react_2.Input, { value: answer, onChange: handleInputChange, onKeyDown: handleKeyDown, onPaste: (e) => {
                            e.preventDefault();
                            toast({
                                title: 'Warning',
                                description: 'Please type the answer manually',
                                status: 'warning',
                                duration: 2000
                            });
                        }, placeholder: "Type your answer", size: "lg", autoComplete: "off", spellCheck: "false" }),
                    react_1.default.createElement(react_2.Button, { onClick: verifyAnswer, colorScheme: "blue", isLoading: isLoading, width: "full" }, "Verify")))))));
};
exports.TheLastSpellingBeeReCaptcha = TheLastSpellingBeeReCaptcha;
//# sourceMappingURL=TheLastSpellingBeeReCaptcha.js.map