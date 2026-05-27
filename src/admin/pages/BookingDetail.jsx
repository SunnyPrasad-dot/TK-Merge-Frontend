import { Link, useParams } from "react-router-dom";
import { useSettings } from "@admin/services/SettingsContext";
import { formatCurrency, getInitials } from "@shared/utils/admin";
import {
  useGetBooking,
  getGetBookingQueryKey,
  useUpdateBooking,
  useGetAvailablePhotographers,
  useAssignPhotographer
} from "@admin/services/api";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@admin/components/ui/skeleton";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@admin/components/ui/dialog";
import { Button } from "@admin/components/ui/button";
import { MapPin, Mail, Phone, Calendar, ChevronLeft, CheckCircle, User, Lock, AlertCircle, Camera, Video, Plane, Aperture, Users, ArrowLeft } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
};

const FAKE_BOOKINGS = {
  1: {
    id: 1,
    customer: { name: "Abhay Savant", email: "abhaysavant7@gmail.com", phone: "7863854896", note: "Two day destination wedding coverage." },
    events: [
      { day: 1, date: "2026-05-20", location: "Greece", services: [{ serviceId: "69fb826f36a42d4eb833a2d5", quantity: 1 }] },
      { day: 2, date: "2026-05-21", location: "Greece", services: [{ serviceId: "69fb826f36a42d4eb833a2d5", quantity: 1 }, { serviceId: "69fb82d036a42d4eb833a2de", quantity: 1 }] },
    ],
    addons: [{ serviceId: "69fb82d036a42d4eb833a2de", quantity: 1 }],
    assigned: [],
    isConfirmed: false,
    totalPrice: 24000,
  },
  2: {
    id: 2,
    customer: { name: "Pancholi Pankaj", email: "pancholipankaj255@gmail.com", phone: "9876543210", note: "Wedding photography" },
    events: [{ day: 1, date: "2026-05-25", location: "Ahmedabad", services: [{ serviceId: "69fb826f36a42d4eb833a2d5", quantity: 2 }] }],
    addons: [],
    assigned: [{ day: 1, photographerId: "665f1c2a8f1b2c0012345678", photographerName: "Rahul Patel" }],
    isConfirmed: true,
    totalPrice: 18000,
  },
  3: {
    id: 3,
    customer: { name: "Riya Mehta", email: "riya.mehta@gmail.com", phone: "9825012345", note: "Need candid and drone coverage for engagement." },
    events: [{ day: 1, date: "2026-06-02", location: "Surat", services: [{ serviceId: "69fb826f36a42d4eb833a2d5", quantity: 1 }] }],
    addons: [{ serviceId: "69fb82d036a42d4eb833a2df", quantity: 1 }],
    assigned: [],
    isConfirmed: false,
    totalPrice: 10000,
  },
  4: {
    id: 4,
    customer: { name: "Nikhil Shah", email: "nikhil.shah@gmail.com", phone: "9909911223", note: "Reception event with album addon." },
    events: [{ day: 1, date: "2026-06-12", location: "Vadodara", services: [{ serviceId: "69fb82d036a42d4eb833a2e0", quantity: 1 }] }],
    addons: [{ serviceId: "69fb82d036a42d4eb833a2df", quantity: 2 }],
    assigned: [{ day: 1, photographerId: "665f1c2a8f1b2c0098765432", photographerName: "Payal Patel" }],
    isConfirmed: true,
    totalPrice: 22000,
  },
  5: {
    id: 5,
    customer: { name: "Ayesha Khan", email: "ayesha.khan@gmail.com", phone: "9898989898", note: "Haldi and sangeet on separate days." },
    events: [
      { day: 1, date: "2026-06-18", location: "Udaipur", services: [{ serviceId: "69fb82d036a42d4eb833a2e1", quantity: 1 }] },
      { day: 2, date: "2026-06-19", location: "Udaipur", services: [{ serviceId: "69fb826f36a42d4eb833a2d5", quantity: 1 }] },
    ],
    addons: [],
    assigned: [{ day: 1, photographerId: "665f1c2a8f1b2c0012345678", photographerName: "Rahul Patel" }],
    isConfirmed: false,
    totalPrice: 30000,
  },
  6: {
    id: 6,
    customer: { name: "Karan Desai", email: "karan.desai@gmail.com", phone: "9723456789", note: "Corporate event photography." },
    events: [{ day: 1, date: "2026-06-26", location: "Mumbai", services: [{ serviceId: "69fb82d036a42d4eb833a2e2", quantity: 1 }] }],
    addons: [],
    assigned: [{ day: 1, photographerId: "665f1c2a8f1b2c0055555555", photographerName: "Neha Verma" }],
    isConfirmed: true,
    totalPrice: 15000,
  },
};

const FAKE_AVAILABLE = [
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

const getBookingStatus = (booking) => booking.status || (booking.isConfirmed ? "confirmed" : "pending");
const getAssignedPhotographer = (booking, day) => booking.assigned?.find((item) => item.day === day);
const getRoleLabel = (role) => ROLE_CONFIG[role]?.label || role?.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Photographer";

const getPhotographerConflict = (photo, selectedDay, booking) => {
  if (!photo.isActive) return "Photographer is inactive";
  if (photo.bookedDates?.includes(selectedDay.date)) return "Booked for this event date";

  const assignedEvent = booking.assigned?.find((item) => item.photographerId === photo.id && item.day !== selectedDay.day);
  if (assignedEvent) return `Already assigned to Day ${assignedEvent.day}`;

  return "";
};

export default function BookingDetail() {
  const { settings } = useSettings();
  const params = useParams();
  const id = parseInt(params.id, 10);
  const queryClient = useQueryClient();
  const { data: apiBooking, isLoading } = useGetBooking(id, { query: { enabled: !!id } });
  const updateBooking = useUpdateBooking();
  const assignPhotographer = useAssignPhotographer();

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [assigningPhotographer, setAssigningPhotographer] = useState(null);

  const { data: availability, isLoading: isAvailabilityLoading } = useGetAvailablePhotographers(
    { date: selectedDay?.date },
    { query: { enabled: !!selectedDay } }
  );

  const booking = apiBooking || FAKE_BOOKINGS[id] || FAKE_BOOKINGS[1];
  const customer = booking.customer || {};
  const firstEvent = booking.events?.[0] || {};
  const status = getBookingStatus(booking);
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const availablePhotographers = availability?.available || availability || FAKE_AVAILABLE;
  const selectedCategoryConfig = selectedCategory ? ROLE_CONFIG[selectedCategory] : null;
  const categoryStats = selectedDay ? Object.entries(ROLE_CONFIG).map(([role, config]) => {
    const photographers = availablePhotographers.filter((photo) => photo.role === role);
    const availableCount = photographers.filter((photo) => !getPhotographerConflict(photo, selectedDay, booking)).length;
    return {
      role,
      ...config,
      total: photographers.length,
      available: availableCount,
      unavailable: photographers.length - availableCount,
    };
  }) : [];
  const categoryPhotographers = selectedCategory ? availablePhotographers.filter((photo) => photo.role === selectedCategory) : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3 rounded-xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  const confirmAssignment = () => {
    if (!selectedDay || !assigningPhotographer) return;
    if (getPhotographerConflict(assigningPhotographer, selectedDay, booking)) return;
    if (apiBooking) {
      assignPhotographer.mutate(
        { id, data: { assigned: [{ day: selectedDay.day, photographerId: assigningPhotographer.id }] } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) });
            setAssigningPhotographer(null);
            setSelectedCategory(null);
            setSelectedDay(null);
          },
        }
      );
    } else {
      booking.assigned = [
        ...(booking.assigned || []).filter((item) => item.day !== selectedDay.day),
        { day: selectedDay.day, photographerId: assigningPhotographer.id, photographerName: assigningPhotographer.name },
      ];
      setAssigningPhotographer(null);
      setSelectedCategory(null);
      setSelectedDay(null);
    }
  };

  const handleConfirmRequest = () => {
    if (apiBooking) {
      updateBooking.mutate({ id, data: { status: "confirmed" } }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) })
      });
    }
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
            <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">Booking #{booking.id}</p>
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
                { label: "First Date", value: firstEvent.date ? format(new Date(firstEvent.date), "MMMM d, yyyy") : "-" },
                { label: "Location", value: firstEvent.location || "-", icon: MapPin },
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
                const assigned = getAssignedPhotographer(booking, event.day);
                return (
                  <div key={event.day} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-bold text-primary">{event.day}</div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-foreground">{format(new Date(event.date), "EEEE, MMM d, yyyy")}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-muted-foreground ml-8">{event.location}</p>
                      {assigned && (
                        <div className="ml-8 mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                          <User className="h-3 w-3" /> {assigned.photographerName || assigned.photographerId}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedDay(selectedDay?.day === event.day ? null : event);
                      }}
                      className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${assigned ? "border border-slate-200 dark:border-border/60 text-slate-600 dark:text-muted-foreground hover:bg-slate-100 dark:bg-slate-800" : "bg-primary text-white hover:bg-primary/90"}`}
                    >
                      {assigned ? "Change" : "Assign Photographer"}
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
                  <p className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5">{format(new Date(selectedDay.date), "EEEE, MMMM d, yyyy")}</p>
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
                        <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">
                          {category.total} total, {category.available} available, {category.unavailable} booked/inactive
                        </p>
                      </button>
                    );
                  })}
                </div>
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
                        const conflict = getPhotographerConflict(photo, selectedDay, booking);
                        const isUnavailable = !!conflict;
                        return (
                          <div key={photo.id} className={`flex items-center gap-3 p-3.5 border rounded-xl transition-all ${isUnavailable ? "border-slate-200 dark:border-border/60 bg-slate-50/80 dark:bg-slate-900/40 opacity-60" : "border-slate-200 dark:border-border/60 bg-white dark:bg-card hover:border-primary/20"}`}>
                            <img src={photo.avatar || `https://i.pravatar.cc/100?u=${photo.id}`} alt={photo.name} className="h-10 w-10 rounded-xl object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-slate-900 dark:text-foreground truncate">{photo.name}</p>
                                {isUnavailable && <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
                              </div>
                              <p className="text-xs text-slate-400 dark:text-muted-foreground/70 truncate">{getRoleLabel(photo.role)} - {photo.city}</p>
                              {isUnavailable && (
                                <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                                  <AlertCircle className="h-3 w-3 shrink-0" /> {conflict}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => !isUnavailable && setAssigningPhotographer(photo)}
                              disabled={isUnavailable}
                              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isUnavailable ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500" : "bg-primary hover:bg-primary/90 text-white"}`}
                            >
                              {isUnavailable ? "Booked" : "Assign"}
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
                {firstEvent.date ? format(new Date(firstEvent.date), "MMMM d, yyyy") : "-"}
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
                <div key={event.day} className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-muted-foreground">Day {event.day} services</span>
                  <span className="font-medium text-slate-800 dark:text-foreground">{event.services?.length || 0}</span>
                </div>
              ))}
              {booking.addons?.length > 0 && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-muted-foreground mb-2">Add-ons</p>
                  <div className="space-y-1">
                    {booking.addons.map((addon, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-slate-600 dark:text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> {addon.serviceId} x {addon.quantity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-border flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-900 dark:text-foreground">Total</span>
                <span className="text-xl font-bold text-slate-900 dark:text-foreground">{formatCurrency(booking.totalPrice || 0, settings.currency)}</span>
              </div>
            </div>
          </div>
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
              <img src={assigningPhotographer.avatar || `https://i.pravatar.cc/100?u=${assigningPhotographer.id}`} alt={assigningPhotographer.name} className="h-10 w-10 rounded-xl object-cover" />
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
