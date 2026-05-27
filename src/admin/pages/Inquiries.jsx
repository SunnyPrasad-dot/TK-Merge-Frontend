import { useState } from "react";
import { useGetInquiries } from "@admin/services/api";
import { format } from "date-fns";
import { Skeleton } from "@admin/components/ui/skeleton";
import { Input } from "@admin/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@admin/components/ui/select";
import { Mail, Phone, MessageSquare, Calendar, ChevronRight, Clock, Search, SlidersHorizontal } from "lucide-react";
import { getInitials } from "@shared/utils/admin";
import { Link } from "react-router-dom";

const FAKE_INQUIRIES = [
  {
    id: 1,
    name: "Pancholi Pankaj",
    email: "pancholipankaj255@gmail.com",
    phone: "9876543210",
    message: "I want to book photography",
    createdAt: "2026-05-08",
  },
  {
    id: 2,
    name: "Abhay Savant",
    email: "abhaysavant7@gmail.com",
    phone: "7863854896",
    message: "Need photography estimate",
    createdAt: "2026-05-07",
  },
  {
    id: 3,
    name: "Riya Mehta",
    email: "riya.mehta@gmail.com",
    phone: "9825012345",
    message: "Engagement shoot in Surat with candid and drone coverage.",
    createdAt: "2026-05-06",
  },
  {
    id: 4,
    name: "Karan Desai",
    email: "karan.desai@gmail.com",
    phone: "9723456789",
    message: "Corporate event photography quotation required for June last week.",
    createdAt: "2026-05-05",
  },
  {
    id: 5,
    name: "Ayesha Khan",
    email: "ayesha.khan@gmail.com",
    phone: "9898989898",
    message: "Haldi and sangeet function coverage in Udaipur for two days.",
    createdAt: "2026-05-04",
  },
  {
    id: 6,
    name: "Nikhil Shah",
    email: "nikhil.shah@gmail.com",
    phone: "9909911223",
    message: "Reception photography and album pricing details needed.",
    createdAt: "2026-05-03",
  },
];

export default function Inquiries() {
  const { data: apiInquiries, isLoading } = useGetInquiries();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const inquiries = apiInquiries?.length ? apiInquiries : FAKE_INQUIRIES;

  const filtered = inquiries.filter((inq) => {
    const matchSearch = !search || inq.name?.toLowerCase().includes(search.toLowerCase()) || inq.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || (status === "new" && inq.status !== "read");
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">Enquiries</h1>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">{inquiries.length} enquiries</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] items-center">
        <div className="relative w-full max-w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-muted-foreground/70" />
          <Input
            placeholder="Search name, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 w-full bg-card text-sm border-border rounded-xl shadow-sm dark:bg-card"
          />
        </div>
        <Select value={status} onValueChange={setStatus} className="w-full md:w-44">
          <SelectTrigger className="h-9 w-full bg-card border-border rounded-xl shadow-sm text-sm dark:bg-card">
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-slate-400 dark:text-muted-foreground" />
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Enquiries</SelectItem>
            <SelectItem value="new">New Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border/60 shadow-sm p-6">
              <div className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-16 w-full mt-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !filtered.length ? (
        <div className="bg-white dark:bg-card rounded-2xl border border-dashed border-slate-200 dark:border-border py-16 text-center">
          <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-muted-foreground text-sm">No enquiries match your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => (
            <div key={inq.id} className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border/60 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 text-sm font-bold bg-primary/20 text-primary">
                    {getInitials(inq.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-foreground text-base">{inq.name}</h3>
                        <div className="flex items-center flex-wrap gap-3 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-muted-foreground">
                            <Mail className="h-3 w-3" /> {inq.email}
                          </span>
                          {inq.phone && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-muted-foreground">
                              <Phone className="h-3 w-3" /> {inq.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      {inq.createdAt && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-muted-foreground/70">
                          <Clock className="h-3 w-3" />
                          {format(new Date(inq.createdAt), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-slate-600 dark:text-foreground/90 leading-relaxed line-clamp-3">
                      {inq.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-border/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {inq.createdAt ? `Received ${format(new Date(inq.createdAt), "MMMM d, yyyy")}` : "Received"}
                </div>
                <Link to="/admin/bookings">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-medium transition-all">
                    Convert To Booking <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
