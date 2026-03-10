'use client';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Ic } from '@/components/ui/Icon';
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
    <Box
      sx={{
        display: 'flex',
        flexShrink: 0,
        height: `calc(100vh - ${67 + bannerH}px)`,
        position: 'sticky',
        top: 67 + bannerH,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flexShrink: 0, width: 64, bgcolor: C.bg, position: 'relative' }}>
        <Paper
          square
          elevation={0}
          sx={{
            flex: 1,
            width: 64,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 2,
            gap: 0.5,
            borderRadius: '0 24px 0 0',
            bgcolor: C.brand,
          }}
        >
          {menus.map((menu) => {
            const isActive = menu.k === activeFirstDepth;
            const isOpen = shown === menu.k;
            return (
              <ListItemButton
                key={menu.k}
                onClick={() => handleFirstDepthClick(menu)}
                sx={{
                  width: 56,
                  py: 0.75,
                  borderRadius: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  bgcolor: isOpen ? 'rgba(17,17,17,0.3)' : isActive ? 'rgba(17,17,17,0.2)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(17,17,17,0.2)' },
                }}
              >
                <Ic n={menu.i ?? 'info'} s={18} c={isActive || isOpen ? '#fff' : 'rgba(255,255,255,0.55)'} />
                <Typography
                  component="span"
                  sx={{
                    fontSize: 9,
                    fontWeight: 500,
                    color: isActive || isOpen ? '#fff' : 'rgba(255,255,255,0.55)',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.3px',
                  }}
                >
                  {menu.l}
                </Typography>
              </ListItemButton>
            );
          })}
        </Paper>
      </Box>

      <Box
        sx={{
          width: showDepth2 ? 190 : 0,
          bgcolor: C.bg,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'width .25s ease',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 190,
            opacity: showDepth2 ? 1 : 0,
            transition: 'opacity .2s ease .05s',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <List sx={{ flex: 1, px: 1.25, py: 1.5, overflowY: 'auto' }}>
            {!hasGroupedItems &&
              depth2.map((item) => {
                if (isMenuGroup(item)) {
                  return null;
                }
                const isActive = activeRouteKey === item.routeKey;
                return (
                  <ListItemButton
                    key={item.k}
                    onClick={() => navigateToRoute(item.routeKey)}
                    sx={{
                      px: 1,
                      py: 0.5,
                      mb: 0.5,
                      borderRadius: 1,
                      fontSize: 15,
                      fontWeight: 500,
                      bgcolor: isActive ? C.priL : 'transparent',
                      color: isActive ? C.sec : C.txt,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      minHeight: 36,
                      '&:hover': { bgcolor: C.priL },
                    }}
                  >
                    <Box component="span" sx={{ color: '#BBBBBB', fontSize: 12, mr: 0.25 }}>└</Box>
                    {item.l}
                  </ListItemButton>
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
                  <Box key={group.k}>
                    <ListItemButton
                      onClick={() => {
                        if (isSingle) {
                          navigateToRoute(group.c[0].routeKey);
                        } else {
                          toggleGroup(group.k);
                        }
                      }}
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        mb: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 15,
                        fontWeight: 500,
                        minHeight: 36,
                        color: hasActive || (isSingle && activeRouteKey === group.c[0].routeKey) ? C.sec : C.txt,
                        bgcolor: isSingle && activeRouteKey === group.c[0].routeKey ? C.priL : 'transparent',
                        userSelect: 'none',
                        '&:hover': { bgcolor: C.priL },
                      }}
                    >
                      <Typography component="span" sx={{ fontSize: 15, fontWeight: 500 }}>
                        {group.l}
                      </Typography>
                      {!isSingle && (
                        <Box
                          component="span"
                          sx={{
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
                        </Box>
                      )}
                    </ListItemButton>

                    {!isSingle && (
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        {group.c.map((leaf) => {
                          const isActive = activeRouteKey === leaf.routeKey;
                          return (
                            <ListItemButton
                              key={leaf.k}
                              onClick={() => navigateToRoute(leaf.routeKey)}
                              sx={{
                                pl: 2.5,
                                pr: 1,
                                py: 0.5,
                                borderRadius: 1,
                                mb: 0.5,
                                fontSize: 15,
                                fontWeight: isActive ? 500 : 400,
                                minHeight: 36,
                                bgcolor: isActive ? C.priL : 'transparent',
                                color: isActive ? C.sec : C.txS,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                '&:hover': { bgcolor: C.priL },
                              }}
                            >
                              <Box component="span" sx={{ color: '#BBBBBB', fontSize: 12, mr: 0.25 }}>└</Box>
                              {leaf.l}
                            </ListItemButton>
                          );
                        })}
                      </Collapse>
                    )}
                  </Box>
                );
              })}
          </List>
        </Box>
      </Box>
    </Box>
  );
}
