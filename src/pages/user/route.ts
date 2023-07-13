import type { RouteObject } from '../../routes';

const route: RouteObject = {
    root: true,
    path: '/user',
    children: [
        {
            path: 'login',
            lazy: () => import('./login.page'),
        },
    ],
};

export default route;
