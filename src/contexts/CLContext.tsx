'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { mockChecklists } from "@/data/checklists";
import type { Checklist } from "@/types/checklist";

interface CLContextValue {
  cl: Checklist[];
  addCL: (item: Checklist) => void;
  updateCL: (item: Checklist) => void;
  deleteCL: (id: number) => void;
}

export const CLContext = createContext<CLContextValue>({
  cl: mockChecklists,
  addCL: () => {},
  updateCL: () => {},
  deleteCL: () => {},
});

export const CLProvider = ({ children }: { children: ReactNode }) => {
  const [cl, setCl] = useState<Checklist[]>(mockChecklists);

  const addCL = useCallback((item: Checklist) => {
    setCl((prev) => [item, ...prev]);
  }, []);

  const updateCL = useCallback((item: Checklist) => {
    setCl((prev) => prev.map((entry) => (entry.id === item.id ? item : entry)));
  }, []);

  const deleteCL = useCallback((id: number) => {
    setCl((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const value = useMemo(() => ({ cl, addCL, updateCL, deleteCL }), [cl, addCL, updateCL, deleteCL]);

  return <CLContext.Provider value={value}>{children}</CLContext.Provider>;
};

export const useCL = (): CLContextValue => useContext(CLContext);
