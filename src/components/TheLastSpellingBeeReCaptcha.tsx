import React, { FC, useEffect, useState } from 'react';
import ActionAlert from './ActionAlert';
import { getReCaptchaQuestion, answerReCaptchaQuestion } from '../recaptcha';
import CircleLoader from './CircleLoader';

export interface ITheLastSpellingBeeReCaptchaProps {
    questionType?: any;
    wordLength?: number;
    reCaptchaKey: string;
    refreshonVerifyReCaptcha?: false;
    refreshReCaptcha?: false;
    onVerifyCaptcha: (result: any) => void;
}

export const TheLastSpellingBeeReCaptcha: FC<ITheLastSpellingBeeReCaptchaProps> = ({ questionType, wordLength, reCaptchaKey, refreshonVerifyReCaptcha, refreshReCaptcha, onVerifyCaptcha }) => {
    const [formData, setFormData] = useState({
        answer: ''
    });
    const { answer } = formData;
    const [rQuestion, setRQuestion] = useState('');
    const [answerMessage, setAnswerMessage] = useState('');
    const [loadComplete, setLoadComplete] = useState(false);
    const [captchaResult, setCaptchaResult] = useState(false);
    const getCaptchaQuestion = async () => {
        const qType = questionType ? questionType : 'CHARACTERS';
        const wLength = wordLength ? wordLength : 3;
        if (!reCaptchaKey) {
            setRQuestion('recaptcha key not provided');
            return;
        }
        return await getReCaptchaQuestion(qType, wLength, reCaptchaKey);
    };
    const removeSpecialCharacters = (str: string) => {
        return str.replace(/[^\w\s]/gi, '');
    };
    const splitQuestion = (stringChar: any) => {
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
        const fetchData = async () => {
            try {
                const response = await getCaptchaQuestion();
                if (response.question) {
                    setRQuestion(splitQuestion(response.question));
                }
            } catch (error) {
                // Handle error
                console.error(error);
            }
        };

        fetchData();
    }, []); // Empty dependency array

    const refreshQuestion = async () => {
        try {
            const response = await getCaptchaQuestion();
            if (response.question) {
                setRQuestion(splitQuestion(response.question));
            }
        } catch (error) {
            // Handle error
            console.error(error);
        }
    };
    const checkIfNumber = (char: string) => {
        if (parseInt(char) > 0) {
            return true;
        }
        return false;
    };
    const validateCurrentQuestion = (stringQuestion: string | string[]) => {
        if (!checkIfNumber(stringQuestion[0])) {
            //If question is String
            return rQuestion.toString().replace(/,/g, '');
        }
        return rQuestion.toString().replace(/,/g, '-');
    };
    const answerRecaptcha = async (question: any, answer: any, apiKey: string) => {
        try {
            const result = await answerReCaptchaQuestion(question, answer, apiKey);
            setAnswerMessage(result.message);
            onVerifyCaptcha(result.message);
            if (result.message) {
                setLoadComplete(!loadComplete);
                setCaptchaResult(true);
            }
        } catch (error) {
            console.error(error);
        }

        return true;
    };

    const onSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        answerRecaptcha(validateCurrentQuestion(rQuestion), answer, reCaptchaKey);
        setFormData({ answer: '' });
        return true;
    };

    const onChange = (e: { target: { name: any; value: string } }) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.toUpperCase()
        }));
    };

    return (
        <>
            <div>
                <div style={{ border: '1px #CCC solid', padding: '4px 20px 4px 20px' }}>
                    <div className="form-group">
                        <label>
                            I'm not a robot .. <b style={{ marginLeft: '2px', color: '#f26b3a' }}>TheLastSpellingBeeReCaptcha</b>
                        </label>
                        <p>
                            <b>IF A = 1, B = 2, 1 = A, 2 = B. What is</b>

                            {Object.keys(rQuestion).map((key, index) => (
                                <span
                                    style={{
                                        backgroundColor: '#fff',
                                        color: '#73c2fb',
                                        marginLeft: '5px',
                                        textAlign: 'center',
                                        padding: '7px',
                                        borderRadius: '3px',
                                        border: '1px #a6d9fd solid',
                                        boxShadow: 'rgb(0 0 0 / 10%) 0px 20px 25px -5px, rgb(0 0 0 / 4%) 0px 10px 10px -5px'
                                    }}
                                    key={index}
                                >
                                    {/* @ts-ignore */}
                                    {rQuestion[key]}
                                </span>
                            ))}
                            {captchaResult ? (
                                ''
                            ) : (
                                <i
                                    onClick={refreshQuestion}
                                    style={{ marginLeft: '20px', fontSize: '9px', border: '1px solid #3366FF', backgroundColor: '#B3C6FF', padding: '4px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bootstrap-reboot" viewBox="0 0 16 16">
                                        <path d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.812 6.812 0 0 0 1.16 8z" />
                                        <path d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352h1.141zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324h-1.6z" />
                                    </svg>
                                    efresh
                                </i>
                            )}
                        </p>
                        {captchaResult ? '' : <input type="text" className="form-control" id="answer" name="answer" value={answer} placeholder="Answer" onChange={onChange} required />}
                    </div>
                    {captchaResult ? (
                        <CircleLoader loadComplete={loadComplete} setLoadComplete={setLoadComplete} />
                    ) : (
                        <div className="form-group" onClick={onSubmit}>
                            <button className="btn btn-primary" style={{ border: '1px solid #3366FF', backgroundColor: '#B3C6FF', color: '#000', cursor:'pointer' }} type="submit">
                                Verify
                            </button>
                        </div>
                    )}
                    {answerMessage}
                    {answerMessage && <ActionAlert alertMessage={answerMessage} />}
                </div>
            </div>
        </>
    );
};
