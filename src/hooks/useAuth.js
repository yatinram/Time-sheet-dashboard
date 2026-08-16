import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Access the current Supabase auth session, loading state, and
 * signUp / signIn / signOut actions from anywhere in the tree.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
