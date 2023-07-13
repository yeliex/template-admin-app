import useSWRPagination from '@/hooks/usePagination';
import { Space, Table, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { memo } from 'react';
import { mockFetcher } from '../../libs/fetch';

const mock = {
    list: [
        { id: 1, userId: '1', user: { realname: 'user1' }, message: '1(user1) 登录 操作成功', ip: '127.0.0.1', deviceName: 'Microsoft Edge macOS', createdAt: '2023-07-10 10:00:00' },
    ],
    page: {
        size: 20,
        total: 1,
    },
};

const Page = memo(() => {

    const { data = mock, isLoading, onTableChange } = useSWRPagination<typeof mock>('/api/admin/logs');

    return (
        <Space className="!flex" direction="vertical">
            <Table
                rowKey="id"
                loading={isLoading}
                dataSource={data?.list || []}
                onChange={onTableChange}
                pagination={{
                    pageSize: data?.page.size || 20,
                    total: data?.page.total || 0,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条`,
                }}
                columns={[
                    {
                        title: 'ID',
                        dataIndex: 'id',
                        width: 60,
                    },
                    {
                        title: '用户',
                        dataIndex: 'userId',
                        width: 120,
                        render: (userId, record) => {
                            if (!userId) {
                                return '-';
                            }

                            let str = `${userId}`;
                            if (record.user?.realname) {
                                str += ` (${record.user.realname})`;
                            }

                            return str;
                        },
                    },
                    {
                        title: '状态',
                        dataIndex: 'result',
                        width: 120,
                        render: (value) => {
                            return (
                                <Tag color="green">
                                    正常
                                </Tag>
                            );
                        },
                    },
                    {
                        title: '操作类型',
                        dataIndex: 'operation',
                        width: 120,
                        render: (value) => {
                            return '登录';
                        },
                    },
                    {
                        title: '描述',
                        ellipsis: {
                            showTitle: false,
                        },
                        dataIndex: 'message',
                        render: (value) => {
                            return (
                                <Tooltip title={value} placement="bottomLeft">
                                    {value}
                                </Tooltip>
                            );
                        },
                    },
                    {
                        title: '操作IP',
                        dataIndex: 'ip',
                        ellipsis: true,
                        width: 140,
                    },
                    {
                        title: '设备',
                        dataIndex: 'deviceName',
                        width: 200,
                        ellipsis: true,
                    },
                    {
                        title: '操作时间',
                        dataIndex: 'createdAt',
                        width: 180,
                        render: (time: Date) => {
                            return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
                        },
                    },
                ]}
            />
        </Space>
    );
});

export default Page;
