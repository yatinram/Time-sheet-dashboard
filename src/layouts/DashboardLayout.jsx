import { useState } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/header/Header';

const { Content } = Layout;

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <Layout className="dashboard-layout-root">
      {/* Enterprise Modular Sidebar Component */}
      <Sidebar mobileOpen={mobileOpen} onCloseMobileMenu={closeMobileMenu} />

      {/* Main Content Area Layout */}
      <Layout className="dashboard-layout-main">
        {/* Enterprise Modular Header Component with Hamburger Toggle */}
        <Header onToggleMobileMenu={toggleMobileMenu} />

        {/* Dynamic Page Content */}
        <Content className="dashboard-layout-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
