export interface Notice {
  id: number;
  title: string;
  views: number;
  user: string;
  dt: string;
  scope: string;
  file?: string;
  content: string;
  banner?: "Y" | "N";
}

export interface Board {
  id: number;
  title: string;
  views: number;
  user: string;
  dt: string;
  file?: string;
  content?: string;
}
