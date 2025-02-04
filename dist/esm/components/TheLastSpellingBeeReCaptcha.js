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
import { Box, FormControl, FormLabel, Button, Text, Flex, IconButton, Input, useToast, VStack } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import CircleLoader from './CircleLoader';
export const TheLastSpellingBeeReCaptcha = ({ questionType = 'CHARACTERS', wordLength = 3, reCaptchaKey, onVerifyCaptcha }) => {
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const toast = useToast();
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
            const response = yield getReCaptchaQuestion(questionType, wordLength, reCaptchaKey);
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
            const result = yield answerReCaptchaQuestion(formattedQuestion, answer, reCaptchaKey);
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
    useEffect(() => {
        fetchQuestion();
    }, []);
    return (React.createElement(VStack, { spacing: 4, p: 6, borderRadius: "lg", boxShadow: "sm", bg: "white", width: "100%", maxW: "400px" },
        React.createElement(FormControl, null,
            React.createElement(VStack, { spacing: 4, align: "stretch" },
                React.createElement(FormLabel, { fontWeight: "bold" },
                    React.createElement(Text, null, "I'm not a robot"),
                    React.createElement(Text, { color: "blue.500", fontSize: "sm" }, "TheLastSpellingBee Re-Captcha")),
                React.createElement(Box, null,
                    React.createElement(Text, { fontWeight: "bold", mb: 2 }, "IF A = 1, B = 2, 1 = A, 2 = B. What is"),
                    React.createElement(Flex, { align: "center", wrap: "wrap", gap: 2 },
                        question.map((char, index) => (React.createElement(Box, Object.assign({ key: index, fontSize: "xl", p: 2, borderRadius: "md", backgroundColor: "white", boxShadow: "sm" }, getStyleProps()), char))),
                        !isVerified && (React.createElement(IconButton, { "aria-label": "Refresh captcha", icon: React.createElement(RepeatIcon, null), size: "sm", onClick: fetchQuestion, ml: 2 })))),
                isVerified ? (React.createElement(CircleLoader, { loadComplete: true, setLoadComplete: () => { } })) : (React.createElement(React.Fragment, null,
                    React.createElement(Input, { value: answer, onChange: (e) => setAnswer(e.target.value.toUpperCase()), placeholder: "Enter your answer", size: "lg", onKeyPress: (e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                verifyAnswer();
                            }
                        } }),
                    React.createElement(Button, { onClick: verifyAnswer, colorScheme: "blue", isLoading: isLoading, width: "full" }, "Verify")))))));
};
//# sourceMappingURL=TheLastSpellingBeeReCaptcha.js.map