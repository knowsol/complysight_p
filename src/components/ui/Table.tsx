'use client';

import { DataTable } from './DataTable';
import type { DataTableColumn, DataTableProps } from './DataTable';
import { Pagination } from './Pagination';
import type { PaginationProps } from './Pagination';

export type TableColumn<T extends Record<string, unknown>> = DataTableColumn<T>;
export type TblProps<T extends Record<string, unknown>> = DataTableProps<T>;
export type GuiPagProps = PaginationProps;

export { DataTable, Pagination };

export const Tbl = DataTable;
export const GuiPag = Pagination;
