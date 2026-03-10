'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { mockInspections } from "@/data/inspections";
import type { Inspection } from "@/types/inspection";

interface DIContextValue {
  di: Inspection[];
  addDI: (item: Inspection) => void;
  updateDI: (id: number, patch: Partial<Inspection>) => void;
}

export const DIContext = createContext<DIContextValue>({
  di: mockInspections,
  addDI: () => {},
  updateDI: () => {},
});

export const DIProvider = ({ children }: { children: ReactNode }) => {
  const [di, setDi] = useState<Inspection[]>(mockInspections);

  const addDI = useCallback((item: Inspection) => {
    setDi((prev) => [item, ...prev]);
  }, []);

  const updateDI = useCallback((id: number, patch: Partial<Inspection>) => {
    setDi((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }, []);

  const value = useMemo(() => ({ di, addDI, updateDI }), [di, addDI, updateDI]);

  return <DIContext.Provider value={value}>{children}</DIContext.Provider>;
};

export const useDI = (): DIContextValue => useContext(DIContext);
