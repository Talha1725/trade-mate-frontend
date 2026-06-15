"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table"
import { useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DataTableProps } from "@/types"

export function DataTable<TData, TValue>({
  columns,
  data,
  serverPagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const fallbackPageSize = serverPagination?.pageSize ?? (data.length || 1)
  const totalItems = serverPagination?.totalItems ?? data.length * (serverPagination?.pageCount || 1)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    state: { sorting },
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {serverPagination && (
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <p>
              Showing{" "}
              {totalItems === 0
                ? 0
                : (serverPagination.page - 1) * fallbackPageSize + 1}
              -
              {totalItems === 0
                ? 0
                : Math.min(
                    totalItems,
                    serverPagination.page * fallbackPageSize,
                  )}{" "}
              of {totalItems}
            </p>

            {serverPagination.onPageSizeChange && serverPagination.pageSize ? (
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <Select
                  value={String(serverPagination.pageSize)}
                  onValueChange={(value) => serverPagination.onPageSizeChange?.(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[88px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(serverPagination.pageSizeOptions ?? [10, 25, 50]).map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => serverPagination.onPageChange(serverPagination.page - 1)}
              disabled={serverPagination.page <= 1}
            >
              Previous
            </Button>
            <p className="text-sm text-muted-foreground">
              Page {serverPagination.page} of {serverPagination.pageCount || 1}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => serverPagination.onPageChange(serverPagination.page + 1)}
              disabled={serverPagination.page >= (serverPagination.pageCount || 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
