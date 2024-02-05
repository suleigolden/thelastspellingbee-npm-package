import React, { FC, useEffect, useState } from 'react';

type Props = {
    alertMessage: string;
}

const ActionAlert: FC<Props> = ({ alertMessage }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!alertMessage) return; 

        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [alertMessage]); 

    if (!visible) return null; 

    return (
        <div className="container">
            <div className="row">
                {alertMessage === "yes" ? 
                <h4 style={{ color: 'green' }}>Good Job!</h4>
                 : alertMessage === "no" ?   
                  <h4 style={{ color: 'red' }}>Not correct, try again</h4> : null}
            </div>
        </div>
    );
};

export default ActionAlert;
