import React, { FC, useEffect, useState } from 'react';
import { getReCaptchaQuestion, answerReCaptchaQuestion } from '../recaptcha';
import { 
    Box, 
    FormControl, 
    FormLabel, 
    Button, 
    Text, 
    Flex, 
    IconButton,
    Input,
    useToast,
    VStack
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import CircleLoader from './CircleLoader';

export type ITheLastSpellingBeeReCaptchaProps = {
    questionType?: 'CHARACTERS' | 'NUMBERS' | 'RANDOM' | 'COMPLEX';
    wordLength?: number;
    reCaptchaKey: string;
    onVerifyCaptcha: (verified: boolean) => void;
};

export const TheLastSpellingBeeReCaptcha: FC<ITheLastSpellingBeeReCaptchaProps> = ({ 
    questionType = 'CHARACTERS',
    wordLength = 3,
    reCaptchaKey,
    onVerifyCaptcha 
}) => {
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const toast = useToast();

    const fetchQuestion = async () => {
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
            const response = await getReCaptchaQuestion(questionType, wordLength, reCaptchaKey);
            if (response[0]?.question) {
                setQuestion(parseQuestion(response[0].question));
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch question',
                status: 'error',
                duration: 3000
            });
        }
    };

    const parseQuestion = (input: string): string[] => {
        const hasAlphaNumeric = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(
            input.replace(/[^\w\s]/gi, '')
        );
        
        if (hasAlphaNumeric) return input.split('-');
        if (/[a-zA-Z]/.test(input)) return input.split('');
        return input.split('-');
    };

    const verifyAnswer = async () => {
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
            const formattedQuestion = question.join(
                /^\d/.test(question[0]) ? '-' : ''
            );

            const result = await answerReCaptchaQuestion(
                formattedQuestion,
                answer,
                reCaptchaKey
            );

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
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Verification failed',
                status: 'error',
                duration: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

    useEffect(() => {
        fetchQuestion();
    }, []);

    return (
        <VStack 
            spacing={4} 
            p={6} 
            borderRadius="lg" 
            boxShadow="sm" 
            bg="white"
            width="100%"
            maxW="400px"
        >
            <FormControl>
                <VStack spacing={4} align="stretch">
                    <FormLabel fontWeight="bold">
                        <Text>I'm not a robot</Text>
                        <Text color="blue.500" fontSize="sm">
                            TheLastSpellingBee Re-Captcha
                        </Text>
                    </FormLabel>

                    <Box>
                        <Text fontWeight="bold" mb={2}>
                            IF A = 1, B = 2, 1 = A, 2 = B. What is
                        </Text>
                        
                        <Flex align="center" wrap="wrap" gap={2}>
                            {question.map((char, index) => (
                                <Box
                                    key={index}
                                    fontSize="xl"
                                    p={2}
                                    borderRadius="md"
                                    backgroundColor="white"
                                    boxShadow="sm"
                                    {...getStyleProps()}
                                >
                                    {char}
                                </Box>
                            ))}
                            
                            {!isVerified && (
                                <IconButton
                                    aria-label="Refresh captcha"
                                    icon={<RepeatIcon />}
                                    size="sm"
                                    onClick={fetchQuestion}
                                    ml={2}
                                />
                            )}
                        </Flex>
                    </Box>

                    {isVerified ? (
                        <CircleLoader 
                            loadComplete={true} 
                            setLoadComplete={() => {}} 
                        />
                    ) : (
                        <>
                            <Input
                                value={answer}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onPaste={(e) => {
                                    e.preventDefault();
                                    toast({
                                        title: 'Warning',
                                        description: 'Please type the answer manually',
                                        status: 'warning',
                                        duration: 2000
                                    });
                                }}
                                placeholder="Type your answer"
                                size="lg"
                                autoComplete="off"
                                spellCheck="false"
                            />
                            
                            <Button
                                onClick={verifyAnswer}
                                colorScheme="blue"
                                isLoading={isLoading}
                                width="full"
                            >
                                Verify
                            </Button>
                        </>
                    )}
                </VStack>
            </FormControl>
        </VStack>
    );
};
