'use client';

import { PanelLeftClose } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Icon } from '@/components/ui/Icon';
import { MENU_ITEMS } from '@/lib/constants/menu';
import { ROUTES } from '@/lib/constants/routes';
import { C } from '@/lib/theme/colors';
import type { MenuGroup, MenuItem, MenuLeaf, SiteType } from '@/types/menu';

interface SidebarProps {
  menuItems: MenuItem[];
  site: SiteType;
  collapsed: boolean;
  onToggle: () => void;
  bannerH?: number;
}

const resolveRoutePath = (routeKey: string): string => {
  if (routeKey in ROUTES) {
    return ROUTES[routeKey as keyof typeof ROUTES];
  }
  return ROUTES.login;
};

const getActiveRouteKey = (pathname: string): string | null => {
  const found = Object.entries(ROUTES).find(([, path]) => path === pathname);
  return found ? found[0] : null;
};

const isMenuGroup = (menu: MenuLeaf | MenuGroup): menu is MenuGroup => 'group' in menu && menu.group;

const collectLeafRouteKeys = (items: Array<MenuLeaf | MenuGroup> = []): string[] => {
  const keys: string[] = [];
  for (const item of items) {
    if (isMenuGroup(item)) {
      keys.push(...item.c.map((leaf) => leaf.routeKey));
    } else {
      keys.push(item.routeKey);
    }
  }
  return keys;
};

export default function Sidebar({ menuItems, site, collapsed, onToggle, bannerH = 0 }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeRouteKey = getActiveRouteKey(pathname);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const menus = menuItems.length > 0 ? menuItems : MENU_ITEMS[site];

  const findActiveFirstDepth = (): string | null => {
    for (const menu of menus) {
      if (menu.routeKey && menu.routeKey === activeRouteKey) {
        return menu.k;
      }
      if (menu.c) {
        const allLeafs = collectLeafRouteKeys(menu.c);
        if (activeRouteKey && allLeafs.includes(activeRouteKey)) {
          return menu.k;
        }
      }
    }
    return null;
  };

  const activeFirstDepth = findActiveFirstDepth();

  const findActiveGroup = (menu: MenuItem | undefined): string | null => {
    if (!menu?.c) {
      return null;
    }
    for (const child of menu.c) {
      if (isMenuGroup(child) && activeRouteKey && child.c.some((leaf) => leaf.routeKey === activeRouteKey)) {
        return child.k;
      }
    }
    return null;
  };

  const navigateToRoute = (routeKey: string) => {
    router.push(resolveRoutePath(routeKey));
  };

  const firstLeafRouteKey = (items: Array<MenuLeaf | MenuGroup>): string | null => {
    for (const item of items) {
      if (isMenuGroup(item)) {
        if (item.c[0]?.routeKey) {
          return item.c[0].routeKey;
        }
      } else {
        return item.routeKey;
      }
    }
    return null;
  };

  const handleFirstDepthClick = (menu: MenuItem) => {
    if (menu.c) {
      setSelectedMenu(menu.k);
      const leafRouteKey = firstLeafRouteKey(menu.c);
      if (leafRouteKey) {
        navigateToRoute(leafRouteKey);
      }
      return;
    }
    if (menu.routeKey) {
      navigateToRoute(menu.routeKey);
      setSelectedMenu(null);
    }
  };

  const toggleGroup = (groupKey: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const shown = selectedMenu || activeFirstDepth;
  const shownMenu = menus.find((menu) => menu.k === shown);
  const depth2 = shownMenu?.c ?? [];
  const showDepth2 = !collapsed && depth2.length > 0;
  const hasGroupedItems = depth2.some((item) => isMenuGroup(item));
  const activeGroup = findActiveGroup(shownMenu);

  const isGroupOpen = (groupKey: string): boolean => {
    if (groupKey in openGroups) {
      return openGroups[groupKey];
    }
    return true;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexShrink: 0,
        height: `calc(100vh - ${67 + bannerH}px)`,
        position: 'sticky',
        top: 67 + bannerH,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, width: 64, background: C.bg, position: 'relative' }}>
        <div
          style={{
            flex: 1,
            width: 64,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 0',
            gap: 4,
            borderRadius: '0 24px 0 0',
            background: C.brand,
          }}
        >
          {menus.map((menu) => {
            const isActive = menu.k === activeFirstDepth;
            const isOpen = shown === menu.k;
            return (
              <div
                key={menu.k}
                onClick={() => handleFirstDepthClick(menu)}
                style={{
                  width: 56,
                  padding: '6px 0',
                  borderRadius: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  transition: 'all .3s',
                  background: isOpen ? 'rgba(17,17,17,0.3)' : isActive ? 'rgba(17,17,17,0.2)' : 'transparent',
                }}
                onMouseEnter={(event) => {
                  if (!isActive && !isOpen) {
                    event.currentTarget.style.background = 'rgba(17,17,17,0.2)';
                  }
                }}
                onMouseLeave={(event) => {
                  if (!isActive && !isOpen) {
                    event.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon n={menu.i ?? 'info'} s={18} c={isActive || isOpen ? '#fff' : 'rgba(255,255,255,0.55)'} />
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 500,
                    color: isActive || isOpen ? '#fff' : 'rgba(255,255,255,0.55)',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.3px',
                  }}
                >
                  {menu.l}
                </span>
              </div>
            );
          })}
        </div>
        {/* <button
          onClick={onToggle}
          style={{
            height: 44,
            border: 'none',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.9)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={collapsed ? '사이드바 열기' : '사이드바 닫기'}
        >
          <PanelLeftClose size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }} />
        </button> */}
      </div>

      <div
        style={{
          width: showDepth2 ? 190 : 0,
          background: C.bg,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'width .25s ease',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 190,
            opacity: showDepth2 ? 1 : 0,
            transition: 'opacity .2s ease .05s',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
            {!hasGroupedItems &&
              depth2.map((item) => {
                if (isMenuGroup(item)) {
                  return null;
                }
                const isActive = activeRouteKey === item.routeKey;
                return (
                  <div
                    key={item.k}
                    onClick={() => navigateToRoute(item.routeKey)}
                    style={{
                      padding: '4px 8px',
                      cursor: 'pointer',
                      marginBottom: 4,
                      borderRadius: 4,
                      fontSize: 15,
                      fontWeight: 500,
                      background: isActive ? C.priL : '',
                      color: isActive ? C.sec : C.txt,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      minHeight: 36,
                      transition: 'all .3s',
                    }}
                    onMouseEnter={(event) => {
                      if (!isActive) {
                        event.currentTarget.style.background = C.priL;
                      }
                    }}
                    onMouseLeave={(event) => {
                      if (!isActive) {
                        event.currentTarget.style.background = '';
                      }
                    }}
                  >
                    <span style={{ color: '#BBBBBB', fontSize: 12, marginRight: 2 }}>└</span>
                    {item.l}
                  </div>
                );
              })}

            {hasGroupedItems &&
              depth2.map((group) => {
                if (!isMenuGroup(group)) {
                  return null;
                }

                const open = isGroupOpen(group.k);
                const hasActive = activeRouteKey ? group.c.some((leaf) => leaf.routeKey === activeRouteKey) : false;
                const isSingle = group.c.length === 1;

                return (
                  <div key={group.k}>
                    <div
                      onClick={() => {
                        if (isSingle) {
                          navigateToRoute(group.c[0].routeKey);
                        } else {
                          toggleGroup(group.k);
                        }
                      }}
                      style={{
                        padding: '4px 8px',
                        cursor: 'pointer',
                        borderRadius: 4,
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 15,
                        fontWeight: 500,
                        minHeight: 36,
                        color: hasActive || (isSingle && activeRouteKey === group.c[0].routeKey) ? C.sec : C.txt,
                        background: isSingle && activeRouteKey === group.c[0].routeKey ? C.priL : '',
                        transition: 'all .3s',
                        userSelect: 'none',
                      }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.background = C.priL;
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background =
                          isSingle && activeRouteKey === group.c[0].routeKey ? C.priL : '';
                      }}
                    >
                      <span>{group.l}</span>
                      {!isSingle && (
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20,
                            transition: 'all .3s',
                            transform: open ? 'rotate(90deg)' : 'none',
                          }}
                        >
                          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                            <path
                              d="M1.5 1l5 5-5 5"
                              stroke={hasActive || activeGroup === group.k ? C.sec : '#333'}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </div>

                    {!isSingle &&
                      open &&
                      group.c.map((leaf) => {
                        const isActive = activeRouteKey === leaf.routeKey;
                        return (
                          <div
                            key={leaf.k}
                            onClick={() => navigateToRoute(leaf.routeKey)}
                            style={{
                              padding: '4px 8px 4px 20px',
                              cursor: 'pointer',
                              borderRadius: 4,
                              marginBottom: 4,
                              fontSize: 15,
                              fontWeight: isActive ? 500 : 400,
                              minHeight: 36,
                              background: isActive ? C.priL : '',
                              color: isActive ? C.sec : C.txS,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              transition: 'all .3s',
                            }}
                            onMouseEnter={(event) => {
                              if (!isActive) {
                                event.currentTarget.style.background = C.priL;
                              }
                            }}
                            onMouseLeave={(event) => {
                              if (!isActive) {
                                event.currentTarget.style.background = '';
                              }
                            }}
                          >
                            <span style={{ color: '#BBBBBB', fontSize: 12, marginRight: 2 }}>└</span>
                            {leaf.l}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
          </nav>
        </div>
      </div>
    </div>
  );
}
