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
import ActionAlert from './ActionAlert';
import { getReCaptchaQuestion, answerReCaptchaQuestion } from '../recaptcha';
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
    return (React.createElement(React.Fragment, null,
        React.createElement("div", null,
            React.createElement("div", { style: { border: '1px #CCC solid', padding: '4px 20px 4px 20px' } },
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", null,
                        "I'm not a robot .. ",
                        React.createElement("b", { style: { marginLeft: '2px', color: '#f26b3a' } }, "TheLastSpellingBeeReCaptcha")),
                    React.createElement("p", null,
                        React.createElement("b", null, "IF A = 1, B = 2, 1 = A, 2 = B. What is"),
                        Object.keys(rQuestion).map((key, index) => (React.createElement("span", { style: {
                                backgroundColor: '#fff',
                                color: '#73c2fb',
                                marginLeft: '5px',
                                textAlign: 'center',
                                padding: '7px',
                                borderRadius: '3px',
                                border: '1px #a6d9fd solid',
                                boxShadow: 'rgb(0 0 0 / 10%) 0px 20px 25px -5px, rgb(0 0 0 / 4%) 0px 10px 10px -5px'
                            }, key: index }, rQuestion[key]))),
                        captchaResult ? ('') : (React.createElement("i", { onClick: refreshQuestion, style: { marginLeft: '20px', fontSize: '9px', border: '1px solid #3366FF', backgroundColor: '#B3C6FF', padding: '4px', borderRadius: '4px', cursor: 'pointer' } },
                            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-bootstrap-reboot", viewBox: "0 0 16 16" },
                                React.createElement("path", { d: "M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.812 6.812 0 0 0 1.16 8z" }),
                                React.createElement("path", { d: "M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352h1.141zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324h-1.6z" })),
                            "efresh"))),
                    captchaResult ? '' : React.createElement("input", { type: "text", className: "form-control", id: "answer", name: "answer", value: answer, placeholder: "Answer", onChange: onChange, required: true })),
                captchaResult ? (React.createElement(CircleLoader, { loadComplete: loadComplete, setLoadComplete: setLoadComplete })) : (React.createElement("div", { className: "form-group", onClick: onSubmit },
                    React.createElement("button", { className: "btn btn-primary", style: { border: '1px solid #3366FF', backgroundColor: '#B3C6FF', color: '#000', cursor: 'pointer' }, type: "submit" }, "Verify"))),
                answerMessage,
                answerMessage && React.createElement(ActionAlert, { alertMessage: answerMessage })))));
};
//# sourceMappingURL=TheLastSpellingBeeReCaptcha.js.map