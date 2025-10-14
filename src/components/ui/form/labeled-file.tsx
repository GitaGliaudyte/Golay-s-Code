import React from 'react';
import { Label } from './label';

export type LabeledFileProps = {
    setValue: (file: File | undefined) => void;
    errorMessage?: string;
} & Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange' | 'type'>;

export const LabeledFile: React.FC<LabeledFileProps> = props => {
    const { id, title, setValue, className, errorMessage, ...rest } = props;

    return (
        <div className="form-control">
            <Label htmlFor={id} title={title} errorMessage={errorMessage} />
            <input
                id={id}
                type="file"
                className={`file-input ${errorMessage ? 'file-input-error' : ''} ${className ?? ''}`}
                onChange={x => setValue?.(x.target.files?.[0])}
                {...rest}
            />
        </div>
    );
};