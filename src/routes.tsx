import type {
    RouteObject as RemixRouteObject,
    IndexRouteObject as RemixIndexRouteObject,
    LazyRouteFunction,
    NonIndexRouteObject as RemixNonIndexRouteObject,
} from 'react-router';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { withErrorBoundary } from '@/components/Error/ErrorBoundary';
import { withSuspense } from '@/components/Suspense';
import withHOCs from '@/components/withHOCs';
import createUsePromise from '@/libs/createUsePromise';
import Layout from '@/pages/layout';

interface IndexRouteObject extends Omit<RemixIndexRouteObject, 'lazy' | 'Component'> {
    lazy?: LazyRouteFunction<IndexRouteObject>;
    default?: RemixIndexRouteObject['Component'];
    root?: true;
}

interface NonIndexRouteObject extends Omit<RemixNonIndexRouteObject, 'lazy' | 'Component' | 'children'> {
    lazy?: LazyRouteFunction<NonIndexRouteObject>;
    default?: RemixNonIndexRouteObject['Component'];
    children?: RouteObject[];
    root?: true;
}

export type RouteObject = IndexRouteObject | NonIndexRouteObject;

export type RouteModule = RouteObject | RouteObject[];

const RouteModules = import.meta.glob<RouteModule>('./pages/**/route.{ts,tsx}', {
    eager: true,
    import: 'default',
});

const transformToRemix = (route: RouteObject) => {
    const r = {...route} as RemixRouteObject;

    if (route.lazy) {
        r.lazy = () => route.lazy!().then((module: any) => {
            return {
                ...module,
                default: undefined,
                Component: module.Component || module.default,
            } as RouteObject;
        });
    }

    if (route.children) {
        const children: RemixRouteObject[] = [];

        route.children.forEach((child) => {
            const route = transformToRemix(child);

            children.push(route);
        });

        r.children = children;
    }

    return r;
};

export const createRouter = async () => {
    const defaultRoutes: RemixRouteObject[] = [];
    const routes: RemixRouteObject[] = [
        {
            path: '/',
            Component: Layout,
            children: defaultRoutes,
        },
    ];

    Object.keys(RouteModules).forEach((key) => {
        const routeModule = RouteModules[key];

        const routeModules = Array.isArray(routeModule) ? routeModule : [routeModule];

        routeModules.forEach((routeModule) => {
            const route = transformToRemix(routeModule);

            if (routeModule.root) {
                routes.push(route);
            } else {
                defaultRoutes.push(route);
            }
        });
    });

    return [createBrowserRouter(routes)] as const;
};

export const routerPromise = createUsePromise(createRouter());

const Router = () => {
    const [router] = routerPromise();

    return (
        <RouterProvider router={router} />
    );
};

const AppRouter = withHOCs([
    withErrorBoundary(),
    withSuspense(),
])(Router);

export default AppRouter;
