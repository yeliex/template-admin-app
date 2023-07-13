import type { ComponentType, PropsWithChildren } from 'react';
import {
    ErrorBoundary as ReactErrorBoundary,
    type ErrorBoundaryProps,
    type ErrorBoundaryPropsWithRender,
} from 'react-error-boundary';
import SimpleError from './SimpleError';

type IProps = Partial<ErrorBoundaryProps> & {
    title?: string;
}

const ErrorBoundary = (props: PropsWithChildren<IProps>) => {
    const { children, onReset, title, ...extra } = props;

    const errorProps = { ...extra } as ErrorBoundaryProps;

    if (
        !('fallback' in errorProps) &&
        !('fallbackRender' in errorProps) &&
        !('FallbackComponent' in errorProps)
    ) {
        (errorProps as ErrorBoundaryPropsWithRender).fallbackRender = ({ error, resetErrorBoundary }) => {
            return (
                <SimpleError
                    title={title}
                    error={error}
                    resetErrorBoundary={onReset ? resetErrorBoundary : undefined}
                />
            );
        };
    }

    return (
        <ReactErrorBoundary
            {...errorProps}
            onReset={onReset}
        >
            {children}
        </ReactErrorBoundary>
    );
};

export default ErrorBoundary;

export const withErrorBoundary = <P = {}>(boundaryProps: IProps = {}) => (Component: ComponentType<P>) => {
    const C = (props: P) => {
        return (
            <ErrorBoundary {...boundaryProps}>
                <Component {...props as any} />
            </ErrorBoundary>
        );
    }

    C.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return C;
}
