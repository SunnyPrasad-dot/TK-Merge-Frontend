import { useGetBookings, useGetDashboardSummary, useGetInquiries } from "@admin/services/api";
import { Skeleton } from "@admin/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { getInitials } from "@shared/utils/admin";
import { Calendar, Users, MessageSquare, CheckCircle, TrendingUp, ArrowUpRight, Clock } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", cls: "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30" },
};

const getBookingStatus = (booking) => booking.status || "pending";

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();
  const { data: apiBookings = [], isLoading: isBookingsLoading, error: bookingsError } = useGetBookings();
  const { data: apiInquiries = [], isLoading: isInquiriesLoading } = useGetInquiries();
  const confirmedBookings = apiBookings.filter((booking) => getBookingStatus(booking) === "confirmed").length;
  const pendingBookings = apiBookings.filter((booking) => getBookingStatus(booking) === "pending").length;
  const cancelledBookings = apiBookings.filter((booking) => getBookingStatus(booking) === "cancelled").length;

  const stats = [
    { title: "Total Bookings", value: apiBookings.length, icon: Calendar, color: "text-primary", bg: "bg-primary/10", change: `${pendingBookings} pending`, trend: "neutral" },
    { title: "Confirmed Bookings", value: confirmedBookings, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", change: `${cancelledBookings} cancelled`, trend: "neutral" },
    { title: "Enquiries", value: apiInquiries.length, icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10", change: "pending follow-ups", trend: "neutral" },
    { title: "Photographers", value: summary?.photographers ?? 0, icon: Users, color: "text-violet-500", bg: "bg-violet-500/10", change: "active records", trend: "neutral" },
  ];

  const bookings = [...apiBookings].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);
  const inquiries = [...apiInquiries].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Booking, enquiry and photographer overview.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card rounded-lg border border-border px-3 py-2 shadow-sm">
          <Clock className="h-3.5 w-3.5" />
          {format(new Date(), "MMMM d, yyyy")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{isLoading || isBookingsLoading || isInquiriesLoading ? "-" : s.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              {s.trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
              <span className={`text-xs font-medium ${s.trend === "up" ? "text-emerald-500" : "text-muted-foreground"}`}>{s.change}</span>
              {s.trend === "up" && <span className="text-xs text-muted-foreground">from last month</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {isLoading || isBookingsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))
            ) : bookingsError ? (
              <div className="px-6 py-10 text-center text-sm text-red-500">{bookingsError.message}</div>
            ) : !bookings.length ? (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">No bookings found.</div>
            ) : bookings.map((b) => {
              const customer = b.customer || {};
              const firstEvent = b.events?.[0] || {};
              const sc = STATUS_CONFIG[getBookingStatus(b)] || STATUS_CONFIG.pending;
              return (
                <Link
                key={b.id}
                to={`/admin/bookings/${b.id}`}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-6 py-3.5 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{getInitials(customer.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{firstEvent.location || "-"} - {firstEvent.date ? format(new Date(firstEvent.date), "MMM d, yyyy") : "-"}</p>
                </div>
                <span className={`mt-2 sm:mt-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.cls}`}>{sc.label}</span>
              </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Enquiries</h2>
            <Link to="/admin/inquiries" className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {isInquiriesLoading ? (
              Array(3).fill(0).map((_, i) => <div key={i} className="px-5 py-4"><Skeleton className="h-14 w-full" /></div>)
            ) : !inquiries.length ? (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">No enquiries found.</div>
            ) : inquiries.map((inq) => (
              <div key={inq.id} className="px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-primary">{getInitials(inq.name)}</span>
                    </div>
                    <span className="text-xs font-semibold text-foreground">{inq.name}</span>
                  </div>
                  {inq.createdAt && <span className="text-[10px] text-muted-foreground">{format(new Date(inq.createdAt), "MMM d")}</span>}
                </div>
                <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{inq.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
