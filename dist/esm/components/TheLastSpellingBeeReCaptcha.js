var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState } from 'react';
import { getReCaptchaQuestion, answerReCaptchaQuestion } from '../recaptcha';
import { Box, FormControl, FormLabel, Button, Text, Flex, IconButton } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import CircleLoader from './CircleLoader';
import ActionAlert from './ActionAlert';
export const TheLastSpellingBeeReCaptcha = ({ questionType, wordLength, reCaptchaKey, refreshonVerifyReCaptcha, refreshReCaptcha, onVerifyCaptcha }) => {
    const [formData, setFormData] = useState({
        answer: ''
    });
    const { answer } = formData;
    const [rQuestion, setRQuestion] = useState('');
    const [answerMessage, setAnswerMessage] = useState('');
    const [loadComplete, setLoadComplete] = useState(false);
    const [captchaResult, setCaptchaResult] = useState(false);
    const getCaptchaQuestion = () => __awaiter(void 0, void 0, void 0, function* () {
        const qType = questionType ? questionType : 'CHARACTERS';
        const wLength = wordLength ? wordLength : 3;
        if (!reCaptchaKey) {
            setRQuestion('recaptcha key not provided');
            return;
        }
        return yield getReCaptchaQuestion(qType, wLength, reCaptchaKey);
    });
    const removeSpecialCharacters = (str) => {
        return str.replace(/[^\w\s]/gi, '');
    };
    const splitQuestion = (stringChar) => {
        let regExp = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
        const check = regExp.test(removeSpecialCharacters(stringChar));
        if (check) {
            return stringChar.split('-');
        }
        if (stringChar.toLowerCase() !== stringChar.toUpperCase()) {
            return stringChar.split('');
        }
        return stringChar.split('-');
    };
    useEffect(() => {
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield getCaptchaQuestion();
                if (response.question) {
                    setRQuestion(splitQuestion(response.question));
                }
            }
            catch (error) {
                console.error(error);
            }
        });
        fetchData();
    }, []);
    const refreshQuestion = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield getCaptchaQuestion();
            if (response.question) {
                setRQuestion(splitQuestion(response.question));
            }
        }
        catch (error) {
            console.error(error);
        }
    });
    const checkIfNumber = (char) => {
        if (parseInt(char) > 0) {
            return true;
        }
        return false;
    };
    const validateCurrentQuestion = (stringQuestion) => {
        if (!checkIfNumber(stringQuestion[0])) {
            //If question is String
            return rQuestion.toString().replace(/,/g, '');
        }
        return rQuestion.toString().replace(/,/g, '-');
    };
    const answerRecaptcha = (question, answer, apiKey) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield answerReCaptchaQuestion(question, answer, apiKey);
            onVerifyCaptcha(result.message);
            if (result.message) {
                setLoadComplete(!loadComplete);
                setCaptchaResult(true);
                setAnswerMessage('yes');
            }
            else {
                setAnswerMessage('no');
            }
        }
        catch (error) {
            console.error(error);
        }
        return true;
    });
    const onSubmit = (e) => {
        e.preventDefault();
        answerRecaptcha(validateCurrentQuestion(rQuestion), answer, reCaptchaKey);
        setFormData({ answer: '' });
        return true;
    };
    const onChange = (e) => {
        setFormData((prevState) => (Object.assign(Object.assign({}, prevState), { [e.target.name]: e.target.value.toUpperCase() })));
    };
    const getRandomColor = () => {
        const colors = [
            '#ff6347', // Tomato
            '#4682b4', // Steel Blue
            '#6a5acd', // Slate Blue
            '#008080', // Teal
            '#a6d9fd',
            '#73c2fb',
            '#F26B3A',
            '#db7093', // Pale Violet Red
            '#ffa07a', // Light Salmon
            '#9acd32' // Yellow Green
        ];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };
    const getRandomBoolean = () => {
        return Math.random() >= 0.5;
    };
    return (React.createElement(Flex, { direction: "column", p: "4", style: { boxShadow: 'sm', borderRadius: 'md' } },
        React.createElement(FormControl, null,
            React.createElement(FormLabel, { style: { display: 'flex', flexDirection: 'column' } },
                "I'm not a robot ..",
                ' ',
                React.createElement(Text, { as: "b", style: { color: '#F26B3A' } }, "TheLastSpellingBee Re-Captcha")),
            React.createElement(Text, { style: { marginTop: '20px', marginBottom: '20px' } },
                React.createElement("b", null, "IF A = 1, B = 2, 1 = A, 2 = B. What is"),
                Object.keys(rQuestion).map((key, index) => (React.createElement(Box, { as: "span", key: index, style: {
                        fontSize: '22px',
                        border: getRandomBoolean() ? `2px dotted ${getRandomColor()}` : `1px ${getRandomColor()} solid`,
                        marginLeft: '8px',
                        backgroundColor: 'white',
                        color: getRandomColor(),
                        padding: '8px',
                        borderRadius: 'md',
                        boxShadow: 'sm',
                    } }, rQuestion[key]))),
                !captchaResult && (React.createElement(IconButton, { "aria-label": "Refresh captcha", icon: React.createElement(RepeatIcon, null), size: "sm", ml: "4", onClick: refreshQuestion, style: { marginLeft: '16px' } }))),
            !captchaResult ? (React.createElement("input", { type: "text", style: {
                    display: 'block',
                    width: '100%',
                    height: '34px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    lineHeight: '1.42857143',
                    color: '#555',
                    backgroundColor: '#FFF',
                    backgroundImage: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
                    boxSizing: 'border-box',
                    transition: 'border-color ease-in-out .15s, box-shadow ease-in-out .15s',
                    marginTop: '6px',
                }, id: "answer", name: "answer", value: answer, placeholder: "Answer", onChange: onChange, required: true })) : (React.createElement(CircleLoader, { loadComplete: loadComplete, setLoadComplete: setLoadComplete })),
            !captchaResult && (React.createElement(Button, { mt: "4", colorScheme: "blue", h: 8, fontSize: "sm", padding: "12px", onClick: onSubmit, style: { marginTop: '16px', height: '32px', fontSize: '12px', padding: '12px' } }, "Verify"))),
        React.createElement(ActionAlert, { alertMessage: answerMessage })));
};
//# sourceMappingURL=TheLastSpellingBeeReCaptcha.js.map