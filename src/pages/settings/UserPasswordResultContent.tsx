import { Descriptions, Typography } from 'antd';
import { type CreateUserResponse } from './UserEditor';

type IProps = CreateUserResponse;

const UserPasswordResultContent = (props: IProps) => {
    return (
        <div className="my-6">
            <Descriptions column={1}>
                <Descriptions.Item label="手机号">
                    <Typography.Text code>{props.phoneNumber}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="初始密码">
                    <Typography.Text code>{props.password}</Typography.Text>
                </Descriptions.Item>
            </Descriptions>
            <Typography.Text type="secondary">使用手机号+初始密码登录, 首次登录需要修改密码<br />忘记密码请通过其他同事重置</Typography.Text>
        </div>
    );
};

export default UserPasswordResultContent;
