"use client";
import { useState } from "react";
import { getCategories } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Edit, Trash2 } from "lucide-react";

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState(getCategories());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategori</h1>
          <p className="text-muted-foreground mt-1">Kelola kategori dan sub-kategori produk.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
        </Button>
      </div>

      <div className="space-y-4">
        {categories.map((cat, i) => (
          <Card key={cat.id}>
            <CardHeader className="flex flex-row items-center gap-4 p-4 pb-0 bg-muted/30">
              <div className="cursor-grab text-muted-foreground hover:text-foreground">
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {cat.name} 
                  <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{cat.subCategories.length} Sub-kategori</span>
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pl-12">
              <div className="space-y-2">
                {cat.subCategories.map((sub, j) => (
                  <div key={sub.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 border border-transparent hover:border-border">
                    <div className="cursor-grab text-muted-foreground/50 hover:text-foreground">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-sm">{sub.name}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="mt-2 text-primary text-xs">
                  <Plus className="mr-2 h-3 w-3" /> Tambah Sub-kategori
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
