import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api, resolveImg } from "@/lib/api";
import { CONTENT_CONFIG } from "./contentConfig";

const ImageInput = ({ value, onChange, label }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="Paste an image URL or upload →" />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} aria-label={`Upload ${label}`}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>
      {value && <img src={resolveImg(value)} alt="Preview" className="h-24 rounded-lg border border-border object-cover" />}
    </div>
  );
};

const ImagesInput = ({ value = [], onChange }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/admin/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onChange([...(value || []), data.url]);
      toast.success("Image added");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="Paste image URL and press Add" />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (urlInput.trim()) {
              onChange([...(value || []), urlInput.trim()]);
              setUrlInput("");
            }
          }}
        >
          Add
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} aria-label="Upload image to gallery">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>
      {(value || []).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((img, i) => (
            <div key={i} className="relative">
              <img src={resolveImg(img)} alt={`Gallery ${i + 1}`} className="h-16 w-16 rounded-lg border border-border object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                aria-label={`Remove image ${i + 1}`}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PairsInput = ({ value = [], onChange, pairLabels = ["Label", "Value"] }) => (
  <div className="space-y-2">
    {(value || []).map((pair, i) => (
      <div key={i} className="flex gap-2">
        <Input value={pair.label} placeholder={pairLabels[0]} onChange={(e) => onChange(value.map((p, idx) => (idx === i ? { ...p, label: e.target.value } : p)))} />
        <Input value={pair.value} placeholder={pairLabels[1]} onChange={(e) => onChange(value.map((p, idx) => (idx === i ? { ...p, value: e.target.value } : p)))} />
        <Button type="button" variant="ghost" size="icon" onClick={() => onChange(value.filter((_, idx) => idx !== i))} aria-label="Remove row">
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
    <Button type="button" variant="outline" size="sm" onClick={() => onChange([...(value || []), { label: "", value: "" }])}>
      <Plus className="mr-1 h-3.5 w-3.5" /> Add row
    </Button>
  </div>
);

const FieldInput = ({ field, value, onChange }) => {
  switch (field.type) {
    case "textarea":
      return <Textarea rows={field.rows || 4} required={field.required} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} data-testid={`admin-field-${field.name}`} />;
    case "number":
      return <Input type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} data-testid={`admin-field-${field.name}`} />;
    case "switch":
      return <Switch checked={Boolean(value)} onCheckedChange={onChange} data-testid={`admin-field-${field.name}`} aria-label={field.label} />;
    case "image":
      return <ImageInput value={value} onChange={onChange} label={field.label} />;
    case "images":
      return <ImagesInput value={value} onChange={onChange} />;
    case "pairs":
      return <PairsInput value={value} onChange={onChange} pairLabels={field.pairLabels} />;
    case "tags":
      return (
        <Input
          value={Array.isArray(value) ? value.join(", ") : value || ""}
          onChange={(e) => onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
          placeholder="tag1, tag2, tag3"
          data-testid={`admin-field-${field.name}`}
        />
      );
    default:
      return <Input required={field.required} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} data-testid={`admin-field-${field.name}`} />;
  }
};

export default function ContentManager({ ctype }) {
  const config = CONTENT_CONFIG[ctype];
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null); // null | {} (new) | item
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    api.get(`/admin/content/${ctype}`).then(({ data }) => setItems(data)).catch(() => setItems([]));
  };

  useEffect(load, [ctype]);

  const openNew = () => {
    setForm({ ...config.defaults });
    setEditing({});
  };

  const openEdit = (item) => {
    setForm({ ...item });
    setEditing(item);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing?.id) {
        await api.put(`/admin/content/${ctype}/${editing.id}`, form);
        toast.success("Saved - changes are live on the website");
      } else {
        await api.post(`/admin/content/${ctype}`, form);
        toast.success("Created - now live on the website");
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not save. Please check the fields.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/admin/content/${ctype}/${deleting.id}`);
      toast.success("Deleted");
      setDeleting(null);
      load();
    } catch {
      toast.error("Could not delete");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">{config.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
        </div>
        <Button onClick={openNew} className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" data-testid="admin-add-item-button">
          <Plus className="mr-1 h-4 w-4" /> Add new
        </Button>
      </div>

      <div className="card-soft mt-6 overflow-hidden rounded-2xl">
        {items === null ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {config.columns.map((c) => (
                  <TableHead key={c.key}>{c.label}</TableHead>
                ))}
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} data-testid="admin-content-row">
                  {config.columns.map((c) => (
                    <TableCell key={c.key} className="max-w-[280px] truncate">
                      {c.render ? c.render(item[c.key]) : String(item[c.key] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)} aria-label={`Edit ${config.itemLabel(item)}`} data-testid="admin-edit-item-button">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleting(item)} aria-label={`Delete ${config.itemLabel(item)}`} data-testid="admin-delete-item-button">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={config.columns.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                    Nothing here yet. Click "Add new" to create the first entry.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-primary">
              {editing?.id ? `Edit: ${config.itemLabel(editing)}` : `New ${config.title.replace(/s$/, "")}`}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4" data-testid="admin-content-form">
            {config.fields.map((field) => (
              <div key={field.name} className={field.type === "switch" ? "flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3" : "space-y-1.5"}>
                <Label>{field.label}{field.required ? " *" : ""}</Label>
                <FieldInput field={field} value={form[field.name]} onChange={(v) => setForm((f) => ({ ...f, [field.name]: v }))} />
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" data-testid="admin-save-item-button">
                {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>) : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleting ? config.itemLabel(deleting) : ""}" will be removed from the website immediately. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-white hover:bg-destructive/90" data-testid="admin-confirm-delete-button">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
