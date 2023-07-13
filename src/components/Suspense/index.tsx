import { Skeleton } from 'antd';
import { type ComponentType, type ReactNode, Suspense } from 'react';

interface IProps {
    fallback?: ReactNode;
}

export const withSuspense = <P = {}>(suspenseProps: IProps = {}) => (Component: ComponentType<P>) => {
    const { fallback = <Skeleton /> } = suspenseProps;

    const C = (props: P) => {
        return (
            <Suspense fallback={fallback}>
                <Component {...props as any} />
            </Suspense>
        );
    };

    C.displayName = `withSuspense(${Component.displayName || Component.name})`;

    return C;
};
