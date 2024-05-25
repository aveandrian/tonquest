"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

export function UserVolumeTable() {
  return (
    <Table
      aria-label="Volume in projects table"
      isStriped
      classNames={{
        base: "text-blue",
        wrapper: "bg-peachYellow",
        tr: "data-[odd='true']:bg-lightOrange",
        th: "bg-lightOrange text-blue",
      }}
    >
      <TableHeader>
        <TableColumn>Project</TableColumn>
        <TableColumn>Volume</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key="1">
          <TableCell>StonFi</TableCell>
          <TableCell>$1900</TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell>GetGems</TableCell>
          <TableCell>$1900</TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell>Fragment</TableCell>
          <TableCell>$1900</TableCell>
        </TableRow>
        <TableRow key="4">
          <TableCell>DeDust</TableCell>
          <TableCell>$1900</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
