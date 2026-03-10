// @ts-nocheck
'use client';

import { useState } from 'react';
import { C } from '@/lib/theme/colors';
import { Ic } from '@/components/ui/Icon';

type InspFilterNode = string | { label: string; value?: string | null };

export interface InspFilterProps {
  menus: { label: string; value?: string | null; sub?: InspFilterNode[] }[];
  sel: string | null;
  sub?: string | null;
  onSelect: (kind: string | null, sub?: string | null) => void;
  data: any[];
  kindKey?: string;
  midKey?: string;
}

export function InspFilter({ menus, sel, sub = null, onSelect, data, kindKey = "kind", midKey = "mid" }: InspFilterProps) {
  const [openK, setOpenK] = useState<string | null>(null);
  const getNode = (node: InspFilterNode) => (
    typeof node === 'string'
      ? { label: node, value: node }
      : { label: node.label, value: node.value ?? node.label }
  );

  const dCnt = (k: string | null, s: string | null) => {
    if (!data) return 0;
    return data.filter(x => {
      if (k && x[kindKey] !== k) return false;
      if (s && x[midKey] !== s) return false;
      return x.st === "지연";
    }).length;
  };

  const badge = (cnt: number) => cnt > 0 ? (
    <span style={{
      minWidth: 18, height: 18, borderRadius: 9,
      background: C.red, color: "#fff", fontSize: 12, fontWeight: 700,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      padding: "0 5px"
    }}>{cnt}</span>
  ) : null;

  const itemS = (active: boolean): React.CSSProperties => ({
    padding: "9px 14px", borderRadius: 6, cursor: "pointer",
    marginBottom: 2, margin: "1px 6px", fontSize: 15,
    fontWeight: active ? 600 : 500,
    background: active ? C.priL : "",
    color: active ? C.sec : C.txt,
    transition: "all .3s"
  });

  const subS = (active: boolean): React.CSSProperties => ({
    padding: "6px 12px 6px 24px", borderRadius: 6, cursor: "pointer",
    marginBottom: 1, margin: "0 6px", fontSize: 13,
    fontWeight: active ? 600 : 400,
    background: active ? C.priL : "",
    color: active ? C.sec : C.txS,
    transition: "all .3s"
  });

  return (
    <div>
      {menus.map((m, i) => {
        const parent = getNode(m);
        const hasC = m.sub && m.sub.length > 0;
        const parentActive = sel === parent.value && !sub;
        const childActive = hasC && sel === parent.value && !!sub;
        const isOpen = hasC ? true : (openK === String(parent.value) || childActive);

        return (
          <div key={i}>
            <div
              onClick={() => {
                if (hasC) {
                  onSelect(parent.value, null);
                } else {
                  setOpenK(null);
                  onSelect(parent.value, null);
                }
              }}
              style={itemS(parentActive || childActive)}
              onMouseEnter={e => { if (!parentActive && !childActive) e.currentTarget.style.background = C.secL; }}
              onMouseLeave={e => { if (!parentActive && !childActive) e.currentTarget.style.background = ""; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{parent.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {badge(dCnt(parent.value, null))}
                  {hasC && <Ic n={isOpen ? "down" : "right"} s={10} c={C.txL} />}
                </div>
              </div>
            </div>
            {hasC && isOpen && (
              <div style={{ marginBottom: 2 }}>
                {m.sub!.map((s) => {
                  const child = getNode(s);
                  const active = sel === parent.value && sub === child.value;

                  return (
                    <div
                      key={`${parent.label}-${child.value ?? child.label}`}
                      onClick={() => onSelect(parent.value, child.value)}
                      style={subS(active)}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.secL; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = ""; }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 11, color: active ? C.sec : C.txX, lineHeight: 1 }}>─</span>
                          {child.label}
                        </span>
                        {badge(dCnt(parent.value, child.value))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
