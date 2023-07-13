import { redirect } from 'react-router';
import type { RouteObject } from '@/routes';

const route: RouteObject[] = [
    {
        index: true,
        loader: async () => {
            return redirect('/dashboard');
        },
    },
    {
        path: '/dashboard',
        lazy: () => import('./index.page'),
    },
];

export default route;
