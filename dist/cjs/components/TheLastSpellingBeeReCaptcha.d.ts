import { FC } from 'react';
export type ITheLastSpellingBeeReCaptchaProps = {
    questionType?: any;
    wordLength?: number;
    reCaptchaKey: string;
    refreshonVerifyReCaptcha?: false;
    refreshReCaptcha?: false;
    onVerifyCaptcha: (result: any) => void;
};
export declare const TheLastSpellingBeeReCaptcha: FC<ITheLastSpellingBeeReCaptchaProps>;
