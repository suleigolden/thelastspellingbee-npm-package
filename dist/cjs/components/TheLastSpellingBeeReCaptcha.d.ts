import { FC } from 'react';
export type ITheLastSpellingBeeReCaptchaProps = {
    questionType?: 'CHARACTERS' | 'NUMBERS' | 'RANDOM' | 'COMPLEX';
    wordLength?: number;
    reCaptchaKey: string;
    onVerifyCaptcha: (verified: boolean) => void;
};
export declare const TheLastSpellingBeeReCaptcha: FC<ITheLastSpellingBeeReCaptchaProps>;
