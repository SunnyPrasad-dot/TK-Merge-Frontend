import { useState } from "react";
import { useGetPackages, useUpdatePackage } from "@admin/services/api";
import { useSettings } from "@admin/services/SettingsContext";
import { formatCurrency } from "@shared/utils/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@admin/components/ui/table";
import { Skeleton } from "@admin/components/ui/skeleton";
import { useToast } from "@shared/hooks/use-toast";
import { Pencil, Check, X, Search } from "lucide-react";

function EditableRow({ item, onSave, columns }) {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState(item);
  const { toast } = useToast();
  const { settings } = useSettings();

  const handleSave = () => {
    onSave(item.id, values);
    setIsEditing(false);
    toast({ title: "Updated successfully", description: "The service changes have been saved." });
  };

  const handleCancel = () => {
    setValues(item);
    setIsEditing(false);
  };

  return (
    <TableRow>
      {columns.map((col) => (
        <TableCell key={col.key}>
          {isEditing && col.editable ? (
            <Input
              value={values[col.key]}
              onChange={(e) => {
                const val = col.type === "number" ? parseFloat(e.target.value) : e.target.value;
                setValues({ ...values, [col.key]: val });
              }}
              type={col.type || "text"}
              className="h-8 py-1 px-2"
            />
          ) : (
            col.type === "number" ? formatCurrency(item[col.key], settings.currency) : item[col.key]
          )}
        </TableCell>
      ))}
      <TableCell className="text-right">
        {isEditing ? (
          <div className="flex justify-end gap-2">
            <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 text-green-600"><Check className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8 text-red-600"><X className="h-4 w-4" /></Button>
          </div>
        ) : (
          <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} className="h-8 w-8 text-muted-foreground"><Pencil className="h-4 w-4" /></Button>
        )}
      </TableCell>
    </TableRow>
  );
}

const FAKE_SERVICES = [
  { id: "69fb826f36a42d4eb833a2d5", name: "candid photography", type: "service", priceType: "per_day", price: 6000 },
  { id: "69fb82d036a42d4eb833a2de", name: "drone", type: "addon", priceType: "per_day", price: 6000 },
  { id: "69fb82d036a42d4eb833a2df", name: "album", type: "addon", priceType: "fixed", price: 4000 },
  { id: "69fb82d036a42d4eb833a2e0", name: "traditional photography", type: "service", priceType: "per_day", price: 8000 },
  { id: "69fb82d036a42d4eb833a2e1", name: "traditional videography", type: "service", priceType: "per_day", price: 10000 },
  { id: "69fb82d036a42d4eb833a2e2", name: "cinematic film", type: "addon", priceType: "fixed", price: 15000 },
  { id: "69fb82d036a42d4eb833a2e3", name: "pre wedding shoot", type: "service", priceType: "fixed", price: 18000 },
  { id: "69fb82d036a42d4eb833a2e4", name: "same day teaser", type: "addon", priceType: "fixed", price: 7000 },
];

export default function Prices() {
  const { data: apiServices, isLoading } = useGetPackages();
  const updateService = useUpdatePackage();
  const { toast } = useToast();
  const { settings } = useSettings();
  const [localServices, setLocalServices] = useState(FAKE_SERVICES);
  const [search, setSearch] = useState("");

  const allServices = apiServices?.length ? apiServices : localServices;
  const services = allServices.filter((service) => {
    const query = search.toLowerCase();
    return (
      !query ||
      service.name?.toLowerCase().includes(query) ||
      service.type?.toLowerCase().includes(query) ||
      service.priceType?.toLowerCase().includes(query)
    );
  });

  const handleAddNew = () => {
    setLocalServices([...localServices, { id: Date.now(), name: "new service", type: "addon", priceType: "per_day", price: 0 }]);
    toast({ title: "Row Added", description: "Edit the new row to save service details." });
  };

  const handleSaveService = (id, data) => updateService.mutate({ id, data });

  const serviceColumns = [
    { key: "name", label: "Name", editable: true },
    { key: "type", label: "Type", editable: true },
    { key: "priceType", label: "Price Type", editable: true },
    { key: "price", label: "Price", editable: true, type: "number" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{allServices.length} total services</p>
        </div>
        <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90">Add New</Button>
      </div>

      <div className="relative max-w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-muted-foreground/70" />
        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 w-full bg-card text-sm border-border rounded-xl shadow-sm dark:bg-card"
        />
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
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-muted-foreground">
                      <span className="rounded-full bg-slate-50 dark:bg-slate-900/50 px-2 py-1">Type: {service.type}</span>
                      <span className="rounded-full bg-slate-50 dark:bg-slate-900/50 px-2 py-1">Price type: {service.priceType}</span>
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
                      <EditableRow key={service.id} item={service} columns={serviceColumns} onSave={handleSaveService} />
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
