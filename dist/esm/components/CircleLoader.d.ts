import React, { FC } from 'react';
export interface ICircleLoaderProps {
    onVerifyCheck: (result: any) => void;
}
interface CircleLoaderProps {
    loadComplete: boolean;
    setLoadComplete: React.Dispatch<React.SetStateAction<boolean>>;
}
declare const CircleLoader: FC<CircleLoaderProps>;
export default CircleLoader;
