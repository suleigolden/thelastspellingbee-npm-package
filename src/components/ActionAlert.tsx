import React, { FC } from 'react';

type Props = {
    alertMessage: any;
}
const ActionAlert: FC<Props> = ({ alertMessage }) => {
    return (
        <>
            <div className="container">
                <div className="row">
                    <h3>{alertMessage}</h3>
                </div>
            </div>
        </>
    );
};

export default ActionAlert;
