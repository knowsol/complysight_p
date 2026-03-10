import { NT } from "@/data/notices";
import type { Board, Notice } from "@/types/board";

export const mockNotices: Notice[] = NT;

export const mockBoards: Board[] = NT.map((notice) => ({
  id: notice.id,
  title: notice.title,
  views: notice.views,
  user: notice.user,
  dt: notice.dt,
  file: notice.file,
  content: notice.content,
}));
