import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

/**
 * Owns all Supabase reads/writes for the current user's time entries.
 * Exposes loading / error state plus CRUD + billable-toggle actions
 * with optimistic UI updates (rolled back on failure).
 */
export function useTimeEntries() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('time_entries')
        .select('*')
        .order('entry_date', { ascending: false });

      if (fetchError) throw fetchError;
      setEntries(data ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load time entries. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = async (payload) => {
    const { data, error: insertError } = await supabase
      .from('time_entries')
      .insert([{ ...payload, user_id: user.id }])
      .select()
      .single();

    if (insertError) throw insertError;
    setEntries((prev) => [data, ...prev]);
    return data;
  };

  const updateEntry = async (id, payload) => {
    const previous = entries;
    // Optimistic update
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...payload } : e)));

    const { data, error: updateError } = await supabase
      .from('time_entries')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      setEntries(previous); // rollback
      throw updateError;
    }
    setEntries((prev) => prev.map((e) => (e.id === id ? data : e)));
    return data;
  };

  const deleteEntry = async (id) => {
    const previous = entries;
    setEntries((prev) => prev.filter((e) => e.id !== id));

    const { error: deleteError } = await supabase.from('time_entries').delete().eq('id', id);
    if (deleteError) {
      setEntries(previous); // rollback
      throw deleteError;
    }
  };

  const toggleBillable = async (id, isBillable) => {
    return updateEntry(id, { is_billable: isBillable });
  };

  return {
    entries,
    loading,
    error,
    refetch: fetchEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    toggleBillable,
  };
}
