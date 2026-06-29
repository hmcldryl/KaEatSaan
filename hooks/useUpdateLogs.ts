'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { UpdateLog } from '@/types/updateLog';

export function useUpdateLogs(outletId: string | null) {
  const [logs, setLogs] = useState<UpdateLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!outletId) return;

    const logsRef = ref(database, `update_logs/${outletId}`);

    onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: UpdateLog[] = Object.entries(data).map(([id, val]) => ({
          ...(val as Omit<UpdateLog, 'id'>),
          id,
        }));
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLogs(list);
      } else {
        setLogs([]);
      }
      setIsLoading(false);
    });

    return () => { off(logsRef); };
  }, [outletId]);

  return { logs, isLoading };
}
