import { App as AntApp } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import AppProvider from '@/components/AppProvider';
import AppRouter from './routes';

dayjs.locale('zh-cn');

const App = () => {
    return (
        <AppProvider>
            <AntApp className="min-h-screen">
                <AppRouter />
            </AntApp>
        </AppProvider>
    );
};

export default App;
