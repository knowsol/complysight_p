import { _midCode, _mids, _oss, _pfx, _sIds, _smalls, _sysMap } from "@/data/systems";
import { SYS } from "@/data/systems";
import type { Resource, ResourceGroup } from "@/types/resource";

export const mockResources: Resource[] = (() => {
  const arr: Resource[] = [];
  let id = 1;

  _sIds.forEach((sid) => {
    const cnt = sid === "SHARED" ? 28 : [42, 28, 35, 30, 32, 22, 25, 38, 20][_sIds.indexOf(sid)];

    for (let i = 0; i < cnt; i += 1) {
      const mi = _mids[i % _mids.length];
      const sm = _smalls[mi][(i >> 3) % _smalls[mi].length];
      const seq = String(i + 1).padStart(2, "0");
      arr.push({
        id: id++,
        sysId: sid,
        sysNm: _sysMap[sid],
        nm: `${_pfx[sid]}-${_midCode[mi]}-${seq}`,
        mid: mi,
        small: sm,
        st: id % 15 === 0 ? "미사용" : "사용",
        ip: `${10 + _sIds.indexOf(sid)}.${100 + (i >> 4)}.${(i % 16) * 10 + 1}.${(i % 254) + 1}`,
        os: mi === "서버" || mi === "WAS" ? _oss[i % _oss.length] : "",
        resourceId: `${_pfx[sid]}-${_midCode[mi]}-${seq}`,
        inspectors: [["user01", "user02", "admin"][i % 3]],
      });
    }
  });

  return arr;
})();

export const mockResourceGroups: ResourceGroup[] = SYS;

export const RES = mockResources;
