import { useUser } from '@/data/user';
import fetch, { serializeResponse } from '@/libs/fetch';
import { Form, Input, Modal } from 'antd';
import { type ReactNode, useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';

interface IProps {
    onClose: () => void;
    closable?: boolean;
    message?: ReactNode;
}

interface Value {
    password: string;
    confirmPassword: string;
}

export const ChangePassword = (props: IProps) => {
    const [opened, setOpened] = useState(true);

    const [form] = Form.useForm<Value>();

    const { data: user } = useUser();

    const { validateFields, setFields } = form;

    const handleConfig = useCallback(async () => {
        const values = await validateFields();

        try {
            const res = await fetch('/api/users/password', {
                method: 'POST',
                body: JSON.stringify({ password: values.password }),
            });

            await serializeResponse(res);

            window.location.reload();
        } catch (e) {
            setFields([
                {
                    name: 'password',
                    errors: [e instanceof Error ? e.message : `${e}`],
                },
            ]);
        }

    }, [validateFields, setFields]);

    return (
        <Modal
            open={opened}
            title="修改密码"
            afterClose={props.onClose}
            closable={false}
            maskClosable={false}
            onOk={handleConfig}
            onCancel={props.closable === false ? undefined : () => setOpened(false)}
        >
            {
                props.message ? (
                    props.message
                ) : null
            }
            <Form form={form} className="!py-6 w-80 !mx-auto !mt-4">
                <input id="phoneNumber" readOnly className="hidden" type="text" value={user!.phoneNumber} />
                <Form.Item
                    name="password"
                    label="新密码"
                    required
                    hasFeedback
                    rules={[
                        { required: true, message: '请输入新密码' },
                        { type: 'string', min: 6, max: 20, message: '密码长度为6-20位' },
                    ]}
                >
                    <Input type="password" autoComplete="new-password" />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="确认密码"
                    required
                    hasFeedback
                    dependencies={['password']}
                    rules={[
                        { required: true, message: '请重复输入新密码' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不一致'));
                            },
                        }),
                    ]}
                >
                    <Input type="password" autoComplete="confirm-new-password" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const changePassword = () => {
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
            <ChangePassword
                onClose={handleClose}
            />
        ));
    });
};

export default changePassword;
