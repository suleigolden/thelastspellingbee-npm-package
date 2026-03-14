import React, { FC, useEffect, useState, useCallback } from 'react';
import { getReCaptchaQuestion, answerReCaptchaQuestion } from '../recaptcha';
import CircleLoader from './CircleLoader';

export type ITheLastSpellingBeeReCaptchaProps = {
    questionType?: 'CHARACTERS' | 'NUMBERS' | 'RANDOM' | 'COMPLEX';
    wordLength?: number;
    reCaptchaKey: string;
    onVerifyCaptcha: (verified: boolean) => void;
    isDarkMode?: boolean;
    /**
     * Optional custom background color used when `isDarkMode` is true.
     * Defaults to `#0b1437` if not provided.
     */
    darkModeColor?: string;
};

type ToastStatus = 'error' | 'warning' | 'success';
type ToastState = { title: string; description?: string; status: ToastStatus } | null;

const CHAR_COLORS = [
    '#ff6347', '#4682b4', '#6a5acd', '#008080',
    '#a6d9fd', '#73c2fb', '#F26B3A', '#db7093',
    '#ffa07a', '#9acd32'
];

function RefreshIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
    );
}

export const TheLastSpellingBeeReCaptcha: FC<ITheLastSpellingBeeReCaptchaProps> = ({
    questionType = 'CHARACTERS',
    wordLength = 3,
    reCaptchaKey,
    onVerifyCaptcha,
    isDarkMode = false,
    darkModeColor
}) => {
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [toast, setToast] = useState<ToastState>(null);

    const isDark = isDarkMode;
    const containerBg = isDark ? (darkModeColor || '#0b1437') : '#ffffff';
    const themeVars: React.CSSProperties = isDark
        ? {
            ['--tlsb-bg' as string]: containerBg,
            ['--tlsb-text' as string]: 'rgba(255,255,255,0.92)',
            ['--tlsb-subtext' as string]: '#90cdf4',
            ['--tlsb-input-bg' as string]: 'rgba(255,255,255,0.12)',
            ['--tlsb-input-border' as string]: 'rgba(255,255,255,0.2)',
            ['--tlsb-input-text' as string]: 'rgba(255,255,255,0.92)',
            ['--tlsb-captcha-box-bg' as string]: 'rgba(255,255,255,0.08)',
            ['--tlsb-btn-bg' as string]: '#319795',
            ['--tlsb-btn-hover' as string]: '#2c7a7b',
          }
        : {};

    const showToast = useCallback((title: string, description?: string, status: ToastStatus = 'error') => {
        setToast({ title, description, status });
        const duration = status === 'warning' ? 2000 : 3000;
        const t = setTimeout(() => setToast(null), duration);
        return () => clearTimeout(t);
    }, []);

    const fetchQuestion = async () => {
        if (!reCaptchaKey) {
            showToast('Error', 'ReCaptcha key not provided', 'error');
            return;
        }
        try {
            const response = await getReCaptchaQuestion(questionType, wordLength, reCaptchaKey);
            if (response[0]?.question) {
                setQuestion(parseQuestion(response[0].question));
            }
        } catch {
            showToast('Error', 'Failed to fetch question', 'error');
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
            showToast('Error', 'Please enter an answer', 'warning');
            return;
        }
        setIsLoading(true);
        try {
            const formattedQuestion = question.join(
                /^\d/.test(question[0] ?? '') ? '-' : ''
            );
            const result = await answerReCaptchaQuestion(
                formattedQuestion,
                answer,
                reCaptchaKey
            );
            setIsVerified(result.verified);
            onVerifyCaptcha(result.verified);
            if (!result.verified) {
                showToast('Incorrect Answer', 'Please try again', 'error');
                setAnswer('');
            }
        } catch {
            showToast('Error', 'Verification failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const getCharStyle = (): React.CSSProperties => {
        const color = CHAR_COLORS[Math.floor(Math.random() * CHAR_COLORS.length)];
        const borderColor = CHAR_COLORS[Math.floor(Math.random() * CHAR_COLORS.length)];
        return {
            color,
            border: Math.random() >= 0.5
                ? `2px dotted ${borderColor}`
                : `1px solid ${borderColor}`
        };
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

    useEffect(() => {
        fetchQuestion();
    }, []);

    return (
        <>
            <div
                className="tlsb-recaptcha"
                style={themeVars}
                role="form"
                aria-label="TheLastSpellingBee ReCaptcha"
            >
                <div className="tlsb-recaptcha__form">
                    <header className="tlsb-recaptcha__header">
                        <h2 className="tlsb-recaptcha__title">I'm not a robot</h2>
                        <p className="tlsb-recaptcha__subtitle">TheLastSpellingBee Re-Captcha</p>
                    </header>

                    <p className="tlsb-recaptcha__instruction">
                        IF A = 1, B = 2, 1 = A, 2 = B. What is
                    </p>

                    <div className="tlsb-recaptcha__chars">
                        {question.map((char, index) => (
                            <span
                                key={index}
                                className="tlsb-recaptcha__char"
                                style={getCharStyle()}
                            >
                                {char}
                            </span>
                        ))}
                        {!isVerified && (
                            <button
                                type="button"
                                className="tlsb-recaptcha__refresh"
                                onClick={fetchQuestion}
                                aria-label="Refresh captcha"
                            >
                                <RefreshIcon />
                            </button>
                        )}
                    </div>

                    {isVerified ? (
                        <div className="tlsb-recaptcha__loader">
                            <CircleLoader loadComplete={true} setLoadComplete={() => {}} />
                        </div>
                    ) : (
                        <>
                            <input
                                type="text"
                                className="tlsb-recaptcha__input"
                                value={answer}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onPaste={(e) => {
                                    e.preventDefault();
                                    showToast('Warning', 'Please type the answer manually', 'warning');
                                }}
                                placeholder="Type your answer"
                                autoComplete="off"
                                spellCheck={false}
                                aria-label="Your answer"
                            />
                            <button
                                type="button"
                                className="tlsb-recaptcha__btn"
                                onClick={verifyAnswer}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Verifying…' : 'Verify'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {toast && (
                <div
                    className={`tlsb-recaptcha__toast tlsb-recaptcha__toast--${toast.status}`}
                    role="alert"
                >
                    <strong>{toast.title}</strong>
                    {toast.description && ` — ${toast.description}`}
                </div>
            )}
        </>
    );
};
