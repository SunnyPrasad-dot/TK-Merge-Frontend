/**
 * API stub — replace these with real fetch calls when you connect your backend.
 * All hooks return { data: undefined, isLoading: false } so pages fall back
 * to their built-in FAKE_* data automatically.
 */

const stub    = ()  => ({ data: undefined, isLoading: false });
const stubMut = ()  => ({ mutate: () => {}, mutateAsync: () => Promise.resolve(), isPending: false });

// Dashboard
export const useGetDashboardSummary      = stub;

// Bookings
export const useGetBookings              = stub;
export const useGetBooking               = stub;
export const useUpdateBooking            = stubMut;
export const getGetBookingQueryKey       = (id) => ["booking", id];

// Photographers
export const useGetPhotographers         = stub;
export const useGetPhotographer          = stub;
export const useGetAvailablePhotographers = stub;
export const useAssignPhotographer       = stubMut;

// Inquiries
export const useGetInquiries             = stub;

// Services
export const useGetPackages              = stub;
export const useGetAddons                = stub;
export const useUpdatePackage            = stubMut;
export const useUpdateAddon              = stubMut;
