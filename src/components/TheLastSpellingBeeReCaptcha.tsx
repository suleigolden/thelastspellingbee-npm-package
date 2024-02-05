import React, { FC, useEffect, useState } from 'react';
import { getReCaptchaQuestion, answerReCaptchaQuestion } from '../recaptcha';
import { Box, FormControl, FormLabel, Button, Text, Flex, IconButton } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import CircleLoader from './CircleLoader';
import ActionAlert from './ActionAlert';

export type ITheLastSpellingBeeReCaptchaProps = {
    questionType?: any;
    wordLength?: number;
    reCaptchaKey: string;
    refreshonVerifyReCaptcha?: false;
    refreshReCaptcha?: false;
    onVerifyCaptcha: (result: any) => void;
};

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
        <Flex direction="column" p="4" style={{ boxShadow: 'sm', borderRadius: 'md' }}>
        <FormControl>
            <FormLabel style={{ display: 'flex', flexDirection: 'column' }}>
                I'm not a robot ..{' '}
                <Text as="b" style={{ color: '#F26B3A' }}>
                    TheLastSpellingBee Re-Captcha
                </Text>
            </FormLabel>
            <Text style={{ marginTop: '20px', marginBottom: '20px' }}>
                <b>IF A = 1, B = 2, 1 = A, 2 = B. What is</b>
                {Object.keys(rQuestion).map((key, index) => (
                    <Box
                        as="span"
                        key={index}
                        style={{
                            fontSize: '22px',
                            border: '1px #a6d9fd solid',
                            marginLeft: '8px',
                            backgroundColor: 'white',
                            color: '#73c2fb',
                            padding: '8px',
                            borderRadius: 'md',
                            boxShadow: 'sm',
                        }}
                    >
                        {/* @ts-ignore */}
                        {rQuestion[key]}
                    </Box>
                ))}
                {!captchaResult && (
                    <IconButton
                        aria-label="Refresh captcha"
                        icon={<RepeatIcon />}
                        size="sm"
                        ml="4"
                        onClick={refreshQuestion}
                        style={{ marginLeft: '16px' }}
                    />
                )}
            </Text>
            {!captchaResult ? (
                <input type="text" className="form-control" style={{ marginTop: '6px' }} id="answer" name="answer" value={answer} placeholder="Answer" onChange={onChange} required />
            ) : (
                <CircleLoader loadComplete={loadComplete} setLoadComplete={setLoadComplete} />
            )} 
            {!captchaResult && (
                <Button
                    mt="4"
                    colorScheme="blue"
                    h={8}
                    fontSize="sm"
                    padding="12px"
                    onClick={onSubmit}
                    style={{ marginTop: '16px', height: '32px', fontSize: '12px', padding: '12px' }}
                >
                    Verify
                </Button>
            )}
        </FormControl>
        {answerMessage}
        {answerMessage && <ActionAlert alertMessage={answerMessage} />}
    </Flex>
    );
};