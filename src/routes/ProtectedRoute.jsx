import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { useAuth } from '../hooks/useAuth';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // Avoid a flash-of-login-page while we check for an existing session
    return (
      <Layout style={{ minHeight: '100vh', padding: 24 }}>
        <LoadingSkeleton rows={4} />
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
