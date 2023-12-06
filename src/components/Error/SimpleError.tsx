import { Alert, Button } from 'antd';
import type { PropsWithChildren } from 'react';
import { DEFAULT_TITLE } from './index';
import type { FallbackProps } from 'react-error-boundary';

interface IProps extends Omit<FallbackProps, 'resetErrorBoundary'> {
    title?: string;
    resetErrorBoundary?: FallbackProps['resetErrorBoundary'];
}

const SimpleError = (props: PropsWithChildren<IProps>) => {
    const { title = DEFAULT_TITLE, error, resetErrorBoundary } = props;

    return (
        <Alert
            type='error'
            showIcon
            message={title}
            description={error.name ? (
                <>
                    <p>{error.name}:</p>
                    <p style={{ textIndent: '2em' }}>{error.message}</p>
                </>
            ) : error.message}
            action={resetErrorBoundary ? (
                <Button size="small" type="primary" ghost onClick={resetErrorBoundary}>
                    重试
                </Button>
            ): undefined}
        />
    );
};

export default SimpleError;
