import type { RouteObject } from '../../routes';

const route: RouteObject[] = [
    {
        path: '*',
        lazy: () => import('./404.page'),
    },
];

export default route;
