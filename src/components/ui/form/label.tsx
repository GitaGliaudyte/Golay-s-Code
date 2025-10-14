import React from 'react';

export type LabelProps = {
    htmlFor?: string;
    title?: string;
    errorMessage?: string;
};

export const Label: React.FC<LabelProps> = props => {
    const { htmlFor, title, errorMessage } = props;

    return (
        <label className="label" htmlFor={htmlFor}>
            <span className="label-text text-base">{title}</span>
            {errorMessage && <span className="label-text-alt text-error">{errorMessage}</span>}
        </label>
    );
};
