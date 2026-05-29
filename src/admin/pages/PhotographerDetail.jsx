import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeletePhotographer, useGetPhotographer, useUpdatePhotographer } from "@admin/services/api";
import { Skeleton } from "@admin/components/ui/skeleton";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@shared/hooks/use-toast";
import { MapPin, Mail, Phone, Calendar, ChevronLeft, Edit, Save, Trash2 } from "lucide-react";

const STATUS_CONFIG = {
  active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  inactive: { label: "Inactive", cls: "bg-red-50 text-red-700 ring-1 ring-red-200", dot: "bg-red-500" },
};

export default function PhotographerDetail() {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: apiPhotographer, isLoading } = useGetPhotographer(id, { query: { enabled: !!id } });
  const updatePhotographer = useUpdatePhotographer();
  const deletePhotographer = useDeletePhotographer();
  const [isEditing, setIsEditing] = useState(false);

  const photographer = apiPhotographer;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }
  if (!photographer) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-card py-16 text-center text-sm text-muted-foreground dark:border-border">
        Photographer not found.
      </div>
    );
  }

  const sc = photographer.isActive ? STATUS_CONFIG.active : STATUS_CONFIG.inactive;

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to update this photographer?")) return;
    const form = new FormData(e.currentTarget);
    updatePhotographer.mutate({
      id,
      data: {
        name: form.get("name"),
        avatar: form.get("avatar"),
        email: form.get("email"),
        phone: form.get("phone"),
        city: form.get("city"),
        role: form.get("role"),
        bookedDates: photographer.bookedDates || [],
        isActive: form.get("isActive") === "true",
        perDayRate: Number(form.get("perDayRate") || photographer.perDayRate || 0),
      },
    }, {
      onSuccess: () => {
        setIsEditing(false);
        toast({ title: "Photographer Updated", description: "Profile changes saved." });
      },
      onError: (err) => toast({ title: "Update failed", description: err.message }),
    });
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this photographer?")) return;
    deletePhotographer.mutate(id, {
      onSuccess: () => {
        toast({ title: "Photographer Deleted", description: "Profile removed." });
        navigate("/admin/photographers");
      },
      onError: (err) => toast({ title: "Delete failed", description: err.message }),
    });
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/photographers" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-muted-foreground hover:text-slate-700 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Photographers
      </Link>

      <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {photographer.avatar ? (
              <img src={photographer.avatar} alt={photographer.name} className="h-20 w-20 rounded-2xl object-cover ring-1 ring-slate-100 shadow-md" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary ring-1 ring-slate-100 shadow-md">
                {(photographer.name || "?").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">{photographer.name}</h1>
              <p className="text-slate-500 dark:text-muted-foreground mt-0.5">{photographer.role}</p>
              <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.cls}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                {sc.label}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
          <button onClick={() => setIsEditing((value) => !value)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-border/60 text-sm font-medium text-slate-700 dark:text-muted-foreground hover:bg-slate-50 dark:bg-slate-900/50 transition-all">
            <Edit className="h-4 w-4" /> Edit Profile
          </button>
          <button onClick={handleDelete} disabled={deletePhotographer.isPending} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
          </div>
        </div>
      </div>

      {isEditing && (
        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm md:grid-cols-2">
          <input name="name" defaultValue={photographer.name} className="h-10 rounded-xl border border-border bg-card px-3 text-sm" placeholder="Name" required />
          <input name="avatar" defaultValue={photographer.avatar} className="h-10 rounded-xl border border-border bg-card px-3 text-sm" placeholder="image.jpg" />
          <input name="email" defaultValue={photographer.email} className="h-10 rounded-xl border border-border bg-card px-3 text-sm" placeholder="Email" required />
          <input name="phone" defaultValue={photographer.phone} className="h-10 rounded-xl border border-border bg-card px-3 text-sm" placeholder="Phone" required />
          <input name="city" defaultValue={photographer.city} className="h-10 rounded-xl border border-border bg-card px-3 text-sm" placeholder="City" required />
          <select name="role" defaultValue={photographer.role} className="h-10 rounded-xl border border-border bg-card px-3 text-sm">
            <option value="candid_photographer">Candid Photographer</option>
            <option value="traditional_photographer">Traditional Photographer</option>
            <option value="traditional_videographer">Traditional Videographer</option>
            <option value="cinematographer">Cinematographer</option>
            <option value="drone">Drone</option>
          </select>
          <select name="isActive" defaultValue={String(photographer.isActive)} className="h-10 rounded-xl border border-border bg-card px-3 text-sm">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <input name="perDayRate" type="number" defaultValue={photographer.perDayRate || ""} className="h-10 rounded-xl border border-border bg-card px-3 text-sm" placeholder="Per day rate" />
          <button disabled={updatePhotographer.isPending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 md:col-span-2">
            <Save className="h-4 w-4" /> {updatePhotographer.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-4">Contact Info</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <a href={`mailto:${photographer.email}`} className="text-primary hover:underline truncate">{photographer.email}</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-slate-700 dark:text-muted-foreground">{photographer.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-slate-700 dark:text-muted-foreground">{photographer.city}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-border">
            <h3 className="text-sm font-bold text-slate-900 dark:text-foreground">Booked Dates</h3>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-border/60">
            {!photographer.bookedDates?.length ? (
              <p className="px-5 py-6 text-sm text-slate-400 dark:text-muted-foreground/70 text-center">No booked dates.</p>
            ) : (
              photographer.bookedDates.map((date) => (
                <div key={date} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-foreground">{format(new Date(date), "MMMM d, yyyy")}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
