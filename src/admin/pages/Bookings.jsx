import { useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "@admin/services/SettingsContext";
import { formatCurrency, getInitials } from "@shared/utils/admin";
import { useDeleteBooking, useGetBookings } from "@admin/services/api";
import { Input } from "@admin/components/ui/input";
import { Button } from "@admin/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@admin/components/ui/select";
import { Skeleton } from "@admin/components/ui/skeleton";
import { format } from "date-fns";
import { Search, SlidersHorizontal, ArrowRight, MapPin, Calendar, Trash2 } from "lucide-react";
import { useToast } from "@shared/hooks/use-toast";

const STATUS_CONFIG = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-700 ring-1 ring-red-200" },
};

const getBookingStatus = (booking) => booking.status || "pending";
const getFirstEvent = (booking) => booking.events?.[0] || {};
const getEventSummary = (booking) => `${booking.events?.length || 0} day${booking.events?.length === 1 ? "" : "s"}`;

const INITIALS_COLORS = [
  "bg-primary/20 text-primary",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

export default function Bookings() {
  const { settings } = useSettings();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const { data: apiBookings = [], isLoading, error } = useGetBookings();
  const deleteBooking = useDeleteBooking();

  const allBookings = apiBookings.filter((booking) => booking.type === "booking" || !booking.type);
  const bookings = allBookings.filter((b) => {
    const customer = b.customer || {};
    const firstEvent = getFirstEvent(b);
    const query = search.trim().toLowerCase();
    const matchSearch = !query ||
      customer.name?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.phone?.toLowerCase().includes(query) ||
      firstEvent.location?.toLowerCase().includes(query) ||
      b.bookingId?.toLowerCase().includes(query);
    const matchStatus = status === "all" || getBookingStatus(b) === status;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    if (sort === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sort === "amount_high") return (b.estimate || 0) - (a.estimate || 0);
    if (sort === "amount_low") return (a.estimate || 0) - (b.estimate || 0);
    if (sort === "date") return new Date(getFirstEvent(a).date || 0) - new Date(getFirstEvent(b).date || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const statusCounts = { all: allBookings.length };
  allBookings.forEach(b => {
    const bookingStatus = getBookingStatus(b);
    statusCounts[bookingStatus] = (statusCounts[bookingStatus] || 0) + 1;
  });

  const handleDeleteBooking = (booking) => {
    if (booking.type !== "enquiry" && booking.status !== "cancelled") {
      toast({ title: "Delete not allowed", description: "Only enquiries or cancelled bookings can be deleted." });
      return;
    }
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    deleteBooking.mutate(booking.id, {
      onSuccess: () => toast({ title: "Deleted", description: "Booking deleted successfully." }),
      onError: (err) => toast({ title: "Delete failed", description: err.message }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">Confirm Requests</h1>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">{allBookings.length} total requests</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] items-center">
        <div className="relative w-full max-w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-muted-foreground/70" />
          <Input
            placeholder="Search client, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 w-full bg-card text-sm border-border rounded-xl shadow-sm dark:bg-card"
          />
        </div>
        <Select value={status} onValueChange={setStatus} className="w-full md:w-44">
          <SelectTrigger className="h-9 w-full bg-card border-border rounded-xl shadow-sm text-sm dark:bg-card">
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-slate-400 dark:text-muted-foreground" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort} className="w-full md:w-44">
          <SelectTrigger className="h-9 w-full bg-card border-border rounded-xl shadow-sm text-sm dark:bg-card">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="date">Event Date</SelectItem>
            <SelectItem value="amount_high">Amount High</SelectItem>
            <SelectItem value="amount_low">Amount Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile booking list */}
      <div className="space-y-3 md:hidden">
        {bookings.map((b, idx) => {
          const customer = b.customer || {};
          const firstEvent = getFirstEvent(b);
          const sc = STATUS_CONFIG[getBookingStatus(b)] || STATUS_CONFIG.pending;
          const initials = getInitials(customer.name);
          const ic = INITIALS_COLORS[idx % INITIALS_COLORS.length];
          return (
            <Link
              key={b.id}
              to={`/admin/bookings/${b.id}`}
              className="block rounded-2xl border border-border/60 bg-card p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-full flex items-center justify-center text-xs font-bold ${ic}`}>
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">{customer.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${sc.cls}`}>{sc.label}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-muted-foreground">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-2">{getEventSummary(b)}</div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-2">{firstEvent.location || "-"}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-2xl border border-border/60 shadow-sm overflow-x-auto">
        <table className="min-w-[760px] w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-slate-50 dark:bg-slate-900/30">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">Client</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">Event</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Location</th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-border/60">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-9 w-full" /></td>
                  <td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-4 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-4 hidden lg:table-cell"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-4"><Skeleton className="h-5 w-16 mx-auto rounded-full" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-12 ml-auto" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-7 w-14 ml-auto" /></td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-14 text-red-500 text-sm">
                  {error.message}
                </td>
              </tr>
            ) : !bookings.length ? (
              <tr>
                <td colSpan={7} className="text-center py-14 text-slate-400 dark:text-muted-foreground text-sm">
                  No bookings match your current filters.
                </td>
              </tr>
            ) : bookings.map((b, idx) => {
              const customer = b.customer || {};
              const firstEvent = getFirstEvent(b);
              const bookingStatus = getBookingStatus(b);
              const sc = STATUS_CONFIG[bookingStatus] || STATUS_CONFIG.pending;
              const ic = INITIALS_COLORS[idx % INITIALS_COLORS.length];
              const initials = getInitials(customer.name);
              return (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${ic}`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-foreground">{customer.name}</p>
                        <p className="text-xs text-slate-400 dark:text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="capitalize text-slate-700 dark:text-muted-foreground font-medium">{getEventSummary(b)}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-muted-foreground/70 shrink-0" />
                      {firstEvent.date ? format(new Date(firstEvent.date), "MMM d, yyyy") : "-"}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-muted-foreground text-xs">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-muted-foreground/70 shrink-0" />
                      <span className="truncate max-w-[160px]">{firstEvent.location || "-"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.cls} dark:opacity-95`}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-slate-900 dark:text-foreground">{formatCurrency(b.estimate || b.totalPrice || 0, settings.currency)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {b.status === "cancelled" && (
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteBooking(b)} disabled={deleteBooking.isPending} className="h-7 w-7 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary">
                        <Link to={`/admin/bookings/${b.id}`}><ArrowRight className="h-3.5 w-3.5" /></Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
