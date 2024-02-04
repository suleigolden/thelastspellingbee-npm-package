import React from 'react';
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
    return (React.createElement("div", null,
        React.createElement("div", { style: circleLoaderStyle },
            React.createElement("div", { className: `checkmark draw`, style: Object.assign(Object.assign({}, checkmarkStyle), checkmarkDrawStyle) },
                React.createElement("div", { style: afterCheckmarkStyle })))));
};
export default CircleLoader;
//# sourceMappingURL=CircleLoader.js.map