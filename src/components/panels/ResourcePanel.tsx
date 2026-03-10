'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal, UnsavedConfirm } from '@/components/ui/ConfirmModal';
import { DatePicker } from '@/components/ui/DatePicker';
import { FormRow, SectionTitle } from '@/components/ui/FormRow';
import { FormInput, FormSelect, FormTextarea } from '@/components/ui/Input';
import { SidePanel } from '@/components/ui/SidePanel';
import { Toggle } from '@/components/ui/Toggle';
import { Icon } from '@/components/ui/Icon';
import { C } from '@/lib/theme/colors';
import { CL_INIT } from '@/data/checklists';
import { SYS } from '@/data/manager';
import { USERS } from '@/data/users';
import type { Resource } from '@/types/resource';
import type { System } from '@/types/system';

interface ResourcePanelProps {
  open: boolean;
  onClose: () => void;
  resource: Resource | null;
  systems?: System[];
  defaultSysId?: string;
  hasLinkedCL?: boolean;
  onSubmit?: (form: Partial<Resource> & Record<string, unknown>, editId?: number) => void;
  onDelete?: (resource: Resource) => void;
}

const midOptions = ['서버', 'WEB', 'WAS', 'DBMS', '네트워크', '보안', '스토리지', '백업', '서비스', '유효성'];
const smallByMid: Record<string, string[]> = {
  서버: ['Linux', 'Windows', 'AIX', '기타'],
  WEB: ['Apache', 'Nginx', 'IIS'],
  WAS: ['Tomcat', 'WebLogic', 'JBoss', 'JEUS'],
  DBMS: ['MySQL', 'PostgreSQL', 'Oracle', 'MSSQL', 'MariaDB'],
  네트워크: ['L2 Switch', 'L3 Switch', 'Router', 'Firewall'],
  보안: ['WAF', 'IPS', 'IDS', '방화벽'],
  스토리지: ['NAS', 'SAN', 'DAS'],
  백업: ['Backup Server', 'Tape'],
  서비스: ['URL 모니터링', 'API 모니터링', '포트 모니터링'],
  유효성: ['인증서', '라이선스', '계정'],
};

const emptyForm = {
  nm: '',
  parentNm: '',
  large: '',
  mid: '',
  small: '',
  st: '사용',
  mgmtOrg: '',
  operType: '',
  importDt: '',
  firstUsage: '',
  virtualYn: 'N',
  prevUsage: '',
  usage: '',
  resourceId: '',
  detailUsage: '',
  ip: '',
  serviceIp: '',
  manufacturer: '',
  model: '',
  os: '',
  serial: '',
  memory: '',
  cpuClock: '',
  cpuModel: '',
  cpuCore: '',
  cpuArch: '',
  localDisk: '',
  memo: '',
  serviceUrls: [''],
  installPaths: [''],
  logPaths: [''],
  port: '',
  snmpAccount: '',
  snmpVersion: '',
  snmpAuth: '',
  inspectors: [] as string[],
  sysId: '',
  clId: '',
  version: '',
};

export function ResourcePanel({
  open,
  onClose,
  resource,
  systems,
  defaultSysId,
  onSubmit,
  onDelete,
  hasLinkedCL,
}: ResourcePanelProps) {
  const isEdit = !!resource;
  const [form, setForm] = useState({ ...emptyForm });
  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clSearch, setClSearch] = useState('');
  const initialRef = useRef({ ...emptyForm });

  useEffect(() => {
    if (!open) return;
    const loaded = resource
      ? {
          ...emptyForm,
          ...resource,
          st: resource.st || '사용',
          large:
            (resource as Record<string, string>).large ||
            (['WEB', 'WAS', 'DBMS', '서비스', '유효성'].includes(resource.mid) ? '소프트웨어' : '하드웨어'),
          parentNm: (resource as Record<string, string>).parentNm || '',
          mgmtOrg: (resource as Record<string, string>).mgmtOrg || '',
          operType: (resource as Record<string, string>).operType || '',
          importDt: (resource as Record<string, string>).importDt || '',
          firstUsage: (resource as Record<string, string>).firstUsage || '',
          virtualYn: (resource as Record<string, string>).virtualYn || 'N',
          prevUsage: (resource as Record<string, string>).prevUsage || '',
          usage: (resource as Record<string, string>).usage || '',
          detailUsage: (resource as Record<string, string>).detailUsage || '',
          serviceIp: (resource as Record<string, string>).serviceIp || '',
          manufacturer: (resource as Record<string, string>).manufacturer || '',
          model: (resource as Record<string, string>).model || '',
          serial: (resource as Record<string, string>).serial || '',
          memory: (resource as Record<string, string>).memory || '',
          cpuClock: (resource as Record<string, string>).cpuClock || '',
          cpuModel: (resource as Record<string, string>).cpuModel || '',
          cpuCore: (resource as Record<string, string>).cpuCore || '',
          cpuArch: (resource as Record<string, string>).cpuArch || '',
          localDisk: (resource as Record<string, string>).localDisk || '',
          memo: (resource as Record<string, string>).memo || '',
          serviceUrls: ((resource as Record<string, string[]>).serviceUrls || []).length
            ? (resource as Record<string, string[]>).serviceUrls
            : [(resource as Record<string, string>).serviceUrl || ''],
          installPaths: ((resource as Record<string, string[]>).installPaths || []).length
            ? (resource as Record<string, string[]>).installPaths
            : [(resource as Record<string, string>).installPath || ''],
          logPaths: ((resource as Record<string, string[]>).logPaths || []).length
            ? (resource as Record<string, string[]>).logPaths
            : [(resource as Record<string, string>).logPath || ''],
          port: (resource as Record<string, string>).port || '',
          snmpAccount: (resource as Record<string, string>).snmpAccount || '',
          snmpVersion: (resource as Record<string, string>).snmpVersion || '',
          snmpAuth: (resource as Record<string, string>).snmpAuth || '',
          inspectors: (resource.inspectors || []).length ? resource.inspectors : [],
          sysId: resource.sysId || '',
          clId: String((resource as Record<string, string>).clId || ''),
          version: (resource as Record<string, string>).version || '',
        }
      : { ...emptyForm, sysId: defaultSysId || '' };

    setForm(loaded);
    initialRef.current = loaded;
    setEditMode(false);
    setConfirmOpen(false);
    setDeleteConfirm(false);
    setErrors({});
    setClSearch('');
  }, [open, resource, defaultSysId]);

  const ro = isEdit && !editMode;
  const allSystems = systems || SYS;
  const linkedChecklist =
    form.clId === 'none'
      ? null
      : CL_INIT.find((cl) => String(cl.id) === String(form.clId)) || CL_INIT.find((cl) => cl.sub === form.mid) || null;

  const visibleChecklists = CL_INIT.filter((cl) => {
    const q = clSearch.trim().toLowerCase();
    return !q || cl.nm.toLowerCase().includes(q) || (cl.sub || '').toLowerCase().includes(q) || cl.type.toLowerCase().includes(q);
  }).sort((a, b) => {
    const aMatch = a.sub === form.mid ? 0 : 1;
    const bMatch = b.sub === form.mid ? 0 : 1;
    return aMatch - bMatch || a.nm.localeCompare(b.nm);
  });

  const setField = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const setListValue = (key: 'serviceUrls' | 'installPaths' | 'logPaths', index: number, value: string) => {
    const next = [...form[key]];
    next[index] = value;
    setField(key, next);
  };

  const addListValue = (key: 'serviceUrls' | 'installPaths' | 'logPaths') => {
    setField(key, [...form[key], '']);
  };

  const removeListValue = (key: 'serviceUrls' | 'installPaths' | 'logPaths', index: number) => {
    setField(
      key,
      form[key].filter((_: string, idx: number) => idx !== index),
    );
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.nm.trim()) nextErrors.nm = '자원명은 필수입니다.';
    if (!form.sysId) nextErrors.sysId = '정보시스템을 선택하세요.';
    if (!form.large) nextErrors.large = '대분류를 선택하세요.';
    if (!form.mid) nextErrors.mid = '중분류를 선택하세요.';
    if (!form.small) nextErrors.small = '소분류를 선택하세요.';
    if (['서버', 'WEB', 'WAS', 'DBMS', '네트워크', '보안'].includes(form.mid) && !form.ip.trim()) nextErrors.ip = '장비 IP는 필수입니다.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const savePanel = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      clId: String(form.clId || linkedChecklist?.id || ''),
      serviceUrl: form.serviceUrls[0] || '',
      installPath: form.installPaths[0] || '',
      logPath: form.logPaths[0] || '',
    };
    onSubmit?.(payload, resource?.id);
    if (isEdit) {
      initialRef.current = payload;
      setForm(payload);
      setEditMode(false);
      return;
    }
    onClose();
  };

  const discardChanges = () => {
    setConfirmOpen(false);
    if (!isEdit) {
      onClose();
      return;
    }
    setForm(initialRef.current);
    setEditMode(false);
  };

  const requestClose = () => {
    if (!isEdit || editMode) {
      setConfirmOpen(true);
      return;
    }
    onClose();
  };

  return (
    <>
      <SidePanel
        open={open}
        onClose={requestClose}
        onOverlayClick={requestClose}
        title={isEdit ? (editMode ? '자원 수정' : '자원 상세') : '자원 추가'}
        width={580}
        noScroll
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="기본 정보" />
            <FormRow label="사용유무">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Toggle on={form.st === '사용'} onClick={() => !ro && setField('st', form.st === '사용' ? '미사용' : '사용')} disabled={ro} />
                <span style={{ fontSize: 13, fontWeight: 500, color: form.st === '사용' ? C.pri : C.txL }}>{form.st}</span>
              </div>
            </FormRow>

            <FormRow label="자원명" required>
              <FormInput value={form.nm} onChange={(e) => setField('nm', e.target.value)} readOnly={ro} style={errors.nm ? { borderColor: C.red } : undefined} />
              {errors.nm ? <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{errors.nm}</div> : null}
            </FormRow>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="자원 ID" style={{ flex: 1 }}>
                <FormInput value={isEdit ? form.resourceId || resource?.resourceId || '' : '저장 시 자동생성'} readOnly style={{ background: '#F9FAFC', pointerEvents: 'none' }} />
              </FormRow>
              <FormRow label="소속 정보시스템" required style={{ flex: 1 }}>
                <FormSelect value={form.sysId} onChange={(e) => setField('sysId', e.target.value)} disabled={ro}>
                  <option value="">선택하세요</option>
                  {allSystems.map((sys) => (
                    <option key={sys.id} value={sys.id}>
                      {sys.nm}
                    </option>
                  ))}
                </FormSelect>
                {errors.sysId ? <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{errors.sysId}</div> : null}
              </FormRow>
              <FormRow label="상위 자원명" style={{ flex: 1 }}>
                <FormInput value={form.parentNm} onChange={(e) => setField('parentNm', e.target.value)} readOnly={ro} />
              </FormRow>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="대분류" required style={{ flex: 1 }}>
                <FormSelect value={form.large} onChange={(e) => setField('large', e.target.value)} disabled={ro}>
                  <option value="">선택하세요</option>
                  {['하드웨어', '소프트웨어'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FormSelect>
                {errors.large ? <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{errors.large}</div> : null}
              </FormRow>
              <FormRow label="중분류" required style={{ flex: 1 }}>
                <FormSelect
                  value={form.mid}
                  onChange={(e) => {
                    setField('mid', e.target.value);
                    setField('small', '');
                  }}
                  disabled={ro}
                >
                  <option value="">선택하세요</option>
                  {midOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FormSelect>
                {errors.mid ? <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{errors.mid}</div> : null}
              </FormRow>
              <FormRow label="소분류" required style={{ flex: 1 }}>
                <FormSelect value={form.small} onChange={(e) => setField('small', e.target.value)} disabled={ro}>
                  <option value="">선택하세요</option>
                  {(smallByMid[form.mid] || []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FormSelect>
                {errors.small ? <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{errors.small}</div> : null}
              </FormRow>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="관리주체" style={{ flex: 1 }}>
                <FormInput value={form.mgmtOrg} onChange={(e) => setField('mgmtOrg', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="운영/개발 구분" style={{ flex: 1 }}>
                <FormSelect value={form.operType} onChange={(e) => setField('operType', e.target.value)} disabled={ro}>
                  <option value="">선택하세요</option>
                  {['운영', '개발', '테스트', 'DR'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FormSelect>
              </FormRow>
              <FormRow label="도입일" style={{ flex: 1 }}>
                <DatePicker value={form.importDt} onChange={(value) => setField('importDt', value)} readOnly={ro} />
              </FormRow>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="용도 정보" />
            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="사용용도" style={{ flex: 1 }}>
                <FormSelect value={form.usage} onChange={(e) => setField('usage', e.target.value)} disabled={ro}>
                  <option value="">선택</option>
                  {['운영', '개발', '테스트', '백업', 'DR', '대기', '기타'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FormSelect>
              </FormRow>
              <FormRow label="최초 사용용도" style={{ flex: 1 }}>
                <FormSelect value={form.firstUsage} onChange={(e) => setField('firstUsage', e.target.value)} disabled={ro}>
                  <option value="">선택</option>
                  {['운영', '개발', '테스트', '백업', 'DR', '대기', '기타'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FormSelect>
              </FormRow>
              <FormRow label="이전 사용용도" style={{ flex: 1 }}>
                <FormSelect value={form.prevUsage} onChange={(e) => setField('prevUsage', e.target.value)} disabled={ro}>
                  <option value="">선택</option>
                  {['운영', '개발', '테스트', '백업', 'DR', '대기', '기타'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FormSelect>
              </FormRow>
            </div>
            <FormRow label="상세용도">
              <FormTextarea value={form.detailUsage} onChange={(e) => setField('detailUsage', e.target.value)} readOnly={ro} style={ro ? { resize: 'none', background: '#F9FAFC' } : undefined} />
            </FormRow>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="네트워크 정보" />
            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="장비 IP" required style={{ flex: 1 }}>
                <FormInput value={form.ip} onChange={(e) => setField('ip', e.target.value)} readOnly={ro} style={errors.ip ? { borderColor: C.red } : undefined} />
                {errors.ip ? <div style={{ fontSize: 11, color: C.red, marginTop: 3 }}>{errors.ip}</div> : null}
              </FormRow>
              <FormRow label="서비스 IP" style={{ flex: 1 }}>
                <FormInput value={form.serviceIp} onChange={(e) => setField('serviceIp', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="포트" style={{ flex: 1 }}>
                <FormInput value={form.port} onChange={(e) => setField('port', e.target.value)} readOnly={ro} />
              </FormRow>
            </div>

            {[
              ['서비스 URL', 'serviceUrls'],
              ['설치경로', 'installPaths'],
              ['로그경로', 'logPaths'],
            ].map(([label, key]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: C.txS }}>{label}</label>
                  {!ro ? (
                    <button
                      type="button"
                      onClick={() => addListValue(key as 'serviceUrls' | 'installPaths' | 'logPaths')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 8px',
                        fontSize: 11,
                        fontWeight: 600,
                        border: `1px solid ${C.pri}`,
                        borderRadius: 4,
                        color: C.pri,
                        background: C.priL,
                        cursor: 'pointer',
                      }}
                    >
                      + 추가
                    </button>
                  ) : null}
                </div>
                {form[key as 'serviceUrls' | 'installPaths' | 'logPaths'].map((value: string, idx: number) => (
                  <div key={`${key}-${idx}`} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                    <FormInput
                      value={value}
                      onChange={(e) => setListValue(key as 'serviceUrls' | 'installPaths' | 'logPaths', idx, e.target.value)}
                      readOnly={ro}
                    />
                    {!ro && form[key as 'serviceUrls' | 'installPaths' | 'logPaths'].length > 1 ? (
                      <span onClick={() => removeListValue(key as 'serviceUrls' | 'installPaths' | 'logPaths', idx)} style={{ cursor: 'pointer', fontSize: 16, color: C.txL }}>
                        ×
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="하드웨어/시스템 정보" />
            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="OS" style={{ flex: 1 }}>
                <FormInput value={form.os} onChange={(e) => setField('os', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="버전" style={{ flex: 1 }}>
                <FormInput value={form.version} onChange={(e) => setField('version', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="가상화 여부" style={{ flex: 1 }}>
                <FormSelect value={form.virtualYn} onChange={(e) => setField('virtualYn', e.target.value)} disabled={ro}>
                  <option value="N">No</option>
                  <option value="Y">Yes</option>
                </FormSelect>
              </FormRow>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="제조사" style={{ flex: 1 }}>
                <FormInput value={form.manufacturer} onChange={(e) => setField('manufacturer', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="모델명" style={{ flex: 1 }}>
                <FormInput value={form.model} onChange={(e) => setField('model', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="시리얼넘버" style={{ flex: 1 }}>
                <FormInput value={form.serial} onChange={(e) => setField('serial', e.target.value)} readOnly={ro} />
              </FormRow>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="메모리(GB)" style={{ flex: 1 }}>
                <FormInput value={form.memory} onChange={(e) => setField('memory', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="로컬 디스크(GB)" style={{ flex: 1 }}>
                <FormInput value={form.localDisk} onChange={(e) => setField('localDisk', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="CPU 코어수" style={{ flex: 1 }}>
                <FormInput value={form.cpuCore} onChange={(e) => setField('cpuCore', e.target.value)} readOnly={ro} />
              </FormRow>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="SNMP 정보" />
            <div style={{ display: 'flex', gap: 12 }}>
              <FormRow label="SNMP 계정정보" style={{ flex: 1 }}>
                <FormInput value={form.snmpAccount} onChange={(e) => setField('snmpAccount', e.target.value)} readOnly={ro} />
              </FormRow>
              <FormRow label="SNMP 버전" style={{ flex: 1 }}>
                <FormSelect value={form.snmpVersion} onChange={(e) => setField('snmpVersion', e.target.value)} disabled={ro}>
                  <option value="">선택하세요</option>
                  {['v1', 'v2c', 'v3'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FormSelect>
              </FormRow>
              <FormRow label="CPU 아키텍처" style={{ flex: 1 }}>
                <FormSelect value={form.cpuArch} onChange={(e) => setField('cpuArch', e.target.value)} disabled={ro}>
                  <option value="">선택하세요</option>
                  {['x86_64', 'ARM64', 'SPARC', 'POWER'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FormSelect>
              </FormRow>
            </div>
            <FormRow label="SNMP 인증정보">
              <FormTextarea value={form.snmpAuth} onChange={(e) => setField('snmpAuth', e.target.value)} readOnly={ro} style={ro ? { resize: 'none', background: '#F9FAFC' } : undefined} />
            </FormRow>
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="점검자" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {form.inspectors.length === 0 ? <span style={{ fontSize: 12, color: C.txL }}>점검자가 없습니다.</span> : null}
              {form.inspectors.map((userId: string) => {
                const user = USERS.find((entry) => entry.userId === userId);
                if (!user) return null;
                return (
                  <span
                    key={userId}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '4px 10px',
                      borderRadius: 14,
                      background: C.priL,
                      color: C.priD,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {user.userNm}
                    {!ro ? (
                      <span onClick={() => setField('inspectors', form.inspectors.filter((id: string) => id !== userId))} style={{ cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>
                        ×
                      </span>
                    ) : null}
                  </span>
                );
              })}
            </div>
            {!ro ? (
              <FormSelect
                value=""
                onChange={(e) => {
                  if (e.target.value && !form.inspectors.includes(e.target.value)) {
                    setField('inspectors', [...form.inspectors, e.target.value]);
                  }
                }}
              >
                <option value="">+ 점검자 추가</option>
                {USERS.filter((user) => user.useYn === 'Y' && !form.inspectors.includes(user.userId)).map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.userNm} ({user.userRole})
                  </option>
                ))}
              </FormSelect>
            ) : null}
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="점검표 연결" />
            {linkedChecklist ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: '#dcfce7',
                  border: '1px solid #bbf7d0',
                  marginBottom: 8,
                }}
              >
                <Icon n="check" s={13} c="#16a34a" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>{linkedChecklist.nm}</div>
                  <div style={{ fontSize: 11, color: '#15803d' }}>
                    {linkedChecklist.sub || '공통'} · {linkedChecklist.items}항목
                  </div>
                </div>
                {!ro ? (
                  <span onClick={() => setField('clId', 'none')} style={{ cursor: 'pointer', color: C.txL, fontSize: 18, lineHeight: 1 }}>
                    ×
                  </span>
                ) : null}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: C.txL, marginBottom: 8 }}>연결된 점검표가 없습니다.</div>
            )}
            {!ro ? (
              <>
                <div style={{ position: 'relative', marginBottom: 8 }}>
                  <FormInput value={clSearch} onChange={(e) => setClSearch(e.target.value)} placeholder="점검표명, 유형, 분류 검색" style={{ paddingLeft: 28 }} />
                  <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Icon n="search" s={13} c={C.txL} />
                  </span>
                </div>
                <div style={{ border: `1px solid ${C.brd}`, borderRadius: 8, overflow: 'hidden', maxHeight: 220, overflowY: 'auto' }}>
                  <div
                    onClick={() => setField('clId', 'none')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 14px',
                      borderBottom: `1px solid ${C.brd}`,
                      cursor: 'pointer',
                      background: form.clId === 'none' ? `${C.pri}12` : '#fff',
                    }}
                  >
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${form.clId === 'none' ? C.pri : C.brd}`, background: form.clId === 'none' ? C.pri : '#fff' }} />
                    <span style={{ fontSize: 12, color: form.clId === 'none' ? C.pri : C.txL }}>연결 안 함</span>
                  </div>
                  {visibleChecklists.map((checklist) => {
                    const active = String(form.clId) === String(checklist.id);
                    const recommended = checklist.sub === form.mid;
                    return (
                      <div
                        key={checklist.id}
                        onClick={() => setField('clId', String(checklist.id))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '9px 14px',
                          borderBottom: `1px solid ${C.brd}`,
                          cursor: 'pointer',
                          background: active ? `${C.pri}12` : '#fff',
                        }}
                      >
                        <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${active ? C.pri : C.brd}`, background: active ? C.pri : '#fff' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: active ? C.pri : C.txt }}>
                            {checklist.nm}
                            {recommended ? (
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 8, background: '#DBEAFE', color: '#1D4ED8' }}>권장</span>
                            ) : null}
                          </div>
                          <div style={{ fontSize: 11, color: C.txL, marginTop: 1 }}>
                            {checklist.sub || '공통'} · {checklist.items}항목 · {checklist.type}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}
          </div>

          <div style={{ marginBottom: 18 }}>
            <SectionTitle label="기타" />
            <FormRow label="비고">
              <FormTextarea value={form.memo} onChange={(e) => setField('memo', e.target.value)} readOnly={ro} style={ro ? { resize: 'none', background: '#F9FAFC' } : undefined} />
            </FormRow>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
          {!editMode && isEdit && hasLinkedCL ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 10,
                padding: '8px 12px',
                borderRadius: 6,
                background: '#FFF7ED',
                border: '1px solid #FED7AA',
              }}
            >
              <Icon n="alert" s={13} c="#EA580C" />
              <span style={{ color: '#9A3412', fontSize: 12 }}>연결된 점검표가 있어 삭제할 수 없습니다. 점검표 연결을 해제한 후 삭제하세요.</span>
            </div>
          ) : null}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {editMode || !isEdit ? (
              <>
                <Button onClick={requestClose}>취소</Button>
                <div style={{ flex: 1 }} />
                <Button primary onClick={savePanel}>{isEdit ? '저장' : '등록'}</Button>
              </>
            ) : (
              <>
                <Button onClick={onClose}>닫기</Button>
                <div style={{ flex: 1 }} />
                <Button danger disabled={Boolean(hasLinkedCL)} onClick={() => !hasLinkedCL && setDeleteConfirm(true)} style={{ marginRight: 8 }}>
                  삭제
                </Button>
                <Button success onClick={() => setEditMode(true)}>수정</Button>
              </>
            )}
          </div>
        </div>
      </SidePanel>

      <ConfirmModal
        open={deleteConfirm}
        title="자원 삭제"
        msg={
          <>
            <strong>{resource?.nm}</strong> 자원이 영구적으로 삭제됩니다.
          </>
        }
        okLabel="삭제"
        onOk={() => {
          if (resource) onDelete?.(resource);
          setDeleteConfirm(false);
          onClose();
        }}
        onCancel={() => setDeleteConfirm(false)}
      />
      <UnsavedConfirm open={confirmOpen} onDiscard={discardChanges} onSave={savePanel} />
    </>
  );
}
