"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { logout, getCurrentUser } from "@/lib/services/auth-service";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "@/lib/services/item-service";
import ItemList from "@/components/Items/ItemList";
import ItemForm from "@/components/Items/ItemForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Item {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
    } else {
      fetchItems();
    }
  }, [router]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      toast({
        title: "Error fetching items",
        // description: (error as Error).toString(),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
    toast({
      title: "Logged out",
      // description: "You have been successfully logged out.",
    });
  };

  const handleSaveItem = async (itemData: Omit<Item, "_id">) => {
    try {
      if (editingItem) {
        await updateItem(editingItem._id, itemData);
        toast({
          title: "Success",
          // description: "Item updated successfully!",
        });
      } else {
        await createItem(itemData);
        toast({
          title: "Success",
          // description: "Item created successfully!",
        });
      }
      setIsFormOpen(false);
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      toast({
        title: "Error",
        // description: (error as Error).toString(),
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async () => {
    if (deletingItem) {
      try {
        await deleteItem(deletingItem._id);
        toast({
          title: "Success",
          // description: "Item deleted successfully!",
        });
        fetchItems();
        setDeletingItem(null);
      } catch (error) {
        toast({
          title: "Error",
          // description: (error as Error).toString(),
          variant: "destructive",
        });
      }
    }
  };

  const openEditForm = (item: Item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const openDeleteConfirm = (item: Item) => {
    setDeletingItem(item);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
          <div className="flex space-x-2">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingItem(null)}>
                  Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Item" : "Add New Item"}
                  </DialogTitle>
                </DialogHeader>
                <ItemForm initialData={editingItem} onSave={handleSaveItem} />
              </DialogContent>
            </Dialog>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading items...</p>
          ) : items.length === 0 ? (
            <p>No items found. Add a new item to get started!</p>
          ) : (
            <ItemList
              items={items}
              onEdit={openEditForm}
              onDelete={openDeleteConfirm}
            />
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item <span className="font-semibold">{deletingItem?.name}</span>{" "}
              from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
