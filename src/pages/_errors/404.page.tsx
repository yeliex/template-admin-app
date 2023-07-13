import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Result
            status={404}
            title="404"
            subTitle="抱歉，你访问的页面不存在。"
            extra={(
                <Link to="/" replace>
                    <Button type="primary" ghost>返回首页</Button>
                </Link>
            )}
        />
    );
};

export default NotFound;
