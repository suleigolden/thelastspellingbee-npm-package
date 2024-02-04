"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const CircleLoader = ({ loadComplete, setLoadComplete }) => {
    const brandSuccess = '#5cb85c';
    const loaderSize = '3em';
    const checkHeight = `calc(${loaderSize} / 2)`;
    const checkWidth = `calc(${checkHeight} / 2)`;
    const checkLeft = `calc((${loaderSize} / 6) + (${loaderSize} / 12))`;
    const checkThickness = '3px';
    const checkColor = brandSuccess;
    const circleLoaderStyle = {
        marginBottom: `calc(${loaderSize} / 2)`,
        border: '1px solid rgba(0, 0, 0, 0.2)',
        borderLeftColor: checkColor,
        animation: 'loader-spin 1.2s infinite linear',
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'top',
        borderRadius: '50%',
        width: loaderSize,
        height: loaderSize,
        transition: 'border 500ms ease-out',
        borderColor: loadComplete ? checkColor : undefined
    };
    const checkmarkStyle = {
        display: loadComplete ? 'block' : 'none'
    };
    const checkmarkDrawStyle = {
        animationDuration: '800ms',
        animationTimingFunction: 'ease',
        animationName: 'checkmark',
        transform: 'scaleX(-1) rotate(135deg)'
    };
    const afterCheckmarkStyle = {
        opacity: 1,
        height: checkHeight,
        width: checkWidth,
        transformOrigin: 'left top',
        borderRight: `${checkThickness} solid ${checkColor}`,
        borderTop: `${checkThickness} solid ${checkColor}`,
        content: '',
        left: checkLeft,
        marginTop: '-25px',
        marginLeft: '20px',
        // top: checkHeight,
        position: 'absolute'
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { style: circleLoaderStyle },
            react_1.default.createElement("div", { className: `checkmark draw`, style: Object.assign(Object.assign({}, checkmarkStyle), checkmarkDrawStyle) },
                react_1.default.createElement("div", { style: afterCheckmarkStyle })))));
};
exports.default = CircleLoader;
//# sourceMappingURL=CircleLoader.js.map