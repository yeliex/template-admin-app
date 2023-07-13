import { Button, Result } from 'antd';
import { PropsWithChildren, useMemo } from 'react';
import { DEFAULT_TITLE } from './index';
import { FallbackProps } from 'react-error-boundary';

interface IProps extends Omit<FallbackProps, 'resetErrorBoundary'> {
    title?: string;
    resetErrorBoundary?: FallbackProps['resetErrorBoundary'];
}

const PageError = (props: PropsWithChildren<IProps>) => {
    const { title = DEFAULT_TITLE, error, resetErrorBoundary } = props;

    const status = useMemo(() => {
        if (!error.code) {
            return 500;
        }

        if ([403, 404, 500].includes(error.code)) {
            return error.code;
        }

        if (error.code === 401) {
            return 403;
        }

        return 500;
    }, [error.code]);

    return (
        <Result
            status={status}
            title={title}
            subTitle={error.message}
            extra={resetErrorBoundary ? (
                <Button type="primary" onClick={resetErrorBoundary}>
                    重试
                </Button>
            ) : undefined}
        />
    );
};

export default PageError;
