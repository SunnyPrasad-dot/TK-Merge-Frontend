import { useState } from "react";
import { useConvertInquiryToBooking, useDeleteInquiry, useGetInquiries } from "@admin/services/api";
import { format } from "date-fns";
import { Skeleton } from "@admin/components/ui/skeleton";
import { Input } from "@admin/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@admin/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@admin/components/ui/dialog";
import { Mail, Phone, MessageSquare, Calendar, ChevronRight, Clock, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { getInitials } from "@shared/utils/admin";
import { useToast } from "@shared/hooks/use-toast";

export default function Inquiries() {
  const { data: apiInquiries = [], isLoading } = useGetInquiries();
  const convertInquiry = useConvertInquiryToBooking();
  const deleteInquiry = useDeleteInquiry();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const inquiries = apiInquiries;

  const filtered = inquiries.filter((inq) => {
    const query = search.trim().toLowerCase();
    const matchSearch = !query ||
      inq.name?.toLowerCase().includes(query) ||
      inq.email?.toLowerCase().includes(query) ||
      inq.phone?.toLowerCase().includes(query) ||
      inq.message?.toLowerCase().includes(query);
    const matchStatus = status === "all" || (status === "pending" && inq.status === "pending") || (status === "confirmed" && inq.status === "confirmed");
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    if (sort === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sort === "name") return (a.name || "").localeCompare(b.name || "");
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const handleDeleteInquiry = (inq) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    deleteInquiry.mutate(inq.id, {
      onSuccess: () => {
        toast({ title: "Deleted", description: "Enquiry deleted successfully." });
        if (selectedInquiry?.id === inq.id) setSelectedInquiry(null);
      },
      onError: (err) => toast({ title: "Delete failed", description: err.message }),
    });
  };

  const getServiceName = (item) => item?.serviceId?.name || item?.serviceId || "Service";
  const getServiceRole = (item) => item?.serviceId?.role?.replaceAll("_", " ") || "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">Enquiries</h1>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">{inquiries.length} enquiries</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] items-center">
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort} className="w-full md:w-44">
          <SelectTrigger className="h-9 w-full bg-card border-border rounded-xl shadow-sm text-sm dark:bg-card">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="name">Name</SelectItem>
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
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedInquiry(inq)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-white dark:border-border dark:text-muted-foreground dark:hover:bg-card transition-all"
                  >
                    Full Detail
                  </button>
                  <button
                    onClick={() => handleDeleteInquiry(inq)}
                    disabled={deleteInquiry.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                  <button
                    onClick={() => {
                      if (!window.confirm("Are you sure you want to convert this enquiry to booking?")) return;
                      convertInquiry.mutate(inq.id, {
                        onSuccess: () => toast({ title: "Converted", description: "Enquiry converted to booking." }),
                        onError: (err) => toast({ title: "Conversion failed", description: err.message }),
                      });
                    }}
                    disabled={convertInquiry.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-xs font-medium transition-all"
                  >
                    Convert To Booking <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Enquiry Full Detail</DialogTitle>
            <DialogDescription>
              {selectedInquiry?.bookingId || selectedInquiry?.id} - {selectedInquiry?.name || "Customer enquiry"}
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-5">
              <div className="grid gap-3 rounded-xl border border-border bg-slate-50 p-4 text-sm dark:bg-slate-900/40 sm:grid-cols-2">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{selectedInquiry.customer?.name || selectedInquiry.name}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{selectedInquiry.customer?.phone || selectedInquiry.phone || "-"}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{selectedInquiry.customer?.email || selectedInquiry.email || "-"}</span></div>
                <div><span className="text-muted-foreground">Estimate:</span> <span className="font-medium">{selectedInquiry.estimate ?? "-"}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <span className="font-medium capitalize">{selectedInquiry.status || "-"}</span></div>
                <div><span className="text-muted-foreground">Created:</span> <span className="font-medium">{selectedInquiry.createdAt ? format(new Date(selectedInquiry.createdAt), "MMM d, yyyy h:mm a") : "-"}</span></div>
              </div>

              {selectedInquiry.customer?.note && (
                <div className="rounded-xl border border-border p-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Note</p>
                  <p className="text-sm text-foreground">{selectedInquiry.customer.note}</p>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Events</p>
                {!selectedInquiry.events?.length ? (
                  <p className="text-sm text-muted-foreground">No events saved.</p>
                ) : selectedInquiry.events.map((event) => (
                  <div key={event.day} className="rounded-xl border border-border p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold">Day {event.day}</p>
                      <p className="text-xs text-muted-foreground">{event.date || "-"} - {event.location || "No location"}</p>
                    </div>
                    <div className="space-y-2">
                      {event.services?.length ? event.services.map((item, index) => (
                        <div key={index} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-900/40">
                          <span>{getServiceName(item)}</span>
                          <span className="text-muted-foreground">{getServiceRole(item)} x {item.quantity || 1}</span>
                        </div>
                      )) : <p className="text-xs text-muted-foreground">No services selected.</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Add-ons</p>
                {!selectedInquiry.addons?.length ? (
                  <p className="text-sm text-muted-foreground">No add-ons selected.</p>
                ) : selectedInquiry.addons.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-xs">
                    <span>{getServiceName(item)}</span>
                    <span className="text-muted-foreground">x {item.quantity || 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
