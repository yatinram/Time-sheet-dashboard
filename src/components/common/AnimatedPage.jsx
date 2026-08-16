import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Wraps any page component with a smooth fade + slide-up entrance animation.
 * Gives users a polished feel when navigating between routes.
 */
export default function AnimatedPage({ children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Tiny delay so the browser paints the initial state first
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`animated-page ${visible ? 'animated-page--visible' : ''}`}
    >
      {children}
    </div>
  );
}

AnimatedPage.propTypes = {
  children: PropTypes.node.isRequired,
};
