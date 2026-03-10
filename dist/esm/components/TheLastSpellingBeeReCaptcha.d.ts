import { FC } from 'react';
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
export declare const TheLastSpellingBeeReCaptcha: FC<ITheLastSpellingBeeReCaptchaProps>;
