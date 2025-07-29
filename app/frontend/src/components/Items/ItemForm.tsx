"use client";

import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  validateItemName,
  validateItemDescription,
  validateItemQuantity,
  validateItemPrice,
} from "@/utils/validators";

interface Item {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

interface ItemFormProps {
  initialData?: Item | null;
  onSave: (item: Omit<Item, "_id">) => void;
}

export default function ItemForm({ initialData, onSave }: ItemFormProps) {
  const [name, setName] = useState<string>(initialData?.name || "");
  const [description, setDescription] = useState<string>(
    initialData?.description || ""
  );
  const [quantity, setQuantity] = useState<string>(
    initialData?.quantity?.toString() || ""
  );
  const [price, setPrice] = useState<string>(
    initialData?.price?.toString() || ""
  );

  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [quantityError, setQuantityError] = useState<string>("");
  const [priceError, setPriceError] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setQuantity(initialData.quantity.toString());
      setPrice(initialData.price.toString());
    } else {
      setName("");
      setDescription("");
      setQuantity("");
      setPrice("");
    }
    setNameError("");
    setDescriptionError("");
    setQuantityError("");
    setPriceError("");
  }, [initialData]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNameError("");
    setDescriptionError("");
    setQuantityError("");
    setPriceError("");

    const nameError = validateItemName(name);
    const descriptionError = validateItemDescription(description);
    const quantityError = validateItemQuantity(Number(quantity));
    const priceError = validateItemPrice(Number(price));

    if (nameError) {
      setNameError(nameError);
      return;
    }
    if (descriptionError) {
      setDescriptionError(descriptionError);
      return;
    }
    if (quantityError) {
      setQuantityError(quantityError);
      return;
    }
    if (priceError) {
      setPriceError(priceError);
      return;
    }

    onSave({
      name,
      description,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price),
    });
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="name">Item Name</Label>
        <Input
          id="name"
          value={name}
          onChange={handleChange(setName)}
          placeholder="Enter item name"
        />
        {nameError && <p className="text-sm text-red-500">{nameError}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={handleChange(setDescription)}
          placeholder="Enter item description"
        />
        {descriptionError && (
          <p className="text-sm text-red-500">{descriptionError}</p>
        )}
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={handleChange(setQuantity)}
          placeholder="Enter quantity"
        />
        {quantityError && (
          <p className="text-sm text-red-500">{quantityError}</p>
        )}
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={handleChange(setPrice)}
          placeholder="Enter price"
        />
        {priceError && <p className="text-sm text-red-500">{priceError}</p>}
      </div>
      <Button type="submit" className="w-full">
        {initialData ? "Update Item" : "Add Item"}
      </Button>
    </form>
  );
}
