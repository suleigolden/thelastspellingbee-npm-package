import React, { FC, useEffect, useState } from 'react';
import { getReCaptchaQuestion, answerReCaptchaQuestion } from '../recaptcha';
import { Box, FormControl, FormLabel, Input, Button, Text, Flex, IconButton, useToast, Spinner } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';

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
    const toast = useToast();
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
            <Flex direction="column" p="4" boxShadow={'sm'} borderRadius="md">
                <FormControl>
                    <FormLabel>
                        I'm not a robot ..{' '}
                        <Text as="b" color="#F26B3A">
                            TheLastSpellingBee Re-Captcha
                        </Text>
                    </FormLabel>
                    <Text>
                        <b>IF A = 1, B = 2, 1 = A, 2 = B. What is</b>

                        {Object.keys(rQuestion).map((key, index) => (
                            <Box as="span" key={index} fontSize={22} border={'1px #a6d9fd solid'} ml="2" bg="white" color="blue.400" p="2" borderRadius="md" boxShadow="sm">
                                {/* @ts-ignore */}
                                {rQuestion[key]}
                            </Box>
                        ))}

                        {!captchaResult && <IconButton aria-label="Refresh captcha" icon={<RepeatIcon />} size="sm" ml="4" onClick={refreshQuestion} />}
                    </Text>
                    {!captchaResult ? <Input id="answer" name="answer" value={answer} placeholder="Answer" onChange={onChange} required mt="4" /> : <Spinner />}
                    {!captchaResult && (
                        <Button mt="4" colorScheme="blue" h={8} fontSize={12} padding={3}>
                            Verify
                        </Button>
                    )}
                </FormControl>
                 {answerMessage && toast({
                title: "TheLastSpellingBee",
                status: captchaResult ? 'success' : 'error',
                description: captchaResult ? 'Success' : 'Try again!',
                duration: 9000,
                isClosable: true,
            })} 
            </Flex>
    );
};
