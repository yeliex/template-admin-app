import {
    DashboardOutlined, FundProjectionScreenOutlined, NodeIndexOutlined,
    PartitionOutlined,
    ProfileOutlined, ReconciliationOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { ItemType } from 'antd/es/menu/hooks/useItems';

const MenuConfig: ItemType[] = [
    {
        key: '/dashboard',
        label: 'Dashboard',
        icon: <DashboardOutlined />,
    },
    {
        key: '/settings',
        label: '管控设置',
        icon: <SettingOutlined />,
        children: [
            {
                key: '/settings/profiles',
                label: '偏好设置',
            },
            {
                key: '/settings/users',
                label: '账号管理',
            },
            {
                key: '/settings/logs',
                label: '行为日志',
            },
        ],
    },
];

export default MenuConfig;
