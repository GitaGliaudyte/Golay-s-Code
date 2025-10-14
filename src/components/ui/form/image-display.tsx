export type ImageDisplayProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & { title?: string };

export const ImageDisplay: React.FC<ImageDisplayProps> = props => {
    const { id, title, src, ...rest } = props;

    return (
        <div className="form-control">
            {title ? <label htmlFor={id} className="block text-sm font-medium">{title}</label> : null}
            <div role="img" aria-label={title}>
                <img id={id} src={src} {...rest} />
            </div>
        </div>
    );
};