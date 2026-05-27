import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetPhotographers } from "@admin/services/api";
import { Input } from "@admin/components/ui/input";
import { Skeleton } from "@admin/components/ui/skeleton";
import { Search, Plus, MapPin, Camera, Phone, Mail, Video, Plane, Aperture, Users } from "lucide-react";

const STATUS_CONFIG = {
  active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  inactive: { label: "Inactive", cls: "bg-red-50 text-red-700 ring-1 ring-red-200", dot: "bg-red-500" },
};

const FAKE_PHOTOGRAPHERS = [
  { id: "665f1c2a8f1b2c0012345678", name: "Rahul Patel", avatar: "https://i.pravatar.cc/300?img=12", email: "rahul@gmail.com", phone: "9876543210", city: "Ahmedabad", role: "candid_photographer", bookedDates: [], isActive: true },
  { id: "665f1c2a8f1b2c0098765432", name: "Payal Patel", avatar: "https://i.pravatar.cc/300?img=47", email: "payal@gmail.com", phone: "9876543210", city: "Ahmedabad", role: "drone", bookedDates: ["2026-05-25"], isActive: true },
  { id: "665f1c2a8f1b2c0044444444", name: "Amit Shah", avatar: "https://i.pravatar.cc/300?img=33", email: "amit@gmail.com", phone: "9876543211", city: "Surat", role: "traditional_photographer", bookedDates: ["2026-06-02"], isActive: true },
  { id: "665f1c2a8f1b2c0055555555", name: "Neha Verma", avatar: "https://i.pravatar.cc/300?img=44", email: "neha@gmail.com", phone: "9876543212", city: "Mumbai", role: "cinematographer", bookedDates: ["2026-06-12", "2026-06-26"], isActive: true },
  { id: "665f1c2a8f1b2c0066666666", name: "Imran Sheikh", avatar: "https://i.pravatar.cc/300?img=15", email: "imran@gmail.com", phone: "9876543213", city: "Udaipur", role: "traditional_videographer", bookedDates: ["2026-06-18"], isActive: true },
  { id: "665f1c2a8f1b2c0077777777", name: "Meera Joshi", avatar: "https://i.pravatar.cc/300?img=45", email: "meera@gmail.com", phone: "9876543214", city: "Rajkot", role: "candid_photographer", bookedDates: [], isActive: false },
];

const ROLE_CONFIG = {
  candid_photographer: { label: "Candid Photographer", icon: Aperture, cls: "bg-cyan-50 text-cyan-700 ring-cyan-200" },
  drone: { label: "Drone Photographer", icon: Plane, cls: "bg-sky-50 text-sky-700 ring-sky-200" },
  traditional_photographer: { label: "Traditional Photographer", icon: Camera, cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  cinematographer: { label: "Cinematographer", icon: Video, cls: "bg-violet-50 text-violet-700 ring-violet-200" },
  traditional_videographer: { label: "Traditional Videographer", icon: Users, cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

const getRoleLabel = (role) => ROLE_CONFIG[role]?.label || role?.replaceAll("_", " ") || "Photographer";

export default function Photographers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();
  const { data: apiPhotographers, isLoading } = useGetPhotographers({ search: search || undefined });

  const base = apiPhotographers?.length ? apiPhotographers : FAKE_PHOTOGRAPHERS;
  const categoryStats = Object.entries(ROLE_CONFIG).map(([role, config]) => {
    const rolePhotographers = base.filter((p) => p.role === role);
    const available = rolePhotographers.filter((p) => p.isActive).length;
    return { role, ...config, total: rolePhotographers.length, available };
  });
  const photographers = base.filter((p) => {
    const roleLabel = getRoleLabel(p.role).toLowerCase();
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || roleLabel.includes(search.toLowerCase()) || p.role?.toLowerCase().includes(search.toLowerCase()) || p.city?.toLowerCase().includes(search.toLowerCase());
    const currentStatus = p.isActive ? "active" : "inactive";
    const matchStatus = statusFilter === "all" || currentStatus === statusFilter;
    const matchCategory = categoryFilter === "all" || p.role === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
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

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] items-center">
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
                  <img
                    src={p.avatar || `https://i.pravatar.cc/100?u=${p.id}`}
                    alt={p.name}
                    className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-800"
                  />
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
                      <img src={p.avatar || `https://i.pravatar.cc/300?u=${p.id}`} alt={p.name} className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-100 shadow-sm" />
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
