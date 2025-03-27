"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transaction = {
  entry_price: number
  quantity: number
  close_price: number
  pl: number
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "entry_price",
    header: "Entry Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "close_price",
    header: "Close Price"
  },
    {
        accessorKey: "pl",
        header: "Profit/Loss",
        cell: ({ getValue }) => {
            const value = getValue<number>();
            return value.toFixed(2); // Restrict to 2 decimal places
          },
    }
]
