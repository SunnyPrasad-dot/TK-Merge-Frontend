import { useState } from "react";
import { useCreateService, useDeleteService, useGetPackages } from "@admin/services/api";
import { useSettings } from "@admin/services/SettingsContext";
import { formatCurrency } from "@shared/utils/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@admin/components/ui/table";
import { Skeleton } from "@admin/components/ui/skeleton";
import { useToast } from "@shared/hooks/use-toast";
import { Plus, Search, Trash2 } from "lucide-react";

function ServiceRow({ item, onDelete, columns }) {
  const { settings } = useSettings();

  return (
    <TableRow>
      {columns.map((col) => (
        <TableCell key={col.key}>
          {col.type === "number" ? formatCurrency(item[col.key], settings.currency) : item[col.key] || "-"}
        </TableCell>
      ))}
      <TableCell className="text-right">
        <Button size="icon" variant="ghost" onClick={() => onDelete(item.id)} className="h-8 w-8 text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function Prices() {
  const { data: apiServices = [], isLoading } = useGetPackages();
  const createService = useCreateService();
  const deleteService = useDeleteService();
  const { toast } = useToast();
  const { settings } = useSettings();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceTypeFilter, setPriceTypeFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [newService, setNewService] = useState({ name: "", type: "addon", priceType: "per_day", role: "", price: "" });

  const allServices = apiServices;
  const services = allServices.filter((service) => {
    const query = search.trim().toLowerCase();
    const matchSearch = !query ||
      service.name?.toLowerCase().includes(query) ||
      service.type?.toLowerCase().includes(query) ||
      service.priceType?.toLowerCase().includes(query) ||
      service.role?.toLowerCase().includes(query);
    const matchType = typeFilter === "all" || service.type === typeFilter;
    const matchPriceType = priceTypeFilter === "all" || service.priceType === priceTypeFilter;
    return matchSearch && matchType && matchPriceType;
  }).sort((a, b) => {
    if (sort === "price_high") return (b.price || 0) - (a.price || 0);
    if (sort === "price_low") return (a.price || 0) - (b.price || 0);
    if (sort === "type") return (a.type || "").localeCompare(b.type || "");
    return (a.name || "").localeCompare(b.name || "");
  });

  const handleAddNew = (e) => {
    e.preventDefault();
    const payload = {
      name: newService.name,
      type: newService.type,
      priceType: newService.priceType,
      price: Number(newService.price),
      ...(newService.type === "shoot" && newService.role ? { role: newService.role } : {}),
    };
    createService.mutate(payload, {
      onSuccess: () => {
        setNewService({ name: "", type: "addon", priceType: "per_day", role: "", price: "" });
        toast({ title: "Service Created", description: "The service has been added." });
      },
      onError: (err) => toast({ title: "Create failed", description: err.message }),
    });
  };

  const handleDeleteService = (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    deleteService.mutate(id, {
      onSuccess: () => toast({ title: "Service Deleted", description: "The service has been removed." }),
      onError: (err) => toast({ title: "Delete failed", description: err.message }),
    });
  };

  const serviceColumns = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "priceType", label: "Price Type" },
    { key: "price", label: "Price", type: "number" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{allServices.length} total services</p>
        </div>
      </div>

      <form onSubmit={handleAddNew} className="grid grid-cols-1 gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_auto]">
        <Input value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} placeholder="500gb hard-drive" required />
        <select value={newService.type} onChange={(e) => setNewService({ ...newService, type: e.target.value })} className="h-10 rounded-xl border border-border bg-card px-3 text-sm">
          <option value="addon">Addon</option>
          <option value="shoot">Shoot</option>
        </select>
        <select value={newService.priceType} onChange={(e) => setNewService({ ...newService, priceType: e.target.value })} className="h-10 rounded-xl border border-border bg-card px-3 text-sm">
          <option value="per_day">Per day</option>
          <option value="fixed">Fixed</option>
          <option value="per_unit">Per unit</option>
        </select>
        <select value={newService.role} onChange={(e) => setNewService({ ...newService, role: e.target.value })} className="h-10 rounded-xl border border-border bg-card px-3 text-sm">
          <option value="">No role</option>
          <option value="traditional_photographer">Traditional Photographer</option>
          <option value="traditional_videographer">Traditional Videographer</option>
          <option value="candid_photographer">Candid Photographer</option>
          <option value="cinematographer">Cinematographer</option>
          <option value="drone">Drone</option>
        </select>
        <Input type="number" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} placeholder="6000" required />
        <Button type="submit" disabled={createService.isPending} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Create
        </Button>
      </form>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <div className="relative max-w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-muted-foreground/70" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 w-full bg-card text-sm border-border rounded-xl shadow-sm dark:bg-card"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-9 rounded-xl border border-border bg-card px-3 text-sm">
          <option value="all">All Types</option>
          <option value="shoot">Shoot</option>
          <option value="addon">Addon</option>
        </select>
        <select value={priceTypeFilter} onChange={(e) => setPriceTypeFilter(e.target.value)} className="h-9 rounded-xl border border-border bg-card px-3 text-sm">
          <option value="all">All Price Types</option>
          <option value="per_day">Per day</option>
          <option value="fixed">Fixed</option>
          <option value="per_unit">Per unit</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 rounded-xl border border-border bg-card px-3 text-sm">
          <option value="name">Sort: Name</option>
          <option value="type">Sort: Type</option>
          <option value="price_high">Price High</option>
          <option value="price_low">Price Low</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {!services.length ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 dark:border-border p-8 text-center text-sm text-muted-foreground">
                    No services match your search.
                  </div>
                ) : services.map((service) => (
                  <div key={service.id} className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-foreground text-sm truncate">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.type} • {service.priceType}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{formatCurrency(service.price, settings.currency)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-muted-foreground">
                      <span className="rounded-full bg-slate-50 dark:bg-slate-900/50 px-2 py-1">Type: {service.type}</span>
                      <span className="rounded-full bg-slate-50 dark:bg-slate-900/50 px-2 py-1">Price type: {service.priceType}</span>
                      <button onClick={() => handleDeleteService(service.id)} className="ml-auto rounded-lg px-2 py-1 font-semibold text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {serviceColumns.map(c => <TableHead key={c.key}>{c.label}</TableHead>)}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!services.length ? (
                      <TableRow>
                        <TableCell colSpan={serviceColumns.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                          No services match your search.
                        </TableCell>
                      </TableRow>
                    ) : services.map(service => (
                      <ServiceRow key={service.id} item={service} columns={serviceColumns} onDelete={handleDeleteService} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
