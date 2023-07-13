import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, MenuProps, Space } from 'antd';
import {  uniq } from 'lodash-es';
import { memo, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Navigate, Outlet, useLocation, useMatches } from 'react-router';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary, { withErrorBoundary } from '@/components/Error/ErrorBoundary';
import PageError from '@/components/Error/PageError';
import { withSuspense } from '@/components/Suspense';
import withHOCs from '@/components/withHOCs';
import { useUser } from '@/data/user';
import MenuConfig from '../menu';

// async component for lazy check user info
const UserAuth = (props: PropsWithChildren) => {
    const { error, data: user, isLoading } = useUser();
    const location = useLocation();

    if (isLoading) {
        return null;
    }

    if (error?.code === 401) {
        let url = '/user/login';

        if (location.pathname && location.pathname !== '/') {
            url += `?redirect=${encodeURIComponent(location.pathname)}`;
        }

        return (
            <Navigate to={url} replace />
        );
    }

    if (error) {
        throw error;
    }

    return (
        <>
            {props.children}
        </>
    );
};

const UserAuthLazy = withHOCs<PropsWithChildren>([
    withErrorBoundary({
        FallbackComponent: PageError,
        // reset button for get current user error
        onReset: () => {
            let url = '/api/user/logout';

            if (window.location.pathname && window.location.pathname !== '/') {
                url += `?redirect=${encodeURIComponent(window.location.pathname)}`;
            }

            window.location.replace(url);
        },
    }),
    withSuspense(),
])(UserAuth);

const Header = memo(() => {
    const { data } = useUser();
    const navigate = useNavigate();

    const handleUserClick = () => {
        navigate('/settings/profiles');
    };

    const handleLogOut = () => {
        window.location.replace('/api/user/logout');
    };

    return (
        <Layout.Header className="flex !text-white items-center justify-between">
            <h1 className="text-xl">管理后台</h1>
            <Space className="h-full">
                {
                    data ? (
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'logout',
                                        label: '退出登录',
                                        onClick: handleLogOut,
                                    },
                                ],
                            }}
                        >
                            <div
                                onClick={handleUserClick}
                                className="flex cursor-pointer rounded-lg hover:bg-gray-500/40 py-2 px-4"
                            >
                                <Avatar size={32} className="!bg-green-400" icon={<UserOutlined />} />
                                <span className="ml-2 text-lg">
                                {data.nickname}
                            </span>
                            </div>
                        </Dropdown>
                    ) : null
                }
            </Space>
        </Layout.Header>
    );
});

const findParentKeys = (keys: string[]) => {
    return uniq(MenuConfig.filter((item) => {
        if (!item) {
            return false;
        }
        if (item.key && keys.includes(item.key as string)) {
            return true;
        }

        return ('children' in item) && item.children?.some((child) => {
            if (!child) {
                return false;
            }
            return keys.includes(child.key as string);
        });
    }).map(item => item!.key as string));
};

const AppMenu = memo(() => {
    const matches = useMatches();
    const navigate = useNavigate();

    const currentKeys = useMemo(() => {
        return matches.map((item) => item.pathname);
    }, [matches]);

    const [openedKeys, setOpenedKeys] = useState<string[]>(() => {
        return findParentKeys(currentKeys);
    });
    const [selectedKeys, setSelectedKeys] = useState<string[]>(() => currentKeys);

    useEffect(() => {
        setOpenedKeys((prev) => {
            return uniq([...prev, ...findParentKeys(currentKeys)]);
        });

        setSelectedKeys(currentKeys);
    }, [currentKeys]);

    const handleClick: MenuProps['onClick'] = (item) => {
        navigate(item.key, { replace: false });
    };

    const handleOpenChange = (keys: string[]) => {
        setOpenedKeys(keys);
    };

    const handleSelect: MenuProps['onSelect'] = ({ selectedKeys }) => {
        setSelectedKeys(selectedKeys);
    };

    return (
        <Menu
            mode="inline"
            openKeys={openedKeys}
            selectedKeys={selectedKeys}
            items={MenuConfig}
            onClick={handleClick}
            onOpenChange={handleOpenChange}
            onSelect={handleSelect}
            className="h-full"
        />
    );
});

const AppLayout = memo(() => {
    return (
        <UserAuthLazy>
            <ErrorBoundary>
                <Layout className="h-screen scroll-smooth">
                    <Header />

                    <Layout className="flex-1">
                        <Layout.Sider theme="light" className="w-64 h-full overflow-y-auto overflow-x-hidden">
                            <AppMenu />
                        </Layout.Sider>
                        <Layout.Content className="p-6 !flex-1 h-full overflow-y-auto overflow-x-hidden">
                            <ErrorBoundary>
                                <Outlet />
                            </ErrorBoundary>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </ErrorBoundary>
        </UserAuthLazy>
    );
});

export default AppLayout;
