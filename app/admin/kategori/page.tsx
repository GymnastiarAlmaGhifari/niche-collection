"use client";
import { useState, useEffect } from "react";
import { getCategories } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, GripVertical, Edit, Trash2, Check, X } from "lucide-react";
import { addCategoryAction, editCategoryAction, deleteCategoryAction, addSubCategoryAction, deleteSubCategoryAction } from "@/actions/category";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Category } from "@/types/catalog";

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // State for adding new category
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("Package");
  const [addingCat, setAddingCat] = useState(false);

  // State for editing category
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatIcon, setEditCatIcon] = useState("");

  // State for adding sub-category
  const [addingSubTo, setAddingSubTo] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState("");

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setAddingCat(true);
    const res = await addCategoryAction(newCatName, newCatIcon);
    setAddingCat(false);
    if (res.success) {
      toast.success("Kategori ditambahkan!");
      setNewCatName("");
      setNewCatIcon("Package");
      setShowAddForm(false);
      getCategories().then(setCategories);
    } else {
      toast.error("Gagal menambah kategori", { description: res.error });
    }
  };

  const handleEditCategory = async (id: string) => {
    if (!editCatName.trim()) return;
    const res = await editCategoryAction(id, editCatName, editCatIcon);
    if (res.success) {
      toast.success("Kategori diperbarui!");
      setEditingCatId(null);
      getCategories().then(setCategories);
    } else {
      toast.error("Gagal mengedit kategori", { description: res.error });
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"? Sub-kategori di dalamnya juga akan terhapus.`)) return;
    const res = await deleteCategoryAction(id);
    if (res.success) {
      toast.success("Kategori dihapus!");
      setCategories(categories.filter(c => c.id !== id));
    } else {
      toast.error("Gagal menghapus", { description: res.error });
    }
  };

  const handleAddSubCategory = async (categoryId: string) => {
    if (!newSubName.trim()) return;
    const res = await addSubCategoryAction(categoryId, newSubName);
    if (res.success) {
      toast.success("Sub-kategori ditambahkan!");
      setNewSubName("");
      setAddingSubTo(null);
      getCategories().then(setCategories);
    } else {
      toast.error("Gagal menambah sub-kategori", { description: res.error });
    }
  };

  const handleDeleteSubCategory = async (categoryId: string, subId: string, subName: string) => {
    if (!confirm(`Hapus sub-kategori "${subName}"?`)) return;
    const res = await deleteSubCategoryAction(categoryId, subId);
    if (res.success) {
      toast.success("Sub-kategori dihapus!");
      getCategories().then(setCategories);
    } else {
      toast.error("Gagal menghapus", { description: res.error });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategori</h1>
          <p className="text-muted-foreground mt-1">Kelola kategori dan sub-kategori produk.</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-primary/50">
          <CardContent className="pt-6">
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Nama Kategori</label>
                <Input placeholder="Contoh: Elektronik" value={newCatName} onChange={e => setNewCatName(e.target.value)} autoFocus />
              </div>
              <div className="w-32 space-y-2">
                <label className="text-sm font-medium">Ikon</label>
                <Input placeholder="Package" value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} />
              </div>
              <Button onClick={handleAddCategory} disabled={addingCat}>
                <Check className="mr-2 h-4 w-4" /> {addingCat ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardHeader className="flex flex-row items-center gap-4 p-4 pb-0 bg-muted/30">
              <div className="cursor-grab text-muted-foreground hover:text-foreground">
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="flex-1">
                {editingCatId === cat.id ? (
                  <div className="flex gap-2 items-center">
                    <Input value={editCatName} onChange={e => setEditCatName(e.target.value)} className="max-w-xs" />
                    <Input value={editCatIcon} onChange={e => setEditCatIcon(e.target.value)} className="w-24" placeholder="Icon" />
                    <Button size="sm" onClick={() => handleEditCategory(cat.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingCatId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <CardTitle className="text-lg flex items-center gap-2">
                    {cat.name}
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {cat.subCategories?.length || 0} Sub-kategori
                    </span>
                  </CardTitle>
                )}
              </div>
              {editingCatId !== cat.id && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => {
                      setEditingCatId(cat.id);
                      setEditCatName(cat.name);
                      setEditCatIcon(cat.icon);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4 pl-12">
              <div className="space-y-2">
                {cat.subCategories?.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 border border-transparent hover:border-border">
                    <div className="cursor-grab text-muted-foreground/50 hover:text-foreground">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-sm">{sub.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteSubCategory(cat.id, sub.id, sub.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {addingSubTo === cat.id ? (
                  <div className="flex gap-2 items-center mt-2">
                    <Input
                      placeholder="Nama sub-kategori"
                      value={newSubName}
                      onChange={e => setNewSubName(e.target.value)}
                      className="max-w-xs"
                      autoFocus
                    />
                    <Button size="sm" onClick={() => handleAddSubCategory(cat.id)}>
                      <Check className="mr-1 h-3 w-3" /> Simpan
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setAddingSubTo(null); setNewSubName(""); }}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-primary text-xs"
                    onClick={() => { setAddingSubTo(cat.id); setNewSubName(""); }}
                  >
                    <Plus className="mr-2 h-3 w-3" /> Tambah Sub-kategori
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
