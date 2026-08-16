import { Tooltip } from 'antd';
import { BulbFilled, BulbOutlined } from '@ant-design/icons';
import AppButton from './AppButton';
import { useTheme } from '../../context/ThemeContext';

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <AppButton
        variant="text"
        shape="circle"
        icon={isDark ? <BulbFilled style={{ color: '#fadb14' }} /> : <BulbOutlined />}
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
      />
    </Tooltip>
  );
}
