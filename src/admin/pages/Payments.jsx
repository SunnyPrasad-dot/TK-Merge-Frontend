import { useMemo, useState } from "react";
import { formatCurrency } from "@shared/utils/admin";
import { useToast } from "@shared/hooks/use-toast";
import { useSettings } from "@admin/services/SettingsContext";
import {
  useGetPayments,
  useGetPhotographers,
  useGetPaymentsByMonth,
  useGetPaymentsByPhotographer,
  useGetUnpaidPayments,
  useUpdatePhotographerPayment,
} from "@admin/services/api";
import { Input } from "@admin/components/ui/input";
import { Button } from "@admin/components/ui/button";
import { Skeleton } from "@admin/components/ui/skeleton";
import { CreditCard, Search, Wallet } from "lucide-react";

const monthValue = () => new Date().toISOString().slice(0, 7);
const getPhotographer = (payment) => payment.photographerId || {};
const getPhotographerId = (photographer) => photographer?._id || photographer?.id || photographer;
const getBookedMonths = (photographer) => (
  [...new Set((photographer?.bookedDates || [])
    .map((date) => String(date).slice(0, 7))
    .filter((date) => /^\d{4}-\d{2}$/.test(date)))]
    .sort((a, b) => b.localeCompare(a))
);
const getTransactionsText = (payment) => (
  payment.transactions || []
).map((item) => [
  item.transactionId,
  item.paymentMethod,
  item.type,
  item.note,
  item.amount,
].filter(Boolean).join(" ")).join(" ");
const getPaymentSearchText = (payment) => {
  const photographer = getPhotographer(payment);
  return [
    photographer.name,
    photographer.email,
    photographer.phone,
    payment.month,
    payment.status,
    payment.note,
    payment.totalAmount,
    payment.advancePaid,
    payment.remainingAmount,
    getTransactionsText(payment),
  ].filter(Boolean).join(" ").toLowerCase();
};

export default function Payments() {
  const { settings } = useSettings();
  const { toast } = useToast();
  const [mode, setMode] = useState("all");
  const [month, setMonth] = useState(monthValue());
  const [photographerId, setPhotographerId] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [form, setForm] = useState({
    photographerId: "",
    month: monthValue(),
    amountPaid: "",
    transactionId: "",
    paymentMethod: "upi",
    note: "",
  });

  const { data: allPayments = [], isLoading } = useGetPayments();
  const { data: unpaidPayments = [], isLoading: isUnpaidLoading } = useGetUnpaidPayments();
  const { data: monthPayments = [], isLoading: isMonthLoading } = useGetPaymentsByMonth(month, { query: { enabled: mode === "month" && !!month, retry: false } });
  const { data: photographerPayments = [], isLoading: isPhotographerLoading } = useGetPaymentsByPhotographer(photographerId, { query: { enabled: mode === "photographer" && !!photographerId, retry: false } });
  const { data: photographers = [] } = useGetPhotographers();
  const updatePayment = useUpdatePhotographerPayment();
  const selectedPaymentPhotographer = photographers.find((p) => getPhotographerId(p) === form.photographerId);
  const selectedFilterPhotographer = photographers.find((p) => getPhotographerId(p) === photographerId);
  const paymentMonths = getBookedMonths(selectedPaymentPhotographer);
  const filterMonths = getBookedMonths(selectedFilterPhotographer);

  const payments = useMemo(() => {
    const source = mode === "unpaid"
      ? unpaidPayments
      : mode === "month"
        ? monthPayments
        : mode === "photographer"
          ? photographerPayments
          : allPayments;
    const query = search.trim().toLowerCase();
    return source.filter((payment) => {
      if (!query) return true;
      return getPaymentSearchText(payment).includes(query);
    }).sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sort === "month") return (b.month || "").localeCompare(a.month || "");
      if (sort === "remaining_high") return (b.remainingAmount || 0) - (a.remainingAmount || 0);
      if (sort === "remaining_low") return (a.remainingAmount || 0) - (b.remainingAmount || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [allPayments, mode, monthPayments, photographerPayments, search, sort, unpaidPayments]);

  const loading = isLoading || (mode === "unpaid" && isUnpaidLoading) || (mode === "month" && isMonthLoading) || (mode === "photographer" && isPhotographerLoading);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{4}-\d{2}$/.test(form.month)) {
      toast({ title: "Invalid month", description: "Month format must be YYYY-MM." });
      return;
    }
    if (!window.confirm(`Update photographer payment for ${form.month}?`)) return;
    updatePayment.mutate({
      photographerId: form.photographerId,
      month: form.month,
      amountPaid: Number(form.amountPaid),
      transactionId: form.transactionId,
      paymentMethod: form.paymentMethod,
      note: form.note,
    }, {
      onSuccess: () => {
        toast({ title: "Payment Updated", description: "Photographer payment saved." });
        setForm({ ...form, amountPaid: "", transactionId: "", note: "" });
      },
      onError: (err) => toast({ title: "Payment failed", description: err.message }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">Photographer Payments</h1>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">{payments.length} payment records</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_minmax(0,1fr)_auto]">
        <select value={form.photographerId} onChange={(e) => setForm({ ...form, photographerId: e.target.value })} className="h-10 rounded-xl border border-border bg-card px-3 text-sm" required>
          <option value="">Photographer</option>
          {photographers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:col-span-2">
          <Input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required />
          <select
            value=""
            onChange={(e) => e.target.value && setForm({ ...form, month: e.target.value })}
            className="h-10 rounded-xl border border-border bg-card px-3 text-sm"
            disabled={!paymentMonths.length}
          >
            <option value="">{paymentMonths.length ? "Booked months" : "No booked months"}</option>
            {paymentMonths.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <Input type="number" value={form.amountPaid} onChange={(e) => setForm({ ...form, amountPaid: e.target.value })} placeholder="9000" required />
        <Input value={form.transactionId} onChange={(e) => setForm({ ...form, transactionId: e.target.value })} placeholder="TXN123458" />
        <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="h-10 rounded-xl border border-border bg-card px-3 text-sm">
          <option value="upi">UPI</option>
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
        </select>
        <Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Third Payment" />
        <Button disabled={updatePayment.isPending} className="bg-primary hover:bg-primary/90">
          <Wallet className="h-4 w-4" /> {updatePayment.isPending ? "Saving..." : "Update"}
        </Button>
      </form>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All"],
            ["unpaid", "Unpaid"],
            ["month", "By Month"],
            ["photographer", "By Photographer"],
          ].map(([value, label]) => (
            <button key={value} onClick={() => setMode(value)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${mode === value ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search payments..." className="pl-9" />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
            <select
              value=""
              onChange={(e) => e.target.value && setMonth(e.target.value)}
              className="h-10 rounded-xl border border-border bg-card px-3 text-sm"
              disabled={!filterMonths.length}
            >
              <option value="">{filterMonths.length ? "Booked months" : "Months"}</option>
              {filterMonths.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <select value={photographerId} onChange={(e) => setPhotographerId(e.target.value)} className="h-10 rounded-xl border border-border bg-card px-3 text-sm">
            <option value="">Select photographer</option>
            {photographers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-xl border border-border bg-card px-3 text-sm">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="month">Month</option>
            <option value="remaining_high">Remaining High</option>
            <option value="remaining_low">Remaining Low</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/30">
              <tr className="border-b border-border/60">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Photographer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Month</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Paid</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Remaining</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-4"><Skeleton className="h-8 w-full" /></td></tr>
                ))
              ) : !payments.length ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-sm text-muted-foreground">
                    <CreditCard className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                    No payment records found.
                  </td>
                </tr>
              ) : payments.map((payment) => {
                const photographer = getPhotographer(payment);
                return (
                  <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <td className="px-5 py-4 font-semibold text-foreground">{photographer.name || payment.photographerId}</td>
                    <td className="px-4 py-4 text-muted-foreground">{payment.month}</td>
                    <td className="px-4 py-4 text-right">{formatCurrency(payment.totalAmount, settings.currency)}</td>
                    <td className="px-4 py-4 text-right">{formatCurrency(payment.advancePaid, settings.currency)}</td>
                    <td className="px-4 py-4 text-right">{formatCurrency(payment.remainingAmount, settings.currency)}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase text-primary">{payment.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
