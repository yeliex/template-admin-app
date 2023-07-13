import { useUser } from '@/data/user';
import { mockFetcher, serializeResponse } from '@/libs/fetch';
import changePassword from './ChangePassword';
import editUser, { CreateUserResponse } from './UserEditor';
import UserPasswordResultContent from './UserPasswordResultContent';
import { DownOutlined } from '@ant-design/icons';
import { App, Button, Dropdown, notification, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

const mock = {
    list: [
        { id: 1, nickname: 'user', phoneNumber: '12345678901' },
    ],
    page: { size: 1, total: 20 },
};

const Page = memo(() => {
    const { data, mutate, isLoading } = useSWR<typeof mock>('/api/users', mockFetcher(mock));

    const { data: user } = useUser();
    const { modal } = App.useApp();

    const handleCreate = useCallback(async () => {
        await editUser();

        mutate();
    }, [mutate]);

    const handleEdit = useCallback(async (id: number) => {
        await editUser({ id });

        mutate();
    }, [mutate]);

    const handleDelete = useCallback((id: number) => {
        const content = (
            <div>
                删除后该用户将无法登录, 但是不会删除该用户的操作记录<br />
                用户删除无法恢复, 重新创建将作为新用户处理<br />
                临时禁止登录请使用禁用功能
            </div>
        );
        const instance = modal.confirm({
            title: '确认删除',
            content,
            onOk: async () => {
                try {
                    await serializeResponse(fetch(`/api/users/${id}`, {
                        method: 'DELETE',
                    }));

                    notification.success({
                        message: '操作成功',
                    });

                    mutate();
                } catch (e) {
                    instance.update({
                        content: (
                            <>
                                {content}
                                <Typography.Text type="danger">删除失败: {e instanceof Error
                                    ? e.message
                                    : `${e}`}</Typography.Text>
                            </>
                        ),
                    });

                    throw e;
                }
            },
        });
    }, [modal, mutate]);

    const handleDisable = useCallback(async (id: number) => {
        await fetch(`/api/users/${id}/disable`, {
            method: 'POST',
        });

        notification.success({
            message: '操作成功',
        });

        mutate();
    }, [mutate]);

    const handleEnable = useCallback(async (id: number) => {
        await fetch(`/api/users/${id}/enable`, {
            method: 'POST',
        });

        notification.success({
            message: '操作成功',
        });

        mutate();
    }, [mutate]);

    const handleResetPassword = useCallback((id: number) => {
        const content = (
            <p>
                重置后将随机生成新密码, 用户首次登录需要先修改密码<br />
                将退出当前所有登录客户端
            </p>
        );
        const instance = modal.confirm({
            title: '重置密码',
            content: content,
            onOk: async () => {
                try {
                    const res = await serializeResponse<CreateUserResponse>(fetch(`/api/users/${id}/password`, {
                        method: 'DELETE',
                    }));

                    instance.update({
                        type: 'success',
                        title: '重置成功',
                        content: <UserPasswordResultContent {...res} />,
                        onOk: () => Promise.resolve(),
                    });

                    mutate();

                    return Promise.reject();
                } catch (e) {
                    instance.update({
                        content: (
                            <>
                                {content}
                                <Typography.Text type="danger">重置失败: {e instanceof Error
                                    ? e.message
                                    : `${e}`}</Typography.Text>
                            </>
                        ),
                    });

                    throw e;
                }
            },
        });
    }, [modal, mutate]);

    return (
        <Space className="!flex" direction="vertical" size="large">
            <Space size="large">
                <Button
                    type="primary"
                    ghost
                    onClick={handleCreate}
                >
                    创建
                </Button>
            </Space>
            <Table
                rowKey="id"
                loading={isLoading}
                dataSource={data?.list || []}
                pagination={false}
                columns={[
                    {
                        title: 'ID',
                        dataIndex: 'id',
                    },
                    {
                        title: '姓名',
                        dataIndex: 'nickname',
                    },
                    {
                        title: '手机号',
                        dataIndex: 'phoneNumber',
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        width: 80,
                        render: (value, record) => {
                            return (
                                <Tag color="success">正常</Tag>
                            );
                        },
                    },
                    {
                        title: '操作',
                        key: 'action',
                        dataIndex: 'id',
                        width: 120,
                        render: (id, record) => {
                            return (
                                <Space>
                                    <Link to={`/settings/logs?userId=${id}`}>
                                        <Button
                                            size="small"
                                            type="link"
                                        >
                                            操作日志
                                        </Button>
                                    </Link>
                                    <Button
                                        size="small"
                                        type="link"
                                        onClick={() => handleEdit(id)}
                                    >
                                        编辑
                                    </Button>
                                    {
                                        user!.id !== id ? (
                                            <Dropdown
                                                trigger={['hover']}
                                                destroyPopupOnHide
                                                menu={{
                                                    items: [
                                                        {
                                                            key: 'delete',
                                                            onClick: () => handleDelete(id),
                                                            label: (
                                                                <Typography.Text type="danger">
                                                                    删除
                                                                </Typography.Text>
                                                            ),
                                                        },
                                                        {
                                                            key: 'reset',
                                                            onClick: () => handleResetPassword(id),
                                                            label: (
                                                                <Typography.Text type="danger">
                                                                    重置密码
                                                                </Typography.Text>
                                                            ),
                                                        },
                                                    ],
                                                }}
                                            >
                                                <Popconfirm
                                                    title="确认禁用"
                                                    okButtonProps={{
                                                        danger: true,
                                                    }}
                                                    onConfirm={() => {
                                                        return new Promise((resolve) => {
                                                            setTimeout(resolve, 1000);
                                                        });
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        type="link"
                                                        danger
                                                    >
                                                        <Space>
                                                            禁用
                                                            <DownOutlined />
                                                        </Space>
                                                    </Button>
                                                </Popconfirm>
                                            </Dropdown>
                                        ) : (
                                            <Button
                                                size="small"
                                                type="link"
                                                danger
                                                onClick={changePassword}
                                            >
                                                修改密码
                                            </Button>
                                        )
                                    }
                                </Space>
                            );
                        },
                    },
                ]}
            />
        </Space>
    );
});

export default Page;
