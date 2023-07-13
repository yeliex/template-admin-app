import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import classNames from 'classnames';
import { omit } from 'lodash-es';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SimpleError from '@/components/Error/SimpleError';
import { useLogin, type LoginData } from '@/data/user';

const LoginPage = () => {
    const { isMutating, trigger, error } = useLogin();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleSubmit = async (values: Omit<LoginData, 'phoneNumber'> & {
        username: LoginData['phoneNumber']
    }) => {
        try {
            await trigger({
                ...omit(values, ['username']),
                phoneNumber: values.username,
            });
            
            navigate(decodeURIComponent(searchParams.get('redirect') || '/'), { replace: true });
        } finally {

        }
    };

    return (
        <div
            className={classNames(
                'relative flex flex-col h-screen items-center justify-center',
                'bg-slate-50 bg-[150rem] bg-[url(https://www.tailwindcss.com/_next/static/media/hero@75.b2469a49.jpg)]',
            )}
        >
            <div className="w-80">
                <Typography.Title className="text-center !-mt-20 !mb-12">登录</Typography.Title>
                <Form
                    onFinish={handleSubmit}
                    className="w-full mt-12"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        className="w-full"
                        rules={[
                            { required: true, message: '请输入手机号' },
                            { type: 'string', min: 11, max: 11, pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
                        ]}
                    >
                        <Input
                            type="tel"
                            prefix={<UserOutlined className="text-black/25" />}
                            placeholder="手机号"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="text-black/25" />}
                            type="password"
                            placeholder="密码"
                            autoComplete="password"
                        />
                    </Form.Item>
                    {
                        error ? (
                            <SimpleError title="登录失败" error={error} />
                        ) : null
                    }
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="mt-12"
                            loading={isMutating}
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
