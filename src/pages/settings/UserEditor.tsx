import AppProvider from '@/components/AppProvider';
import fetch, { serializeResponse } from '@/libs/fetch';
import UserPasswordResultContent from '@/pages/settings/UserPasswordResultContent';
import { Form, Input, Modal, notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { type AdminUser } from '../../data/user';

interface IProps {
    onClose: () => void;
}

interface UpdateProps {
    id?: number;
}

export interface CreateUserRequest {
    body: {
        phoneNumber: string,
        nickname: string,
    };
}

export interface CreateUserResponse {
    phoneNumber: string;
    password: string;
}

type GetAdminUserResponse = AdminUser;

type Value = CreateUserRequest['body'];

const UserEditor = (props: IProps & UpdateProps) => {
    const { onClose, id } = props;
    const [opened, setOpened] = useState(true);

    const [form] = Form.useForm<Value>();

    const { validateFields, setFieldsValue, setFields } = form;

    useEffect(() => {
        if (!id) {
            setFieldsValue({});

            return;
        }

        (async () => {
            try {
                const userInfo = await serializeResponse<GetAdminUserResponse>(fetch(`/api/users/${id}`));

                setFieldsValue({
                    phoneNumber: userInfo.phoneNumber,
                    nickname: userInfo.nickname,
                });
            } catch (e) {
                notification.error({
                    message: '获取用户信息失败',
                    description: e instanceof Error ? e.message : `${e}`,
                });
            }
        })();
    }, [id]);

    const handleConfirm = useCallback(async () => {
        const values = await validateFields();

        try {
            if (id) {
                await serializeResponse<CreateUserResponse>(fetch(`/api/users/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(values),
                }));

                setOpened(false);

                notification.success({
                    message: '更新成功',
                });
            } else {
                const res = await serializeResponse<CreateUserResponse>(fetch('/api/users', {
                    method: 'POST',
                    body: JSON.stringify(values),
                }));

                setOpened(false);

                Modal.success({
                    title: '创建成功',
                    content: <UserPasswordResultContent {...res} />,
                });
            }
        } catch (e) {
            setFields([
                {
                    name: 'phoneNumber',
                    errors: [e instanceof Error ? e.message : `${e}`],
                },
            ]);
        }
    }, [id, validateFields, setFields]);

    return (
        <AppProvider>
            <Modal
                title="添加管理员"
                open={opened}
                onCancel={() => {
                    setOpened(false);
                }}
                afterClose={onClose}
                closable={false}
                maskClosable={false}
                onOk={handleConfirm}
            >
                <Form form={form} className="!py-6 w-80 !mx-auto">
                    <Form.Item
                        name="phoneNumber"
                        label="手机号"
                        required
                        rules={[
                            { required: true, message: '请输入手机号' },
                            { type: 'string', min: 11, max: 11, pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
                        ]}
                    >
                        <Input type="tel" placeholder="请输入手机号" maxLength={11} />
                    </Form.Item>
                    <Form.Item
                        name="realname"
                        label="真实姓名"
                        required
                        rules={[
                            { required: true, message: '请输入真实姓名' },
                            { type: 'string', min: 2, max: 8 },
                        ]}
                    >
                        <Input type="text" placeholder="请输入真实姓名" maxLength={8} />
                    </Form.Item>
                </Form>
            </Modal>
        </AppProvider>
    );
};

const editUser = async (props: UpdateProps = {}) => {
    const el = window.document.createElement('div');
    window.document.body.appendChild(el);
    const root = createRoot(el);

    return new Promise<void>((resolve) => {
        const handleClose = () => {
            resolve();

            setTimeout(() => {
                root.unmount();
                window.document.body.removeChild(el);
            });
        };

        root.render((
            <UserEditor
                {...props}
                onClose={handleClose}
            />
        ));
    });
};

export default editUser;
