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
                                onChange={(e) => setAnswer(e.target.value.toUpperCase())}
                                placeholder="Enter your answer"
                                size="lg"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        verifyAnswer();
                                    }
                                }}
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
