import { useGetDashboardSummary } from "@admin/services/api";
import { Skeleton } from "@admin/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { getInitials } from "@shared/utils/admin";
import { Calendar, Users, MessageSquare, CheckCircle, TrendingUp, ArrowUpRight, Clock } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", cls: "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30" },
};

const FAKE_BOOKINGS = [
  { id: 1, customer: { name: "Abhay Savant", email: "abhaysavant7@gmail.com", phone: "7863854896", note: "Two day destination wedding coverage." }, events: [{ day: 1, date: "2026-05-20", location: "Greece", services: [] }], addons: [], isConfirmed: false },
  { id: 2, customer: { name: "Pancholi Pankaj", email: "pancholipankaj255@gmail.com", phone: "9876543210", note: "Wedding photography" }, events: [{ day: 1, date: "2026-05-25", location: "Ahmedabad", services: [] }], addons: [], isConfirmed: true },
  { id: 3, customer: { name: "Riya Mehta", email: "riya.mehta@gmail.com", phone: "9825012345", note: "Need candid and drone coverage for engagement." }, events: [{ day: 1, date: "2026-06-02", location: "Surat", services: [] }], addons: [], isConfirmed: false },
  { id: 4, customer: { name: "Nikhil Shah", email: "nikhil.shah@gmail.com", phone: "9909911223", note: "Reception event with album addon." }, events: [{ day: 1, date: "2026-06-12", location: "Vadodara", services: [] }], addons: [], isConfirmed: true },
  { id: 5, customer: { name: "Ayesha Khan", email: "ayesha.khan@gmail.com", phone: "9898989898", note: "Haldi and sangeet on separate days." }, events: [{ day: 1, date: "2026-06-18", location: "Udaipur", services: [] }], addons: [], isConfirmed: false },
];

const FAKE_INQUIRIES = [
  { id: 1, name: "Pancholi Pankaj", email: "pancholipankaj255@gmail.com", phone: "9876543210", message: "I want to book photography", createdAt: "2026-05-08" },
  { id: 2, name: "Abhay Savant", email: "abhaysavant7@gmail.com", phone: "7863854896", message: "Need photography estimate", createdAt: "2026-05-07" },
  { id: 3, name: "Riya Mehta", email: "riya.mehta@gmail.com", phone: "9825012345", message: "Engagement shoot in Surat with candid and drone coverage.", createdAt: "2026-05-06" },
  { id: 4, name: "Karan Desai", email: "karan.desai@gmail.com", phone: "9723456789", message: "Corporate event photography quotation required.", createdAt: "2026-05-05" },
];

const getBookingStatus = (booking) => booking.status || (booking.isConfirmed ? "confirmed" : "pending");

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  const stats = [
    { title: "Total Bookings", value: summary?.totalBookings || 6, icon: Calendar, color: "text-primary", bg: "bg-primary/10", change: "+2", trend: "up" },
    { title: "Confirmed Bookings", value: summary?.confirmedBookings || 3, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", change: "+1", trend: "up" },
    { title: "Enquiries", value: summary?.enquiries || 4, icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10", change: "+2", trend: "up" },
    { title: "Active Photographers", value: summary?.activePhotographers || 5, icon: Users, color: "text-violet-500", bg: "bg-violet-500/10", change: "5 active", trend: "neutral" },
  ];

  const bookings = summary?.recentBookings?.length ? summary.recentBookings : FAKE_BOOKINGS;
  const inquiries = summary?.recentEnquiries?.length ? summary.recentEnquiries : FAKE_INQUIRIES;

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
                <p className="text-3xl font-bold text-foreground mt-2">{isLoading ? "-" : s.value}</p>
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
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))
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
            {inquiries.map((inq) => (
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
