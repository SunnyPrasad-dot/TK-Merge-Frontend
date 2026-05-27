import { Link, useParams } from "react-router-dom";
import { useGetPhotographer } from "@admin/services/api";
import { Skeleton } from "@admin/components/ui/skeleton";
import { format } from "date-fns";
import { MapPin, Mail, Phone, Calendar, ChevronLeft, Edit } from "lucide-react";

const STATUS_CONFIG = {
  active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  inactive: { label: "Inactive", cls: "bg-red-50 text-red-700 ring-1 ring-red-200", dot: "bg-red-500" },
};

const FAKE_PHOTOGRAPHERS = {
  "665f1c2a8f1b2c0012345678": {
    id: "665f1c2a8f1b2c0012345678",
    name: "Rahul Patel",
    avatar: "https://i.pravatar.cc/300?img=12",
    email: "rahul@gmail.com",
    phone: "9876543210",
    city: "Ahmedabad",
    role: "candid_photographer",
    bookedDates: ["2026-05-25"],
    isActive: true,
  },
  "665f1c2a8f1b2c0098765432": {
    id: "665f1c2a8f1b2c0098765432",
    name: "Payal Patel",
    avatar: "https://i.pravatar.cc/300?img=47",
    email: "payal@gmail.com",
    phone: "9876543210",
    city: "Ahmedabad",
    role: "drone",
    bookedDates: ["2026-05-25"],
    isActive: true,
  },
  "665f1c2a8f1b2c0044444444": {
    id: "665f1c2a8f1b2c0044444444",
    name: "Amit Shah",
    avatar: "https://i.pravatar.cc/300?img=33",
    email: "amit@gmail.com",
    phone: "9876543211",
    city: "Surat",
    role: "traditional_photographer",
    bookedDates: ["2026-06-02"],
    isActive: true,
  },
  "665f1c2a8f1b2c0055555555": {
    id: "665f1c2a8f1b2c0055555555",
    name: "Neha Verma",
    avatar: "https://i.pravatar.cc/300?img=44",
    email: "neha@gmail.com",
    phone: "9876543212",
    city: "Mumbai",
    role: "cinematographer",
    bookedDates: ["2026-06-12", "2026-06-26"],
    isActive: true,
  },
  "665f1c2a8f1b2c0066666666": {
    id: "665f1c2a8f1b2c0066666666",
    name: "Imran Sheikh",
    avatar: "https://i.pravatar.cc/300?img=15",
    email: "imran@gmail.com",
    phone: "9876543213",
    city: "Udaipur",
    role: "traditional_videographer",
    bookedDates: ["2026-06-18"],
    isActive: true,
  },
  "665f1c2a8f1b2c0077777777": {
    id: "665f1c2a8f1b2c0077777777",
    name: "Meera Joshi",
    avatar: "https://i.pravatar.cc/300?img=45",
    email: "meera@gmail.com",
    phone: "9876543214",
    city: "Rajkot",
    role: "candid_photographer",
    bookedDates: [],
    isActive: false,
  },
};

export default function PhotographerDetail() {
  const params = useParams();
  const id = params.id;
  const { data: apiPhotographer, isLoading } = useGetPhotographer(id, { query: { enabled: !!id } });

  const photographer = apiPhotographer || FAKE_PHOTOGRAPHERS[id] || FAKE_PHOTOGRAPHERS["665f1c2a8f1b2c0012345678"];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const sc = photographer.isActive ? STATUS_CONFIG.active : STATUS_CONFIG.inactive;

  return (
    <div className="space-y-6">
      <Link to="/admin/photographers" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-muted-foreground hover:text-slate-700 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Photographers
      </Link>

      <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={photographer.avatar || `https://i.pravatar.cc/300?u=${id}`} alt={photographer.name} className="h-20 w-20 rounded-2xl object-cover ring-1 ring-slate-100 shadow-md" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">{photographer.name}</h1>
              <p className="text-slate-500 dark:text-muted-foreground mt-0.5">{photographer.role}</p>
              <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.cls}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                {sc.label}
              </span>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-border/60 text-sm font-medium text-slate-700 dark:text-muted-foreground hover:bg-slate-50 dark:bg-slate-900/50 transition-all">
            <Edit className="h-4 w-4" /> Edit Profile
          </button>
        </div>
      </div>

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
