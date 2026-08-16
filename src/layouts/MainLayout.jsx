import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/header/Header';

const { Content } = Layout;

export default function DashboardLayout({ children }) {
  return (
    <Layout className="dashboard-layout-root">
      {/* Enterprise Modular Sidebar Component */}
      <Sidebar />

      {/* Main Content Area Layout */}
      <Layout className="dashboard-layout-main">
        {/* Enterprise Modular Header Component */}
        <Header />

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
