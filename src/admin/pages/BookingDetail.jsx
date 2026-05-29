import { Link, useParams } from "react-router-dom";
import { useSettings } from "@admin/services/SettingsContext";
import { formatCurrency, getInitials } from "@shared/utils/admin";
import {
  useGetBooking,
  getGetBookingQueryKey,
  useUpdateBooking,
  useUpdateWorkStatus,
  useUpdateClientPayment,
  useGetPhotographers,
  useGetAvailablePhotographers,
  useAssignPhotographer,
  useConvertInquiryToBooking
} from "@admin/services/api";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@admin/components/ui/skeleton";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@admin/components/ui/dialog";
import { Button } from "@admin/components/ui/button";
import { MapPin, Mail, Phone, Calendar, ChevronLeft, CheckCircle, User, Lock, AlertCircle, Camera, Video, Plane, Aperture, Users, ArrowLeft, Wallet } from "lucide-react";
import { useToast } from "@shared/hooks/use-toast";

const STATUS_CONFIG = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-700 ring-1 ring-red-200" },
};

const ROLE_CONFIG = {
  candid_photographer: { label: "Candid Photographer", icon: Aperture, cls: "bg-cyan-50 text-cyan-700 ring-cyan-200" },
  drone: { label: "Drone Photographer", icon: Plane, cls: "bg-sky-50 text-sky-700 ring-sky-200" },
  traditional_photographer: { label: "Traditional Photographer", icon: Camera, cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  cinematographer: { label: "Cinematographer", icon: Video, cls: "bg-violet-50 text-violet-700 ring-violet-200" },
  traditional_videographer: { label: "Traditional Videographer", icon: Users, cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

const getBookingStatus = (booking) => booking.status || "pending";
const formatDateValue = (value, pattern = "MMM d, yyyy") => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : format(date, pattern);
};
const formatDateTimeValue = (value) => formatDateValue(value, "MMM d, yyyy h:mm a");
const getAssignedPhotographer = (booking, day) => booking.assigned?.find((item) => item.day === day);
const getAssignedNames = (assigned) => {
  const photographers = assigned?.photographerIds || assigned?.photographerId || [];
  const list = Array.isArray(photographers) ? photographers : [photographers];
  return list.map((photo) => photo?.name || photo?.id || photo?._id || photo).filter(Boolean).join(", ");
};
const getRoleLabel = (role) => ROLE_CONFIG[role]?.label || role?.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Photographer";
const getService = (item) => item?.serviceId || item?.service || item;
const getServiceName = (item) => {
  const service = getService(item);
  return service?.name || service || "Service";
};
const getRoleFromServiceName = (name = "") => {
  const value = String(name).toLowerCase();
  if (value.includes("drone")) return "drone";
  if (value.includes("cinema") || value.includes("film")) return "cinematographer";
  if (value.includes("traditional") && (value.includes("video") || value.includes("videography"))) return "traditional_videographer";
  if (value.includes("traditional") && (value.includes("photo") || value.includes("photography"))) return "traditional_photographer";
  if (value.includes("candid") && (value.includes("photo") || value.includes("photography"))) return "candid_photographer";
  if (value.includes("video") || value.includes("videography")) return "traditional_videographer";
  if (value.includes("photo") || value.includes("photography")) return "traditional_photographer";
  return "";
};
const getServiceRole = (item) => {
  const service = getService(item);
  return (typeof service === "object" ? service.role : "") || getRoleFromServiceName(getServiceName(item));
};
const getEventRequiredRoles = (event) => {
  const roles = event.services?.map(getServiceRole).filter(Boolean) || [];
  return [...new Set(roles)];
};
const getRoleServices = (event, role) => (
  event.services?.filter((item) => getServiceRole(item) === role).map(getServiceName) || []
);
const getEventRoleNeeds = (event) => {
  const needs = {};
  event.services?.forEach((item) => {
    const role = getServiceRole(item);
    if (!role) return;
    if (!needs[role]) needs[role] = { role, services: [], count: 0 };
    needs[role].services.push(getServiceName(item));
    needs[role].count += 1;
  });
  return Object.values(needs);
};
const getPhotoId = (photo) => photo?._id || photo?.id || photo;
const getAssignedPhotoRefs = (booking, day) => {
  const assigned = getAssignedPhotographer(booking, day);
  const photographers = assigned?.photographerIds || assigned?.photographerId || [];
  return Array.isArray(photographers) ? photographers : [photographers];
};
const getPhotoRole = (photo, allPhotographers) => {
  if (photo?.role) return photo.role;
  const id = getPhotoId(photo);
  return allPhotographers.find((item) => item.id === id || item._id === id)?.role || "";
};
const getAssignedIdsForDay = (booking, day) => getAssignedPhotoRefs(booking, day).map(getPhotoId).filter(Boolean);
const getAssignedRoleCount = (booking, day, role, allPhotographers) => (
  getAssignedPhotoRefs(booking, day).filter((photo) => getPhotoRole(photo, allPhotographers) === role).length
);
const getServicePrice = (item) => {
  const service = getService(item);
  return typeof service === "object" ? service.price || 0 : 0;
};
const getServicePriceType = (item) => {
  const service = getService(item);
  return typeof service === "object" ? service.priceType : "";
};
const getNormalizedAssignments = (assigned = []) => assigned.map((item) => ({
  day: item.day,
  photographerIds: item.photographerIds || item.photographerId || [],
}));
const getAssignmentPayload = (assigned = []) => assigned.map((item) => ({
  day: item.day,
  photographerIds: (Array.isArray(item.photographerIds) ? item.photographerIds : [item.photographerIds]).map(getPhotoId).filter(Boolean),
}));
const getMergedAssignments = (current = [], day, photographer) => {
  const photoId = getPhotoId(photographer);
  let dayFound = false;

  const assigned = current.map((item) => {
    if (item.day !== day) {
      return item;
    }

    dayFound = true;
    const photographers = Array.isArray(item.photographerIds) ? item.photographerIds : [item.photographerIds];
    const exists = photographers.some((photo) => getPhotoId(photo) === photoId);
    return { day, photographerIds: exists ? photographers : [...photographers, photographer] };
  });

  if (!dayFound) assigned.push({ day, photographerIds: [photographer] });
  return assigned;
};

const getPhotographerConflict = (photo, selectedDay, booking) => {
  if (!photo.isActive) return "Photographer is inactive";
  if (photo.bookedDates?.includes(selectedDay.date)) return "Booked for this event date";

  const assignedEvent = booking.assigned?.find((item) => {
    const ids = item.photographerIds || item.photographerId || [];
    const list = Array.isArray(ids) ? ids : [ids];
    return item.day !== selectedDay.day && list.some((p) => (p?._id || p?.id || p) === photo.id);
  });
  if (assignedEvent) return `Already assigned to Day ${assignedEvent.day}`;

  return "";
};

export default function BookingDetail() {
  const { settings } = useSettings();
  const { toast } = useToast();
  const params = useParams();
  const id = params.id;
  const queryClient = useQueryClient();
  const { data: apiBooking, isLoading } = useGetBooking(id, { query: { enabled: !!id } });
  const updateBooking = useUpdateBooking();
  const updateWorkStatus = useUpdateWorkStatus();
  const updateClientPayment = useUpdateClientPayment();
  const assignPhotographer = useAssignPhotographer();
  const convertInquiry = useConvertInquiryToBooking();
  const { data: allPhotographers = [] } = useGetPhotographers();

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [assigningPhotographer, setAssigningPhotographer] = useState(null);
  const [draftAssigned, setDraftAssigned] = useState([]);
  const [workStatus, setWorkStatus] = useState("");
  const [paymentForm, setPaymentForm] = useState({ amount: "", transactionId: "", paymentMethod: "upi", note: "" });

  const { data: availability, isLoading: isAvailabilityLoading } = useGetAvailablePhotographers(
    { date: selectedDay?.date, role: selectedCategory },
    { query: { enabled: !!selectedDay && !!selectedCategory } }
  );

  const booking = apiBooking;
  useEffect(() => {
    if (apiBooking) setDraftAssigned(getNormalizedAssignments(apiBooking.assigned || []));
  }, [apiBooking]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3 rounded-xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-card py-16 text-center text-sm text-muted-foreground dark:border-border">
        Booking not found.
      </div>
    );
  }
  const customer = booking.customer || {};
  const firstEvent = booking.events?.[0] || {};
  const status = getBookingStatus(booking);
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const draftBooking = { ...booking, assigned: draftAssigned };
  const selectedDayRoles = selectedDay ? getEventRequiredRoles(selectedDay) : [];
  const selectedDayNeeds = selectedDay ? getEventRoleNeeds(selectedDay) : [];
  const availablePhotographers = selectedCategory ? (availability || []) : allPhotographers;
  const selectedCategoryConfig = selectedCategory ? ROLE_CONFIG[selectedCategory] : null;
  const categoryStats = selectedDay ? Object.entries(ROLE_CONFIG).filter(([role]) => selectedDayRoles.includes(role)).map(([role, config]) => {
    const need = selectedDayNeeds.find((item) => item.role === role);
    const assignedCount = getAssignedRoleCount(draftBooking, selectedDay.day, role, allPhotographers);
    const photographers = availablePhotographers.filter((photo) => photo.role === role);
    const availableCount = photographers.filter((photo) => !getPhotographerConflict(photo, selectedDay, draftBooking)).length;
    return {
      role,
      ...config,
      services: need?.services || getRoleServices(selectedDay, role),
      required: need?.count || 1,
      assigned: assignedCount,
      total: photographers.length,
      available: availableCount,
      unavailable: photographers.length - availableCount,
    };
  }) : [];
  const categoryPhotographers = selectedCategory ? availablePhotographers.filter((photo) => photo.role === selectedCategory) : [];
  const requiredPhotographerCount = booking.events?.reduce((sum, event) => (
    sum + getEventRoleNeeds(event).reduce((total, need) => total + need.count, 0)
  ), 0) || 0;
  const selectedPhotographerCount = draftAssigned.reduce((sum, item) => {
    const ids = Array.isArray(item.photographerIds) ? item.photographerIds : [item.photographerIds];
    return sum + ids.filter(Boolean).length;
  }, 0);

  const confirmAssignment = () => {
    if (!selectedDay || !assigningPhotographer) return;
    if (getPhotographerConflict(assigningPhotographer, selectedDay, draftBooking)) return;
    setDraftAssigned((current) => getMergedAssignments(current, selectedDay.day, assigningPhotographer));
    toast({ title: "Selected", description: "Photographer added to assignment draft." });
    setAssigningPhotographer(null);
  };

  const saveAssignments = () => {
    if (selectedPhotographerCount < requiredPhotographerCount) {
      toast({ title: "Assignment incomplete", description: "Select photographers for all services before saving." });
      return;
    }
    if (apiBooking) {
      assignPhotographer.mutate(
        { id, data: { assigned: getAssignmentPayload(draftAssigned) } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) });
            queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "photographers"] });
            toast({ title: "Assign done", description: "Photographer assignments saved and mails sent." });
            setSelectedCategory(null);
            setSelectedDay(null);
          },
          onError: (err) => toast({ title: "Assignment failed", description: err.message }),
        }
      );
    }
  };

  const handleConfirmRequest = () => {
    if (!window.confirm("Are you sure you want to confirm this booking?")) return;
    if (apiBooking) {
      if (booking.type === "enquiry") {
        convertInquiry.mutate(id, {
          onSuccess: () => {
            updateBooking.mutate({ id, data: { status: "confirmed" } }, {
              onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) })
            });
          }
        });
        return;
      }
      updateBooking.mutate({ id, data: { status: "confirmed" } }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) })
      });
    }
  };

  const handleWorkStatusSubmit = (e) => {
    e.preventDefault();
    if (!workStatus) return;
    if (!window.confirm(`Update work status to "${workStatus}"?`)) return;
    updateWorkStatus.mutate({ id, data: { workStatus } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) })
    });
  };

  const handleClientPaymentSubmit = (e) => {
    e.preventDefault();
    const amount = Number(paymentForm.amount);
    if (!amount) return;
    if (!window.confirm(`Save client payment of ${amount}?`)) return;
    updateClientPayment.mutate({
      id,
      data: {
        amount,
        transactionId: paymentForm.transactionId,
        paymentMethod: paymentForm.paymentMethod,
        note: paymentForm.note,
      },
    }, {
      onSuccess: () => setPaymentForm({ amount: "", transactionId: "", paymentMethod: "upi", note: "" })
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/bookings" className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-muted-foreground hover:text-slate-700">
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <div className="w-px h-5 bg-slate-200" />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">{customer.name}</h1>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.cls}`}>{sc.label}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">Booking #{booking.bookingId || booking.id}</p>
          </div>
        </div>
        {status !== "confirmed" && (
          <button onClick={handleConfirmRequest} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-sm">
            <CheckCircle className="h-4 w-4" /> Confirm Request
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-5">Event Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {[
                { label: "Days", value: `${booking.events?.length || 0}` },
                { label: "First Date", value: formatDateValue(firstEvent.date, "MMMM d, yyyy") },
                { label: "First Event / Location", value: firstEvent.location || "-", icon: MapPin },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label}>
                  <p className="text-xs font-medium text-slate-400 dark:text-muted-foreground/70 uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-foreground">
                    {Icon && <Icon className="inline h-3.5 w-3.5 text-slate-400 mr-1" />}
                    {value}
                  </p>
                </div>
              ))}
            </div>
            {customer.note && (
              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-border">
                <p className="text-xs font-medium text-slate-400 dark:text-muted-foreground/70 uppercase tracking-wide mb-2">Customer Note</p>
                <p className="text-sm text-slate-600 dark:text-muted-foreground bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 leading-relaxed">{customer.note}</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-4">Events & Photographer Assignment</h3>
            <div className="space-y-3">
              {booking.events?.map((event) => {
                const assigned = getAssignedPhotographer(draftBooking, event.day);
                const requiredRoles = getEventRequiredRoles(event);
                const assignedIds = getAssignedIdsForDay(draftBooking, event.day);
                return (
                  <div key={event.day} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-bold text-primary">{event.day}</div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-foreground">{formatDateValue(event.date, "EEEE, MMM d, yyyy")}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-muted-foreground ml-8">{event.location}</p>
                      <div className="ml-8 mt-2 flex flex-wrap gap-1.5">
                        {requiredRoles.length ? requiredRoles.map((role) => (
                          <span key={role} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200 dark:bg-card dark:text-muted-foreground dark:ring-border">
                            {getRoleLabel(role)}
                          </span>
                        )) : (
                          <span className="text-[11px] text-amber-600">No service role found</span>
                        )}
                      </div>
                      {assigned && (
                        <div className="ml-8 mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                          <User className="h-3 w-3" /> {assigned.photographerName || getAssignedNames(assigned)}
                        </div>
                      )}
                      <p className="ml-8 mt-2 text-[11px] text-slate-400 dark:text-muted-foreground/70">
                        {assignedIds.length}/{event.services?.length || 0} photographers assigned
                      </p>
                    </div>
                    <button
                      disabled={!!assigned}
                      onClick={() => {
                        if (assigned) return;
                        setSelectedCategory(null);
                        setSelectedDay(selectedDay?.day === event.day ? null : event);
                      }}
                      className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${assigned ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-border/60 dark:bg-slate-800 dark:text-slate-500" : "bg-primary text-white hover:bg-primary/90"}`}
                    >
                      {assigned ? "Assigned" : "Assign Photographer"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedDay && (
            <div className="bg-white dark:bg-card rounded-2xl border-2 border-primary/20 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-foreground">
                    {selectedCategoryConfig ? `${selectedCategoryConfig.label} - Day ${selectedDay.day}` : `Choose Category - Day ${selectedDay.day}`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5">{formatDateValue(selectedDay.date, "EEEE, MMMM d, yyyy")}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedDay(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
              {isAvailabilityLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
                </div>
              ) : !selectedCategory ? (
                !categoryStats.length ? (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-border py-10 text-center">
                    <Camera className="h-7 w-7 text-slate-300 dark:text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-slate-500 dark:text-muted-foreground">No role is attached to this day's services.</p>
                  </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {categoryStats.map((category) => {
                    const Icon = category.icon;
                    const hasAvailable = category.available > 0;
                    return (
                      <button
                        key={category.role}
                        onClick={() => setSelectedCategory(category.role)}
                        className="text-left rounded-xl border border-slate-200 dark:border-border/60 bg-white dark:bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ring-1 ${category.cls}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${hasAvailable ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-red-50 text-red-700 ring-1 ring-red-200"}`}>
                            {hasAvailable ? `${category.available} active` : "Booked"}
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-bold text-slate-900 dark:text-foreground">{category.label}</p>
                        {category.services.length > 0 && (
                          <p className="mt-1 text-xs text-slate-600 dark:text-muted-foreground">
                            Needed for {category.services.join(", ")}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">
                          {category.assigned}/{category.required} assigned, {category.available} available
                        </p>
                      </button>
                    );
                  })}
                </div>
                )
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-border px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to categories
                  </button>
                  {!categoryPhotographers.length ? (
                    <div className="rounded-xl border border-dashed border-slate-200 dark:border-border py-10 text-center">
                      <Camera className="h-7 w-7 text-slate-300 dark:text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-slate-500 dark:text-muted-foreground">No photographers in this category.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoryPhotographers.map((photo) => {
                        const conflict = getPhotographerConflict(photo, selectedDay, draftBooking);
                        const assignedIds = getAssignedIdsForDay(draftBooking, selectedDay.day);
                        const isAlreadyAssigned = assignedIds.includes(photo.id || photo._id);
                        const need = selectedDayNeeds.find((item) => item.role === selectedCategory);
                        const isRoleFilled = getAssignedRoleCount(draftBooking, selectedDay.day, selectedCategory, allPhotographers) >= (need?.count || 1);
                        const isUnavailable = !!conflict || isAlreadyAssigned || isRoleFilled;
                        return (
                          <div key={photo.id} className={`flex items-center gap-3 p-3.5 border rounded-xl transition-all ${isUnavailable ? "border-slate-200 dark:border-border/60 bg-slate-50/80 dark:bg-slate-900/40 opacity-60" : "border-slate-200 dark:border-border/60 bg-white dark:bg-card hover:border-primary/20"}`}>
                            {photo.avatar ? (
                              <img src={photo.avatar} alt={photo.name} className="h-10 w-10 rounded-xl object-cover shrink-0" />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                                {(photo.name || "?").slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-slate-900 dark:text-foreground truncate">{photo.name}</p>
                                {isUnavailable && <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
                              </div>
                              <p className="text-xs text-slate-400 dark:text-muted-foreground/70 truncate">{getRoleLabel(photo.role)} - {photo.city}</p>
                              {isUnavailable && (
                                <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                                  <AlertCircle className="h-3 w-3 shrink-0" /> {isAlreadyAssigned ? "Already assigned to this day" : isRoleFilled ? "Required count selected" : conflict}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => !isUnavailable && setAssigningPhotographer(photo)}
                              disabled={isUnavailable}
                              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isUnavailable ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500" : "bg-primary hover:bg-primary/90 text-white"}`}
                            >
                              {isAlreadyAssigned ? "Assigned" : isRoleFilled ? "Filled" : isUnavailable ? "Booked" : "Assign"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-4">Booking Data</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 dark:text-muted-foreground/70">Type</p>
                <p className="font-semibold capitalize text-slate-900 dark:text-foreground">{booking.type || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-muted-foreground/70">Status</p>
                <p className="font-semibold capitalize text-slate-900 dark:text-foreground">{booking.status || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-muted-foreground/70">Work</p>
                <p className="font-semibold capitalize text-slate-900 dark:text-foreground">{booking.workStatus?.replaceAll("_", " ") || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-muted-foreground/70">Payment</p>
                <p className="font-semibold capitalize text-slate-900 dark:text-foreground">{booking.payment?.status || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-muted-foreground/70">Created</p>
                <p className="font-semibold text-slate-900 dark:text-foreground">{formatDateTimeValue(booking.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-muted-foreground/70">Updated</p>
                <p className="font-semibold text-slate-900 dark:text-foreground">{formatDateTimeValue(booking.updatedAt)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-3">Assignments</h3>
            <button
              onClick={saveAssignments}
              disabled={assignPhotographer.isPending || !requiredPhotographerCount}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
            >
              <CheckCircle className="h-4 w-4" /> {assignPhotographer.isPending ? "Saving..." : "Save Assignments"}
            </button>
            <p className="mt-2 text-xs text-slate-500 dark:text-muted-foreground">
              {selectedPhotographerCount}/{requiredPhotographerCount} photographers selected. Save once after all services are covered.
            </p>
          </div>

          <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-4">Customer Information</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{getInitials(customer.name)}</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-foreground text-sm">{customer.name}</p>
                <p className="text-xs text-slate-400 dark:text-muted-foreground/70">Customer</p>
              </div>
            </div>
            <div className="space-y-3">
              <a href={`mailto:${customer.email}`} className="flex items-center gap-2.5 text-sm text-primary hover:text-primary">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" /> {customer.email}
              </a>
              <a href={`tel:${customer.phone}`} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" /> {customer.phone}
              </a>
              <div className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                {formatDateValue(firstEvent.date, "MMMM d, yyyy")}
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" /> {firstEvent.location || "-"}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-4">Services</h3>
            <div className="space-y-3">
              {booking.events?.map((event) => (
                <div key={event.day} className="space-y-2 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-900/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-foreground">Day {event.day}</p>
                      <p className="text-xs text-slate-500 dark:text-muted-foreground">{formatDateValue(event.date)} | {event.location || "No location saved"}</p>
                    </div>
                    <span className="text-xs text-slate-400">{event.services?.length || 0} services</span>
                  </div>
                  <div className="space-y-1">
                    {event.services?.length ? event.services.map((item, index) => {
                      const role = getServiceRole(item);
                      return (
                        <div key={`${event.day}-${index}`} className="rounded-lg bg-white p-2 text-xs text-slate-600 dark:bg-card dark:text-muted-foreground">
                          <div className="flex items-start justify-between gap-3">
                            <span className="min-w-0 break-words font-medium">{getServiceName(item)}</span>
                            {role && <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-900 dark:text-muted-foreground">{getRoleLabel(role)}</span>}
                          </div>
                          <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                            <span>Qty {item.quantity || 1}</span>
                            <span>{getServicePriceType(item) || "price"} {formatCurrency(getServicePrice(item), settings.currency)}</span>
                          </div>
                        </div>
                      );
                    }) : (
                      <p className="text-xs text-slate-400 dark:text-muted-foreground">No services selected</p>
                    )}
                  </div>
                </div>
              ))}
              {booking.addons?.length > 0 && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-muted-foreground mb-2">Add-ons</p>
                  <div className="space-y-1">
                    {booking.addons.map((addon, index) => (
                      <div key={index} className="rounded-lg bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-900/50 dark:text-muted-foreground">
                        <div className="flex items-center justify-between gap-3">
                          <span className="min-w-0 break-words">{addon.serviceId?.name || addon.serviceId}</span>
                          <span className="shrink-0">x {addon.quantity || 1}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400">{addon.serviceId?.priceType || "price"} {formatCurrency(addon.serviceId?.price || 0, settings.currency)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-border flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-900 dark:text-foreground">Total</span>
                <span className="text-xl font-bold text-slate-900 dark:text-foreground">{formatCurrency(booking.estimate || booking.totalPrice || 0, settings.currency)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleWorkStatusSubmit} className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-4">Work Status</h3>
            <div className="space-y-3">
              <select
                value={workStatus || booking.workStatus || "pending"}
                onChange={(e) => setWorkStatus(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border dark:bg-card dark:text-foreground"
              >
                <option value="pending">Pending</option>
                <option value="editing">Editing</option>
                <option value="edited">Edited</option>
                <option value="delivery_pending">Delivery pending</option>
                <option value="delivered">Delivered</option>
              </select>
              <button
                type="submit"
                disabled={updateWorkStatus.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
              >
                <CheckCircle className="h-4 w-4" /> {updateWorkStatus.isPending ? "Updating..." : "Update Work Status"}
              </button>
            </div>
          </form>

          <form onSubmit={handleClientPaymentSubmit} className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-4">Client Payment</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 dark:text-muted-foreground/70">Total</p>
                <p className="font-semibold text-slate-900 dark:text-foreground">{formatCurrency(booking.payment?.totalAmount || booking.estimate || 0, settings.currency)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-muted-foreground/70">Paid</p>
                <p className="font-semibold text-slate-900 dark:text-foreground">{formatCurrency(booking.payment?.paidAmount || 0, settings.currency)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-muted-foreground/70">Remaining</p>
                <p className="font-semibold text-slate-900 dark:text-foreground">{formatCurrency(booking.payment?.remainingAmount || 0, settings.currency)}</p>
              </div>
            </div>
            {booking.payment?.history?.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-4 dark:border-border">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-muted-foreground/70">Payment History</p>
                <div className="space-y-2">
                  {booking.payment.history.map((item, index) => (
                    <div key={index} className="rounded-lg bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-900/50 dark:text-muted-foreground">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-slate-900 dark:text-foreground">{formatCurrency(item.amount || 0, settings.currency)}</span>
                        <span className="capitalize">{item.paymentMethod || "-"}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">{formatDateTimeValue(item.date)} | {item.transactionId || "No transaction ID"}</p>
                      {item.note && <p className="mt-1 text-[11px]">{item.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 space-y-3">
              <input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                placeholder="Amount"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border dark:bg-card dark:text-foreground"
                required
              />
              <input
                value={paymentForm.transactionId}
                onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                placeholder="Transaction ID"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border dark:bg-card dark:text-foreground"
              />
              <select
                value={paymentForm.paymentMethod}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border dark:bg-card dark:text-foreground"
              >
                <option value="upi">UPI</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
              </select>
              <input
                value={paymentForm.note}
                onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                placeholder="Note"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border dark:bg-card dark:text-foreground"
              />
              <button
                type="submit"
                disabled={updateClientPayment.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                <Wallet className="h-4 w-4" /> {updateClientPayment.isPending ? "Saving..." : "Save Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={!!assigningPhotographer} onOpenChange={(open) => !open && setAssigningPhotographer(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Photographer Assignment</DialogTitle>
            <DialogDescription className="pt-1">
              Assign <span className="font-semibold text-slate-900 dark:text-foreground">{assigningPhotographer?.name || "this photographer"}</span> to{" "}
              <span className="font-semibold text-slate-900 dark:text-foreground">Day {selectedDay?.day || ""}</span> {selectedDay ? `(${format(new Date(selectedDay.date), "MMMM d, yyyy")})` : ""}.
            </DialogDescription>
          </DialogHeader>
          {assigningPhotographer && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-border/60">
              {assigningPhotographer.avatar ? (
                <img src={assigningPhotographer.avatar} alt={assigningPhotographer.name} className="h-10 w-10 rounded-xl object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                  {(assigningPhotographer.name || "?").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-foreground">{assigningPhotographer.name}</p>
                <p className="text-xs text-slate-500 dark:text-muted-foreground">{assigningPhotographer.role} - {assigningPhotographer.city}</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAssigningPhotographer(null)} className="rounded-xl">Cancel</Button>
            <Button onClick={confirmAssignment} disabled={assignPhotographer.isPending} className="rounded-xl bg-primary hover:bg-primary/90">
              {assignPhotographer.isPending ? "Assigning..." : "Confirm Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
