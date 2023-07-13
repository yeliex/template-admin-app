function createUsePromise<T>(promise: Promise<T>) {
    let status: 'pending' | 'fulfilled' | 'rejected' = 'pending';
    let response: T;

    const suspender = promise.then(
        res => {
            status = 'fulfilled';
            response = res;
        },
        err => {
            status = 'rejected';
            response = err;
        },
    );

    const handler = {
        pending: () => {
            throw suspender;
        },
        rejected: () => {
            throw response;
        },
        default: () => response,
    };

    return () => {
        const func = handler[status as keyof typeof handler];
        return func ? func() : handler.default();
    };
}

export default createUsePromise;
