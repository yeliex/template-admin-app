import type { RouteObject } from '@/routes';
import { redirect } from 'react-router';

const route: RouteObject[] = [
    {
        path: '/settings',
        children: [
            {
                index: true,
                loader: async () => {
                    return redirect('/settings/profiles');
                },
            },
            {
                path: 'profiles',
                lazy: () => import('./profiles.page'),
            },
            {
                path: 'users',
                lazy: () => import('./users.page'),
            },
            {
                path: 'logs',
                lazy: () => import('./logs.page'),
            },
        ],
    },
];

export default route;
