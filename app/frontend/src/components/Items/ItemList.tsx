"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit } from "lucide-react"

interface Item {
  _id: string
  name: string
  description: string
  quantity: number
  price: number
}

interface ItemListProps {
  items: Item[]
  onEdit: (item: Item) => void
  onDelete: (item: Item) => void
}

export default function ItemList({ items, onEdit, onDelete }: ItemListProps) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item._id} className="flex items-center justify-between p-4">
          <CardContent className="p-0">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
            <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
            <p className="text-sm text-gray-700">Price: ${item.price.toFixed(2)}</p>
          </CardContent>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="destructive" size="icon" onClick={() => onDelete(item)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
