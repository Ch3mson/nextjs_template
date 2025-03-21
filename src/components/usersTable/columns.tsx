"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { DeleteUserDialog } from "./delete-user-dialog"
import { EditUserDialog } from "./edit-user-dialog"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: number
  name: string
  age: number
  email: string
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      
      return (
        <div className="flex items-center gap-2">
          <EditUserDialog user={user}>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </EditUserDialog>
          
          <DeleteUserDialog userId={user.id} userName={user.name}>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Delete</span>
            </Button>
          </DeleteUserDialog>
        </div>
      )
    },
  },
]
