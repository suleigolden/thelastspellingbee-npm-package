import React, { useEffect, useState } from 'react';
const ActionAlert = ({ alertMessage }) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        if (!alertMessage)
            return;
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [alertMessage]);
    if (!visible)
        return null;
    return (React.createElement("div", { className: "container" },
        React.createElement("div", { className: "row" }, alertMessage === "yes" ?
            React.createElement("h4", { style: { color: 'green' } }, "Good Job!")
            : alertMessage === "no" ?
                React.createElement("h4", { style: { color: 'red' } }, "Not correct, try again") : null)));
};
export default ActionAlert;
//# sourceMappingURL=ActionAlert.js.map