import { Drawer, Layout } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  DashboardOutlined,
  FieldTimeOutlined,
  CalendarOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Sidebar({ mobileOpen, onCloseMobileMenu }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderNavContent = () => (
    <>
      {/* Brand Logo Header */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <FieldTimeOutlined className="brand-icon-svg" />
        </div>
        <span className="sidebar-brand-title">Timesheet</span>
      </div>

      {/* Navigation Menu List */}
      <div className="sidebar-nav-list">
        {/* Dashboard Navigation Link */}
        <Link
          to="/dashboard"
          onClick={onCloseMobileMenu}
          className={`sidebar-nav-item ${
            currentPath === '/dashboard' || currentPath === '/' ? 'active' : ''
          }`}
        >
          <DashboardOutlined className="nav-item-icon" />
          <span>Dashboard</span>
        </Link>

        {/* Timesheet Navigation Link */}
        <Link
          to="/timesheet"
          onClick={onCloseMobileMenu}
          className={`sidebar-nav-item ${currentPath === '/timesheet' ? 'active' : ''}`}
        >
          <CalendarOutlined className="nav-item-icon" />
          <span>Timesheet</span>
        </Link>

        {/* Settings Navigation Link */}
        <Link
          to="/settings"
          onClick={onCloseMobileMenu}
          className={`sidebar-nav-item ${currentPath === '/settings' ? 'active' : ''}`}
        >
          <SettingOutlined className="nav-item-icon" />
          <span>Settings</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Fixed Sider (>= 900px) */}
      <Sider
        width={220}
        className="enterprise-sidebar desktop-sidebar"
      >
        {renderNavContent()}
      </Sider>

      {/* Mobile Drawer Navigation (< 900px) */}
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={onCloseMobileMenu}
        width={240}
        className="mobile-sidebar-drawer"
        styles={{
          body: {
            padding: 0,
            backgroundColor: '#0b1220',
          },
          header: {
            display: 'none',
          },
        }}
      >
        {renderNavContent()}
      </Drawer>
    </>
  );
}

Sidebar.propTypes = {
  mobileOpen: PropTypes.bool,
  onCloseMobileMenu: PropTypes.func,
};
