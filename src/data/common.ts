import { VC } from "@/data/verification-codes";
import type { Category, CommonCode, CommonCodeGroup, License, SystemInfo } from "@/types/common";

export const mockCategories: Category[] = [
  { id: "c1", nm: "서버", children: [
    { id: "c1-1", nm: "CPU", children: [{ id: "c1-1-1", nm: "사용률" }, { id: "c1-1-2", nm: "코어별" }, { id: "c1-1-3", nm: "대기 큐" }] },
    { id: "c1-2", nm: "메모리", children: [{ id: "c1-2-1", nm: "사용률" }, { id: "c1-2-2", nm: "SWAP" }, { id: "c1-2-3", nm: "캐시" }] },
    { id: "c1-3", nm: "디스크", children: [{ id: "c1-3-1", nm: "사용률" }, { id: "c1-3-2", nm: "I/O" }, { id: "c1-3-3", nm: "inode" }, { id: "c1-3-4", nm: "파일시스템" }] },
    { id: "c1-4", nm: "프로세스", children: [{ id: "c1-4-1", nm: "구동상태" }, { id: "c1-4-2", nm: "좀비" }, { id: "c1-4-3", nm: "한계" }] },
    { id: "c1-5", nm: "서비스", children: [{ id: "c1-5-1", nm: "포트" }, { id: "c1-5-2", nm: "SSH" }, { id: "c1-5-3", nm: "NTP" }, { id: "c1-5-4", nm: "DNS" }] },
    { id: "c1-6", nm: "OS", children: [{ id: "c1-6-1", nm: "커널" }, { id: "c1-6-2", nm: "Uptime" }, { id: "c1-6-3", nm: "시간" }] },
    { id: "c1-7", nm: "로그", children: [{ id: "c1-7-1", nm: "에러" }, { id: "c1-7-2", nm: "용량" }, { id: "c1-7-3", nm: "감사" }, { id: "c1-7-4", nm: "로테이션" }] },
  ]},
  { id: "c2", nm: "보안", children: [
    { id: "c2-1", nm: "패치", children: [{ id: "c2-1-1", nm: "상태" }, { id: "c2-1-2", nm: "긴급" }] },
    { id: "c2-2", nm: "접근통제", children: [{ id: "c2-2-1", nm: "방화벽" }, { id: "c2-2-2", nm: "포트" }, { id: "c2-2-3", nm: "원격접속" }, { id: "c2-2-4", nm: "암호화" }, { id: "c2-2-5", nm: "IPS/IDS" }] },
    { id: "c2-3", nm: "계정관리", children: [{ id: "c2-3-1", nm: "패스워드" }, { id: "c2-3-2", nm: "잠김정책" }, { id: "c2-3-3", nm: "세션" }, { id: "c2-3-4", nm: "불필요계정" }, { id: "c2-3-5", nm: "권한" }] },
    { id: "c2-4", nm: "인증서", children: [{ id: "c2-4-1", nm: "만료" }, { id: "c2-4-2", nm: "SSL" }] },
  ]},
  { id: "c3", nm: "네트워크", children: [
    { id: "c3-1", nm: "인터페이스", children: [{ id: "c3-1-1", nm: "상태" }, { id: "c3-1-2", nm: "트래픽" }, { id: "c3-1-3", nm: "대역폭" }] },
    { id: "c3-2", nm: "품질", children: [{ id: "c3-2-1", nm: "패킷손실" }, { id: "c3-2-2", nm: "지연시간" }] },
    { id: "c3-3", nm: "설정", children: [{ id: "c3-3-1", nm: "ARP" }, { id: "c3-3-2", nm: "라우팅" }, { id: "c3-3-3", nm: "VLAN" }] },
  ]},
  { id: "c4", nm: "WEB", children: [
    { id: "c4-1", nm: "응답", children: [{ id: "c4-1-1", nm: "응답코드" }, { id: "c4-1-2", nm: "응답시간" }, { id: "c4-1-3", nm: "정적리소스" }] },
    { id: "c4-2", nm: "프로세스", children: [{ id: "c4-2-1", nm: "상태" }, { id: "c4-2-2", nm: "커넥션" }, { id: "c4-2-3", nm: "쓰레드" }] },
    { id: "c4-3", nm: "로그", children: [{ id: "c4-3-1", nm: "에러" }, { id: "c4-3-2", nm: "접근" }] },
  ]},
  { id: "c5", nm: "WAS", children: [
    { id: "c5-1", nm: "리소스", children: [{ id: "c5-1-1", nm: "프로세스" }, { id: "c5-1-2", nm: "힙메모리" }, { id: "c5-1-3", nm: "쓰레드" }, { id: "c5-1-4", nm: "GC" }] },
    { id: "c5-2", nm: "커넥션", children: [{ id: "c5-2-1", nm: "JDBC" }, { id: "c5-2-2", nm: "세션" }] },
    { id: "c5-3", nm: "로그/배포", children: [{ id: "c5-3-1", nm: "에러" }, { id: "c5-3-2", nm: "배포" }] },
  ]},
  { id: "c6", nm: "DBMS", children: [
    { id: "c6-1", nm: "상태", children: [{ id: "c6-1-1", nm: "서비스" }, { id: "c6-1-2", nm: "커넥션" }, { id: "c6-1-3", nm: "복제" }] },
    { id: "c6-2", nm: "저장소", children: [{ id: "c6-2-1", nm: "테이블스페이스" }, { id: "c6-2-2", nm: "아카이브" }] },
    { id: "c6-3", nm: "성능", children: [{ id: "c6-3-1", nm: "슬로우쿼리" }, { id: "c6-3-2", nm: "데드락" }, { id: "c6-3-3", nm: "Lock" }, { id: "c6-3-4", nm: "인덱스" }] },
    { id: "c6-4", nm: "로그", children: [{ id: "c6-4-1", nm: "에러" }] },
  ]},
  { id: "c7", nm: "운영", children: [
    { id: "c7-1", nm: "백업", children: [{ id: "c7-1-1", nm: "상태" }, { id: "c7-1-2", nm: "전체" }, { id: "c7-1-3", nm: "증분" }, { id: "c7-1-4", nm: "용량" }, { id: "c7-1-5", nm: "복원" }] },
    { id: "c7-2", nm: "이중화", children: [{ id: "c7-2-1", nm: "상태" }, { id: "c7-2-2", nm: "절체" }, { id: "c7-2-3", nm: "클러스터" }, { id: "c7-2-4", nm: "Heartbeat" }] },
    { id: "c7-3", nm: "성능", children: [{ id: "c7-3-1", nm: "TPS" }, { id: "c7-3-2", nm: "응답시간" }, { id: "c7-3-3", nm: "동시접속" }, { id: "c7-3-4", nm: "부하테스트" }] },
  ]},
  { id: "c8", nm: "하드웨어", children: [
    { id: "c8-1", nm: "전원", children: [{ id: "c8-1-1", nm: "PSU" }, { id: "c8-1-2", nm: "UPS" }] },
    { id: "c8-2", nm: "냉각", children: [{ id: "c8-2-1", nm: "온도" }, { id: "c8-2-2", nm: "팬" }] },
    { id: "c8-3", nm: "스토리지", children: [{ id: "c8-3-1", nm: "RAID" }, { id: "c8-3-2", nm: "SMART" }] },
  ]},
];

export const mockCommonCodeGroups: CommonCodeGroup[] = [
  { id: "GRP001", nm: "자원유형", desc: "자원 대분류/중분류/소분류 구분 코드", cnt: 6, useYn: "Y", regDt: "2026-01-10" },
  { id: "GRP002", nm: "점검상태", desc: "점검 진행 상태 코드", cnt: 4, useYn: "Y", regDt: "2026-01-10" },
  { id: "GRP003", nm: "점검결과", desc: "점검 결과 판정 코드", cnt: 2, useYn: "Y", regDt: "2026-01-10" },
  { id: "GRP004", nm: "사용자역할", desc: "시스템 내 사용자 권한 유형", cnt: 4, useYn: "Y", regDt: "2026-01-10" },
  { id: "GRP005", nm: "점검유형", desc: "일상/특별 점검 유형 코드", cnt: 2, useYn: "Y", regDt: "2026-01-11" },
  { id: "GRP006", nm: "특별점검종류", desc: "특별점검 세부 종류 코드", cnt: 4, useYn: "Y", regDt: "2026-01-11" },
  { id: "GRP007", nm: "정기점검주기", desc: "정기점검 반복 주기 코드", cnt: 3, useYn: "Y", regDt: "2026-01-12" },
  { id: "GRP008", nm: "알림유형", desc: "발송 알림 종류 코드", cnt: 5, useYn: "Y", regDt: "2026-01-15" },
  { id: "GRP009", nm: "파일유형", desc: "첨부 가능한 파일 형식 코드", cnt: 8, useYn: "N", regDt: "2026-01-20" },
  { id: "GRP010", nm: "시스템유형", desc: "정보시스템 유형 분류 코드", cnt: 3, useYn: "Y", regDt: "2026-01-20" },
];

const commonCodeMap: Record<string, CommonCode[]> = {
  GRP001: [
    { id: "C001001", grpId: "GRP001", cd: "HW", nm: "하드웨어", desc: "물리 서버·장비", sort: 1, useYn: "Y", regDt: "2026-01-10" },
    { id: "C001002", grpId: "GRP001", cd: "SW", nm: "소프트웨어", desc: "OS·미들웨어·앱", sort: 2, useYn: "Y", regDt: "2026-01-10" },
    { id: "C001003", grpId: "GRP001", cd: "NW", nm: "네트워크", desc: "스위치·라우터·방화벽", sort: 3, useYn: "Y", regDt: "2026-01-10" },
    { id: "C001004", grpId: "GRP001", cd: "SEC", nm: "보안", desc: "보안 장비 및 솔루션", sort: 4, useYn: "Y", regDt: "2026-01-10" },
    { id: "C001005", grpId: "GRP001", cd: "DB", nm: "DBMS", desc: "데이터베이스 서버", sort: 5, useYn: "Y", regDt: "2026-01-10" },
    { id: "C001006", grpId: "GRP001", cd: "WAS", nm: "WAS", desc: "웹 애플리케이션 서버", sort: 6, useYn: "Y", regDt: "2026-01-10" },
  ],
  GRP002: [
    { id: "C002001", grpId: "GRP002", cd: "REQ", nm: "요청", desc: "점검 요청 상태", sort: 1, useYn: "Y", regDt: "2026-01-10" },
    { id: "C002002", grpId: "GRP002", cd: "STP", nm: "중단", desc: "점검 중단 상태", sort: 2, useYn: "Y", regDt: "2026-01-10" },
    { id: "C002003", grpId: "GRP002", cd: "DLY", nm: "지연", desc: "기한 초과 지연", sort: 3, useYn: "Y", regDt: "2026-01-10" },
    { id: "C002004", grpId: "GRP002", cd: "DONE", nm: "완료", desc: "점검 완료 상태", sort: 4, useYn: "Y", regDt: "2026-01-10" },
  ],
  GRP003: [
    { id: "C003001", grpId: "GRP003", cd: "OK", nm: "정상", desc: "정상 판정", sort: 1, useYn: "Y", regDt: "2026-01-10" },
    { id: "C003002", grpId: "GRP003", cd: "NG", nm: "비정상", desc: "비정상 판정", sort: 2, useYn: "Y", regDt: "2026-01-10" },
  ],
  GRP004: [
    { id: "C004001", grpId: "GRP004", cd: "SYS", nm: "시스템 관리자", desc: "전체 권한", sort: 1, useYn: "Y", regDt: "2026-01-10" },
    { id: "C004002", grpId: "GRP004", cd: "ORG", nm: "기관 관리자", desc: "기관 범위 권한", sort: 2, useYn: "Y", regDt: "2026-01-10" },
    { id: "C004003", grpId: "GRP004", cd: "MNT", nm: "유지보수 총괄", desc: "점검 운영 권한", sort: 3, useYn: "Y", regDt: "2026-01-10" },
    { id: "C004004", grpId: "GRP004", cd: "USR", nm: "사용자", desc: "점검 수행 권한", sort: 4, useYn: "Y", regDt: "2026-01-10" },
  ],
};

export const mockCommonCodes: CommonCode[] = Object.values(commonCodeMap).flat();
export const mockVerificationCodes = VC;

export const mockSystemInfo: SystemInfo[] = [
  { k: "java.vendor", v: "Oracle Corporation" },
  { k: "com.sun.xml.rpc.streaming.XMLReaderFactory", v: "jeus.webservices.jaxrpc.streaming.XMLReaderFactoryImpl" },
  { k: "sun.java.launcher", v: "SUN_STANDARD" },
  { k: "sun.management.compiler", v: "HotSpot 64-Bit Tiered Compilers" },
  { k: "os.name", v: "Windows Server 2019" },
  { k: "sun.boot.class.path", v: "C:\\TmaxSoft\\JEUS8\\lib\\system\\extension.jar;C:\\TmaxSoft\\JEUS8\\lib\\endorsed\\activation-1.1.1.jar;..." },
  { k: "java.util.logging.config.file", v: "C:\\TmaxSoft\\JEUS8\\bin\\logging.properties" },
  { k: "sun.desktop", v: "windows" },
  { k: "java.vm.specification.vendor", v: "Oracle Corporation" },
  { k: "java.runtime.version", v: "1.8.0_291-b10" },
  { k: "com.sun.xml.ws.tx.txnMgrJndiName", v: "java:wsit/TransactionManager" },
  { k: "user.name", v: "AYF-WAS$" },
  { k: "org.apache.jasper.Constants.TAG_FILE_PACKAGE_NAME", v: "jeus_tagwork" },
  { k: "user.language", v: "ko" },
  { k: "java.vm.name", v: "Java HotSpot(TM) 64-Bit Server VM" },
  { k: "java.version", v: "1.8.0_291" },
  { k: "sun.os.patch.level", v: "" },
  { k: "java.vm.vendor", v: "Oracle Corporation" },
  { k: "file.encoding", v: "MS949" },
  { k: "java.specification.version", v: "1.8" },
  { k: "os.arch", v: "amd64" },
  { k: "os.version", v: "10.0" },
  { k: "user.dir", v: "C:\\TmaxSoft\\JEUS8" },
  { k: "java.home", v: "C:\\TmaxSoft\\JDK\\jdk1.8\\jre" },
  { k: "java.class.version", v: "52.0" },
];

export const mockLicenses: License[] = [
  { id: "LIC001", code: "CS-STD-2025-XXXX", planId: "PLAN_STD", planNm: "Standard", type: "Standard", startDt: "2025-03-01", endDt: "2026-02-28", cycle: "연간", autoRenew: true, status: "만료 예정", regDt: "2025-03-01" },
  { id: "LIC002", code: "CS-BASIC-2024-YYYY", planId: "PLAN_BASIC", planNm: "Basic", type: "Basic", startDt: "2024-03-01", endDt: "2025-02-28", cycle: "연간", autoRenew: false, status: "만료", regDt: "2024-03-01" },
];
