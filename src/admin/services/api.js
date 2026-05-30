import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: options.body instanceof FormData ? options.headers : {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    const message = data.message || "Request failed";
    if (/token|unauthorized|refresh/i.test(message) && !path.endsWith("/login")) {
      localStorage.removeItem("admin-user");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    throw new Error(message);
  }
  return data;
}

const toId = (item) => item ? { ...item, id: item._id || item.id } : item;
const toBooking = (item) => item ? {
  ...toId(item),
  status: item.status || "pending",
} : item;
const toAvatar = (item) => item ? {
  ...toId(item),
  avatar: item.avatar?.url || item.avatar || "",
} : item;
const list = (items, mapper = toId) => (items || []).map(mapper);
const bookingList = (data) => data.bookings || data.data || [];

export const adminLogin = (payload) => request("/admin/login", {
  method: "POST",
  body: JSON.stringify(payload),
});

export const adminLogout = () => request("/admin/logout", { method: "POST" });

export function useGetDashboardSummary() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const data = await request("/admin/dashboard");
      return data.data;
    },
  });
}

export function useGetBookings() {
  return useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: async () => {
      const data = await request("/admin/bookings");
      return list(bookingList(data), toBooking).filter((booking) => booking.type === "booking" || !booking.type);
    },
  });
}

export const getGetBookingQueryKey = (id) => ["admin", "booking", String(id)];

export function useGetBooking(id, options = {}) {
  return useQuery({
    queryKey: getGetBookingQueryKey(id),
    enabled: !!id,
    queryFn: async () => {
      const data = await request(`/admin/bookings/${id}`);
      return toBooking(data.booking);
    },
    ...(options.query || {}),
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => request(`/admin/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => request(`/admin/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "photographers"] });
    },
  });
}

export const useDeleteInquiry = useDeleteBooking;

export function useUpdateWorkStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => request(`/bookings/work-status/${id}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
  });
}

export function useUpdateClientPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => request(`/bookings/payment/${id}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useGetInquiries() {
  return useQuery({
    queryKey: ["admin", "inquiries"],
    queryFn: async () => {
      const data = await request("/admin/enquiries");
      return list(data.data).map((item) => ({
        ...item,
        name: item.customer?.name || item.name,
        email: item.customer?.email || item.email,
        phone: item.customer?.phone || item.phone,
        message: item.customer?.note || item.message || "Booking enquiry",
      }));
    },
  });
}

export function useConvertInquiryToBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => request(`/admin/convert/${id}`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useGetPhotographers() {
  return useQuery({
    queryKey: ["admin", "photographers"],
    queryFn: async () => {
      const data = await request("/photographers");
      return list(data.data, toAvatar);
    },
  });
}

export function useGetPhotographer(id, options = {}) {
  return useQuery({
    queryKey: ["admin", "photographer", String(id)],
    enabled: !!id,
    queryFn: async () => {
      const data = await request("/photographers");
      return list(data.data, toAvatar).find((item) => item.id === id);
    },
    ...(options.query || {}),
  });
}

export function useGetAvailablePhotographers(params = {}, options = {}) {
  const query = new URLSearchParams();
  if (params.date) query.set("date", params.date);
  if (params.role) query.set("role", params.role);

  return useQuery({
    queryKey: ["admin", "available-photographers", params],
    enabled: !!params.date,
    queryFn: async () => {
      const data = await request(`/admin/photographers/available?${query.toString()}`);
      return list(data.photographers, toAvatar);
    },
    ...(options.query || {}),
  });
}

export function useAssignPhotographer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => request(`/bookings/assign/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "photographers"] });
    },
  });
}

export function useCreatePhotographer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => request("/photographers", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "photographers"] }),
  });
}

export function useUpdatePhotographer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => request(`/photographers/${id}`, {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "photographers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "photographer", String(variables.id)] });
    },
  });
}

export function useGetRoleSources() {
  const photographersQuery = useGetPhotographers();
  const servicesQuery = useGetPackages();

  return {
    photographers: photographersQuery.data || [],
    services: servicesQuery.data || [],
    isLoading: photographersQuery.isLoading || servicesQuery.isLoading,
  };
}

export function useDeletePhotographer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => request(`/photographers/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "photographers"] }),
  });
}

export function useGetPackages() {
  return useQuery({
    queryKey: ["admin", "services"],
    queryFn: async () => {
      const data = await request("/services");
      return list(data.services);
    },
  });
}

export const useGetAddons = useGetPackages;

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => request("/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "services"] }),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => request(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "services"] }),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => request(`/services/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "services"] }),
  });
}

export const useUpdatePackage = useUpdateService;
export const useUpdateAddon = useUpdateService;

export function useGetPayments() {
  return useQuery({
    queryKey: ["admin", "payments"],
    queryFn: async () => {
      const data = await request("/payments");
      return list(data.payments);
    },
  });
}

export function useGetUnpaidPayments() {
  return useQuery({
    queryKey: ["admin", "payments", "unpaid"],
    queryFn: async () => {
      const data = await request("/payments/unpaid");
      return list(data.payments);
    },
  });
}

export function useGetPaymentsByPhotographer(photographerId, options = {}) {
  return useQuery({
    queryKey: ["admin", "payments", "photographer", photographerId],
    enabled: !!photographerId,
    queryFn: async () => {
      try {
        const data = await request(`/payments/photographer/${photographerId}`);
        return list(data.payments);
      } catch (error) {
        if (/no payment data found/i.test(error.message)) return [];
        throw error;
      }
    },
    ...(options.query || {}),
  });
}

export function useGetPaymentsByMonth(month, options = {}) {
  return useQuery({
    queryKey: ["admin", "payments", "month", month],
    enabled: !!month,
    queryFn: async () => {
      try {
        const data = await request(`/payments/month/${month}`);
        return list(data.payments);
      } catch (error) {
        if (/no payments found/i.test(error.message)) return [];
        throw error;
      }
    },
    ...(options.query || {}),
  });
}

export function useUpdatePhotographerPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => request("/payments/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "payments"] });
    },
  });
}

export function getBookingEstimate(payload) {
  return request("/bookings/estimate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
