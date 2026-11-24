import { useState, useEffect, useCallback } from "react";
import { getAllGroups, joinGroup, leaveGroup, deleteGroup } from "../api/groupServices";

export function useGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingSet, setActionLoadingSet] = useState(new Set());

  const setActionLoading = useCallback((id, adding) => {
    setActionLoadingSet((prev) => {
      const next = new Set(prev);
      if (adding) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await getAllGroups();
      setGroups(Array.isArray(resp) ? resp : []);
    } catch (err) {
      setError(err.message || "Failed to load study groups.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      refresh();
    } else {
      setLoading(false);
    }
  }, [refresh]);

  const join = useCallback(
    async (groupId) => {
      if (actionLoadingSet.has(groupId)) return;
      setActionLoading(groupId, true);
      try {
        await joinGroup(groupId);
        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId
              ? { ...g, member: true, currentMembers: (g.currentMembers || 0) + 1 }
              : g
          )
        );
      } finally {
        setActionLoading(groupId, false);
      }
    },
    [actionLoadingSet, setActionLoading]
  );

  const leave = useCallback(
    async (groupId) => {
      if (actionLoadingSet.has(groupId)) return;
      setActionLoading(groupId, true);
      try {
        await leaveGroup(groupId);
        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId
              ? { ...g, member: false, currentMembers: Math.max(0, (g.currentMembers || 1) - 1) }
              : g
          )
        );
      } finally {
        setActionLoading(groupId, false);
      }
    },
    [actionLoadingSet, setActionLoading]
  );

  const groupDelete = useCallback(
    async (groupId) => {
      if (actionLoadingSet.has(groupId)) return;
      setActionLoading(groupId, true);
      try {
        await deleteGroup(groupId);
        setGroups((prev) => prev.filter((g) => g.id !== groupId));
      } finally {
        setActionLoading(groupId, false);
      }
    },
    [actionLoadingSet, setActionLoading]
  );

  return { groups, loading, error, actionLoadingSet, refresh, join, leave, groupDelete, setGroups };
}
