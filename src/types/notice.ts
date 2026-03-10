export interface Notice extends Record<string, unknown> {
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
