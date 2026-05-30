import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetPhotographers } from "@admin/services/api";
import { getRoleConfig, getRoleLabel } from "@admin/services/roles";
import { Input } from "@admin/components/ui/input";
import { Skeleton } from "@admin/components/ui/skeleton";
import { Search, Plus, MapPin, Camera, Phone, Mail } from "lucide-react";

const STATUS_CONFIG = {
  active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  inactive: { label: "Inactive", cls: "bg-red-50 text-red-700 ring-1 ring-red-200", dot: "bg-red-500" },
};

export default function Photographers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const navigate = useNavigate();
  const { data: apiPhotographers = [], isLoading } = useGetPhotographers();

  const base = apiPhotographers;
  const categoryStats = [...new Set(base.map((p) => p.role).filter(Boolean))].sort((a, b) => getRoleLabel(a).localeCompare(getRoleLabel(b))).map((role) => {
    const config = getRoleConfig(role);
    const rolePhotographers = base.filter((p) => p.role === role);
    const available = rolePhotographers.filter((p) => p.isActive).length;
    return { role, ...config, total: rolePhotographers.length, available };
  });
  const photographers = base.filter((p) => {
    const roleLabel = getRoleLabel(p.role).toLowerCase();
    const query = search.trim().toLowerCase();
    const matchSearch = !query ||
      p.name?.toLowerCase().includes(query) ||
      roleLabel.includes(query) ||
      p.role?.toLowerCase().includes(query) ||
      p.city?.toLowerCase().includes(query) ||
      p.email?.toLowerCase().includes(query) ||
      p.phone?.toLowerCase().includes(query);
    const currentStatus = p.isActive ? "active" : "inactive";
    const matchStatus = statusFilter === "all" || currentStatus === statusFilter;
    const matchCategory = categoryFilter === "all" || p.role === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  }).sort((a, b) => {
    if (sort === "city") return (a.city || "").localeCompare(b.city || "");
    if (sort === "role") return getRoleLabel(a.role).localeCompare(getRoleLabel(b.role));
    if (sort === "rate_high") return (b.perDayRate || 0) - (a.perDayRate || 0);
    if (sort === "rate_low") return (a.perDayRate || 0) - (b.perDayRate || 0);
    return (a.name || "").localeCompare(b.name || "");
  });

  const filters = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">Photographers</h1>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">{photographers.length} photographers</p>
        </div>
        <button onClick={() => navigate("/admin/photographers/new")} className="inline-flex w-full justify-center sm:w-auto items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-all shadow-sm">
          <Plus className="h-4 w-4" /> Add Photographer
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] items-center">
        <div className="relative w-full max-w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-muted-foreground/70" />
          <Input
            placeholder="Search by name, role, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 w-full bg-card text-sm border-border rounded-xl shadow-sm dark:bg-card"
          />
        </div>
        <div className="flex flex-wrap gap-2 bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border p-1 shadow-sm">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${statusFilter === f.value ? "bg-primary text-white shadow-sm" : "text-slate-500 dark:text-muted-foreground hover:text-slate-700 dark:hover:text-foreground"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 rounded-xl border border-border bg-card px-3 text-sm shadow-sm">
          <option value="name">Sort: Name</option>
          <option value="city">Sort: City</option>
          <option value="role">Sort: Role</option>
          <option value="rate_high">Rate High</option>
          <option value="rate_low">Rate Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {categoryStats.map((category) => {
          const Icon = category.icon;
          const isSelected = categoryFilter === category.role;
          const hasAvailable = category.available > 0;
          return (
            <button
              key={category.role}
              onClick={() => setCategoryFilter(isSelected ? "all" : category.role)}
              className={`text-left rounded-2xl border p-4 shadow-sm transition-all ${isSelected ? "border-primary bg-primary/10 ring-2 ring-primary/15" : "border-slate-100 dark:border-border/60 bg-white dark:bg-card hover:border-primary/30"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ring-1 ${category.cls}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${hasAvailable ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-red-50 text-red-700 ring-1 ring-red-200"}`}>
                  {hasAvailable ? "Available" : "Not available"}
                </span>
              </div>
              <p className="mt-3 text-sm font-bold text-slate-900 dark:text-foreground">{category.label}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">{category.total} total, {category.available} available</p>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      ) : !photographers.length ? (
        <div className="bg-white dark:bg-card rounded-2xl border border-dashed border-slate-200 dark:border-border py-16 text-center">
          <Camera className="h-8 w-8 text-slate-300 dark:text-muted-foreground mx-auto mb-3" />
          <p className="text-slate-500 dark:text-muted-foreground text-sm">No photographers match your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {photographers.map((p) => {
              const dot = p.isActive ? "bg-emerald-500" : "bg-slate-400";
              return (
                <Link
                  key={p.id}
                  to={`/admin/photographers/${p.id}`}
                  className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm transition hover:border-primary/30"
                >
                  {p.avatar ? (
                    <img src={p.avatar} alt={p.name} className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-800" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-slate-200 dark:ring-slate-800">
                      {(p.name || "?").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="truncate text-[11px] text-slate-500 dark:text-muted-foreground">{getRoleLabel(p.role)}</p>
                  </div>
                  <span className={`h-3.5 w-3.5 rounded-full ${dot} ring-1 ring-white/80 shadow-sm`} />
                </Link>
              );
            })}
          </div>

          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {photographers.map((p) => {
              const sc = p.isActive ? STATUS_CONFIG.active : STATUS_CONFIG.inactive;
              return (
                <div key={p.id} className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      {p.avatar ? (
                        <img src={p.avatar} alt={p.name} className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-100 shadow-sm" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary ring-1 ring-slate-100 shadow-sm">
                          {(p.name || "?").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${sc.cls}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-foreground text-base">{p.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">{getRoleLabel(p.role)}</p>

                    <div className="space-y-2 mt-4 text-xs text-slate-500 dark:text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {p.city}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {p.email}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {p.phone}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-border">
                      <span className="text-xs text-slate-500 dark:text-muted-foreground">{p.bookedDates?.length || 0} booked dates</span>
                      <Link to={`/admin/photographers/${p.id}`}>
                        <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-border text-xs font-semibold text-slate-700 dark:text-foreground hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all">
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
