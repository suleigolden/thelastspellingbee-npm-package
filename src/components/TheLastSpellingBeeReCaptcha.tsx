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

const KEYFRAMES_STYLE = `
@keyframes loader-spin {
  to { transform: rotate(360deg); }
}
@keyframes checkmark {
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
}
`;

function RefreshIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ width: 16, height: 16 }}>
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
    const [hoverRefresh, setHoverRefresh] = useState(false);
    const [hoverBtn, setHoverBtn] = useState(false);
    const [focusInput, setFocusInput] = useState(false);

    const isDark = isDarkMode;
    const containerBg = isDark ? (darkModeColor || '#0b1437') : '#ffffff';
    const textColor = isDark ? 'rgba(255,255,255,0.92)' : '#1a202c';
    const subtextColor = isDark ? '#90cdf4' : '#3182ce';
    const inputBg = isDark ? 'rgba(255,255,255,0.12)' : '#ffffff';
    const inputBorder = isDark ? 'rgba(255,255,255,0.2)' : '#e2e8f0';
    const captchaBoxBg = isDark ? 'rgba(255,255,255,0.08)' : '#f7fafc';
    const btnBg = isDark ? '#319795' : '#3182ce';
    const btnHoverBg = isDark ? '#2c7a7b' : '#2c5282';
    const shadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    const radius = 8;
    const radiusSm = 6;
    const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

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
                : `1px solid ${borderColor}`,
            fontSize: 20,
            padding: '8px 10px',
            borderRadius: radiusSm,
            background: captchaBoxBg,
            boxShadow: shadow,
            minWidth: 36,
            textAlign: 'center' as const,
            fontWeight: 600,
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

    const containerStyle: React.CSSProperties = {
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: 400,
        padding: 24,
        background: containerBg,
        color: textColor,
        borderRadius: radius,
        boxShadow: shadow,
        fontFamily,
        fontSize: 16,
    };

    const formStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
    };

    const headerStyle: React.CSSProperties = {
        marginBottom: 16,
    };

    const titleStyle: React.CSSProperties = {
        fontWeight: 700,
        margin: '0 0 4px 0',
        fontSize: 16,
        lineHeight: 1.4,
    };

    const subtitleStyle: React.CSSProperties = {
        fontSize: 14,
        color: subtextColor,
        margin: 0,
    };

    const instructionStyle: React.CSSProperties = {
        fontWeight: 600,
        margin: '0 0 8px 0',
        fontSize: 15,
    };

    const charsStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap' as const,
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    };

    const refreshStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        padding: 0,
        border: `1px solid ${hoverRefresh ? subtextColor : inputBorder}`,
        borderRadius: radiusSm,
        background: hoverRefresh ? captchaBoxBg : inputBg,
        color: textColor,
        cursor: 'pointer',
        flexShrink: 0,
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        fontSize: 16,
        lineHeight: 1.5,
        color: textColor,
        background: inputBg,
        border: `1px solid ${focusInput ? subtextColor : inputBorder}`,
        borderRadius: radiusSm,
        marginBottom: 16,
        boxSizing: 'border-box',
        outline: focusInput ? `2px solid ${subtextColor}` : 'none',
        outlineOffset: 2,
    };

    const btnStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.5,
        color: '#ffffff',
        background: (hoverBtn && !isLoading) ? btnHoverBg : btnBg,
        border: 'none',
        borderRadius: radiusSm,
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
    };

    const loaderWrapStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px 0',
    };

    const toastBaseStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'calc(100vw - 32px)',
        padding: '12px 20px',
        borderRadius: radiusSm,
        fontSize: 14,
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 9999,
    };

    const toastStyle: React.CSSProperties =
        toast?.status === 'error'
            ? { ...toastBaseStyle, background: '#fff5f5', color: '#c53030', border: '1px solid #feb2b2' }
            : toast?.status === 'warning'
            ? { ...toastBaseStyle, background: '#fffaf0', color: '#c05621', border: '1px solid #fbd38d' }
            : { ...toastBaseStyle, background: '#f0fff4', color: '#276749', border: '1px solid #9ae6b4' };

    return (
        <>
            <style>{KEYFRAMES_STYLE}</style>
            <div
                style={containerStyle}
                role="form"
                aria-label="TheLastSpellingBee ReCaptcha"
            >
                <div style={formStyle}>
                    <header style={headerStyle}>
                        <h2 style={titleStyle}>I'm not a robot</h2>
                        <p style={subtitleStyle}>TheLastSpellingBee Re-Captcha</p>
                    </header>

                    <p style={instructionStyle}>
                        IF A = 1, B = 2, 1 = A, 2 = B. What is
                    </p>

                    <div style={charsStyle}>
                        {question.map((char, index) => (
                            <span
                                key={index}
                                style={getCharStyle()}
                            >
                                {char}
                            </span>
                        ))}
                        {!isVerified && (
                            <button
                                type="button"
                                style={refreshStyle}
                                onClick={fetchQuestion}
                                onMouseEnter={() => setHoverRefresh(true)}
                                onMouseLeave={() => setHoverRefresh(false)}
                                aria-label="Refresh captcha"
                            >
                                <RefreshIcon />
                            </button>
                        )}
                    </div>

                    {isVerified ? (
                        <div style={loaderWrapStyle}>
                            <CircleLoader loadComplete={true} setLoadComplete={() => {}} />
                        </div>
                    ) : (
                        <>
                            <input
                                type="text"
                                style={inputStyle}
                                value={answer}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setFocusInput(true)}
                                onBlur={() => setFocusInput(false)}
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
                                style={btnStyle}
                                onClick={verifyAnswer}
                                disabled={isLoading}
                                onMouseEnter={() => setHoverBtn(true)}
                                onMouseLeave={() => setHoverBtn(false)}
                            >
                                {isLoading ? 'Verifying…' : 'Verify'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {toast && (
                <div style={toastStyle} role="alert">
                    <strong>{toast.title}</strong>
                    {toast.description && ` — ${toast.description}`}
                </div>
            )}
        </>
    );
};
