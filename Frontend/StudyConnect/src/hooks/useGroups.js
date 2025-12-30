import { useState, useEffect, useCallback } from 'react';
import { getAllGroups, joinGroup, leaveGroup, deleteGroup } from '../api/groupServices';

export function useGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingSet, setActionLoadingSet] = useState(new Set());
  const setActionLoading = useCallback((id, adding) => {
    setActionLoadingSet(prev => {
      const s = new Set(prev);
      if (adding) s.add(id); else s.delete(id);
      return s;
    });
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getAllGroups();
      setGroups(resp);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const join = useCallback(async (groupId) => {

    // prevent duplicate actions
    if (actionLoadingSet.has(groupId)) return;
    setActionLoading(groupId, true);
    try {
        await joinGroup(groupId);
        setGroups(prev => prev.map(g => g.id === groupId ? { 
            ...g, member: true, currentMembers: g.currentMembers + 1 
        } : g));
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(groupId, false);
    }
  }, [actionLoadingSet, setActionLoading]);

  const leave = useCallback(async (groupId) => {
    if (actionLoadingSet.has(groupId)) return;
    setActionLoading(groupId, true);
    try {
      await leaveGroup(groupId);
      setGroups(prev => prev.map(g => g.id === groupId ? { 
        ...g, member: false, currentMembers: Math.max(0, g.currentMembers - 1) 
      } : g));
    } catch (err) {
        throw err;
    } finally {
      setActionLoading(groupId, false);
    }
  }, [actionLoadingSet, setActionLoading]);

  const groupDelete = useCallback(async (groupId) => {
    if (actionLoadingSet.has(groupId)) return;
    setActionLoading(groupId, true);
    try {
      await deleteGroup(groupId);
      setGroups(prev => prev.filter(g => g.id !== groupId));
    } catch (err) {
        throw err;
    } finally {
      setActionLoading(groupId, false);
    }
    }, [actionLoadingSet, setActionLoading]);

  return { groups, loading, actionLoadingSet, refresh, join, leave, groupDelete, setGroups };
}