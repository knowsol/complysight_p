export type SiteType = "m" | "s";

export interface MenuLeaf {
  k: string;
  l: string;
  routeKey: string;
}

export interface MenuGroup {
  k: string;
  l: string;
  group: true;
  c: MenuLeaf[];
}

export interface MenuItem {
  k: string;
  l: string;
  i?: string;
  routeKey?: string;
  c?: Array<MenuLeaf | MenuGroup>;
}
