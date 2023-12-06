import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import zhCN from 'antd/locale/zh_CN';
import type { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';

const AppProvider = (props: PropsWithChildren) => {
    return (
        <StyleProvider hashPriority="high">
            <ConfigProvider locale={zhCN}>
                <SWRConfig>
                    {props.children}
                </SWRConfig>
            </ConfigProvider>
        </StyleProvider>
    );
};

export default AppProvider;
