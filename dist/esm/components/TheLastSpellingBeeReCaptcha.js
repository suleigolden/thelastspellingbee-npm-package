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
import { Box, FormControl, FormLabel, Button, Text, Flex, IconButton, useToast } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import CircleLoader from './CircleLoader';
export const TheLastSpellingBeeReCaptcha = ({ questionType, wordLength, reCaptchaKey, refreshonVerifyReCaptcha, refreshReCaptcha, onVerifyCaptcha }) => {
    const [formData, setFormData] = useState({
        answer: ''
    });
    const { answer } = formData;
    const [rQuestion, setRQuestion] = useState('');
    const [answerMessage, setAnswerMessage] = useState('');
    const [loadComplete, setLoadComplete] = useState(false);
    const [captchaResult, setCaptchaResult] = useState(false);
    const toast = useToast();
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
                // Handle error
                console.error(error);
            }
        });
        fetchData();
    }, []); // Empty dependency array
    const refreshQuestion = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield getCaptchaQuestion();
            if (response.question) {
                setRQuestion(splitQuestion(response.question));
            }
        }
        catch (error) {
            // Handle error
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
            setAnswerMessage(result.message);
            onVerifyCaptcha(result.message);
            if (result.message) {
                setLoadComplete(!loadComplete);
                setCaptchaResult(true);
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
                        border: '1px #a6d9fd solid',
                        marginLeft: '8px',
                        backgroundColor: 'white',
                        color: '#73c2fb',
                        padding: '8px',
                        borderRadius: 'md',
                        boxShadow: 'sm',
                    } }, rQuestion[key]))),
                !captchaResult && (React.createElement(IconButton, { "aria-label": "Refresh captcha", icon: React.createElement(RepeatIcon, null), size: "sm", ml: "4", onClick: refreshQuestion, style: { marginLeft: '16px' } }))),
            !captchaResult ? (React.createElement("input", { type: "text", className: "form-control", style: { marginTop: '6px' }, id: "answer", name: "answer", value: answer, placeholder: "Answer", onChange: onChange, required: true })) : (React.createElement(CircleLoader, { loadComplete: loadComplete, setLoadComplete: setLoadComplete })),
            !captchaResult && (React.createElement(Button, { mt: "4", colorScheme: "blue", h: 8, fontSize: "sm", padding: "12px", onClick: onSubmit, style: { marginTop: '16px', height: '32px', fontSize: '12px', padding: '12px' } }, "Verify"))),
        answerMessage && toast({
            title: "TheLastSpellingBee",
            description: captchaResult ? 'Success' : 'Try again!',
            status: captchaResult ? 'success' : 'error',
            duration: 9000,
            isClosable: true,
        })));
};
//# sourceMappingURL=TheLastSpellingBeeReCaptcha.js.map