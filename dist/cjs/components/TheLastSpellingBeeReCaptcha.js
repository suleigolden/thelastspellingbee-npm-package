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
const CircleLoader_1 = __importDefault(require("./CircleLoader"));
const CHAR_COLORS = [
    '#ff6347', '#4682b4', '#6a5acd', '#008080',
    '#a6d9fd', '#73c2fb', '#F26B3A', '#db7093',
    '#ffa07a', '#9acd32'
];
function RefreshIcon() {
    return (react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true },
        react_1.default.createElement("path", { d: "M23 4v6h-6M1 20v-6h6" }),
        react_1.default.createElement("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })));
}
const TheLastSpellingBeeReCaptcha = ({ questionType = 'CHARACTERS', wordLength = 3, reCaptchaKey, onVerifyCaptcha, isDarkMode = false, darkModeColor }) => {
    const [answer, setAnswer] = (0, react_1.useState)('');
    const [question, setQuestion] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isVerified, setIsVerified] = (0, react_1.useState)(false);
    const [toast, setToast] = (0, react_1.useState)(null);
    const isDark = isDarkMode;
    const containerBg = isDark ? (darkModeColor || '#0b1437') : '#ffffff';
    const themeVars = isDark
        ? {
            ['--tlsb-bg']: containerBg,
            ['--tlsb-text']: 'rgba(255,255,255,0.92)',
            ['--tlsb-subtext']: '#90cdf4',
            ['--tlsb-input-bg']: 'rgba(255,255,255,0.12)',
            ['--tlsb-input-border']: 'rgba(255,255,255,0.2)',
            ['--tlsb-input-text']: 'rgba(255,255,255,0.92)',
            ['--tlsb-captcha-box-bg']: 'rgba(255,255,255,0.08)',
            ['--tlsb-btn-bg']: '#319795',
            ['--tlsb-btn-hover']: '#2c7a7b',
        }
        : {};
    const showToast = (0, react_1.useCallback)((title, description, status = 'error') => {
        setToast({ title, description, status });
        const duration = status === 'warning' ? 2000 : 3000;
        const t = setTimeout(() => setToast(null), duration);
        return () => clearTimeout(t);
    }, []);
    const fetchQuestion = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!reCaptchaKey) {
            showToast('Error', 'ReCaptcha key not provided', 'error');
            return;
        }
        try {
            const response = yield (0, recaptcha_1.getReCaptchaQuestion)(questionType, wordLength, reCaptchaKey);
            if ((_a = response[0]) === null || _a === void 0 ? void 0 : _a.question) {
                setQuestion(parseQuestion(response[0].question));
            }
        }
        catch (_b) {
            showToast('Error', 'Failed to fetch question', 'error');
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
        var _a;
        if (!answer.trim()) {
            showToast('Error', 'Please enter an answer', 'warning');
            return;
        }
        setIsLoading(true);
        try {
            const formattedQuestion = question.join(/^\d/.test((_a = question[0]) !== null && _a !== void 0 ? _a : '') ? '-' : '');
            const result = yield (0, recaptcha_1.answerReCaptchaQuestion)(formattedQuestion, answer, reCaptchaKey);
            setIsVerified(result.verified);
            onVerifyCaptcha(result.verified);
            if (!result.verified) {
                showToast('Incorrect Answer', 'Please try again', 'error');
                setAnswer('');
            }
        }
        catch (_b) {
            showToast('Error', 'Verification failed', 'error');
        }
        finally {
            setIsLoading(false);
        }
    });
    const getCharStyle = () => {
        const color = CHAR_COLORS[Math.floor(Math.random() * CHAR_COLORS.length)];
        const borderColor = CHAR_COLORS[Math.floor(Math.random() * CHAR_COLORS.length)];
        return {
            color,
            border: Math.random() >= 0.5
                ? `2px dotted ${borderColor}`
                : `1px solid ${borderColor}`
        };
    };
    const handleInputChange = (e) => {
        const value = e.target.value;
        const lastChar = value[value.length - 1];
        if (value.length > answer.length + 1) {
            showToast('Warning', 'Please type the answer manually', 'warning');
            return;
        }
        if (lastChar && /^[a-zA-Z0-9]$/.test(lastChar)) {
            setAnswer(value.toUpperCase());
        }
    };
    const handleKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'v' || e.key === 'V') {
                e.preventDefault();
                showToast('Warning', 'Please type the answer manually', 'warning');
                return;
            }
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            verifyAnswer();
        }
    };
    (0, react_1.useEffect)(() => {
        fetchQuestion();
    }, []);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "tlsb-recaptcha", style: themeVars, role: "form", "aria-label": "TheLastSpellingBee ReCaptcha" },
            react_1.default.createElement("div", { className: "tlsb-recaptcha__form" },
                react_1.default.createElement("header", { className: "tlsb-recaptcha__header" },
                    react_1.default.createElement("h2", { className: "tlsb-recaptcha__title" }, "I'm not a robot"),
                    react_1.default.createElement("p", { className: "tlsb-recaptcha__subtitle" }, "TheLastSpellingBee Re-Captcha")),
                react_1.default.createElement("p", { className: "tlsb-recaptcha__instruction" }, "IF A = 1, B = 2, 1 = A, 2 = B. What is"),
                react_1.default.createElement("div", { className: "tlsb-recaptcha__chars" },
                    question.map((char, index) => (react_1.default.createElement("span", { key: index, className: "tlsb-recaptcha__char", style: getCharStyle() }, char))),
                    !isVerified && (react_1.default.createElement("button", { type: "button", className: "tlsb-recaptcha__refresh", onClick: fetchQuestion, "aria-label": "Refresh captcha" },
                        react_1.default.createElement(RefreshIcon, null)))),
                isVerified ? (react_1.default.createElement("div", { className: "tlsb-recaptcha__loader" },
                    react_1.default.createElement(CircleLoader_1.default, { loadComplete: true, setLoadComplete: () => { } }))) : (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("input", { type: "text", className: "tlsb-recaptcha__input", value: answer, onChange: handleInputChange, onKeyDown: handleKeyDown, onPaste: (e) => {
                            e.preventDefault();
                            showToast('Warning', 'Please type the answer manually', 'warning');
                        }, placeholder: "Type your answer", autoComplete: "off", spellCheck: false, "aria-label": "Your answer" }),
                    react_1.default.createElement("button", { type: "button", className: "tlsb-recaptcha__btn", onClick: verifyAnswer, disabled: isLoading }, isLoading ? 'Verifying…' : 'Verify'))))),
        toast && (react_1.default.createElement("div", { className: `tlsb-recaptcha__toast tlsb-recaptcha__toast--${toast.status}`, role: "alert" },
            react_1.default.createElement("strong", null, toast.title),
            toast.description && ` — ${toast.description}`))));
};
exports.TheLastSpellingBeeReCaptcha = TheLastSpellingBeeReCaptcha;
//# sourceMappingURL=TheLastSpellingBeeReCaptcha.js.map