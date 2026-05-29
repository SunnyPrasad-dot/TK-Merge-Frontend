import { Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@admin/components/ui/toaster";
import { TooltipProvider } from "@admin/components/ui/tooltip";
import { AuthProvider, useAuth } from "@admin/services/auth";
import { SettingsProvider } from "@admin/services/SettingsContext";
import AdminLayout from "@admin/layouts/AdminLayout";
import Login from "@admin/pages/Login";
import Dashboard from "@admin/pages/Dashboard";
import Bookings from "@admin/pages/Bookings";
import BookingDetail from "@admin/pages/BookingDetail";
import Inquiries from "@admin/pages/Inquiries";
import Photographers from "@admin/pages/Photographers";
import PhotographerDetail from "@admin/pages/PhotographerDetail";
import PhotographerNew from "@admin/pages/PhotographerNew";
import Prices from "@admin/pages/Prices";
import Payments from "@admin/pages/Payments";
import Profile from "@admin/pages/Profile";
import Settings from "@admin/pages/Settings";
import NotFound from "@admin/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/admin/login" replace />;

  return <AdminLayout>{children}</AdminLayout>;
}

function AdminRouteTree() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="login" element={user ? <Navigate to="/admin" replace /> : <Login />} />
      <Route path="forgot-password" element={<div className="min-h-screen flex items-center justify-center p-4"><div className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-md text-center">Forgot Password Mock</div></div>} />
      <Route path="reset-password" element={<div className="min-h-screen flex items-center justify-center p-4"><div className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-md text-center">Reset Password Mock</div></div>} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
      <Route path="bookings/:id" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />
      <Route path="inquiries" element={<ProtectedRoute><Inquiries /></ProtectedRoute>} />
      <Route path="photographers/new" element={<ProtectedRoute><PhotographerNew /></ProtectedRoute>} />
      <Route path="photographers/:id" element={<ProtectedRoute><PhotographerDetail /></ProtectedRoute>} />
      <Route path="photographers" element={<ProtectedRoute><Photographers /></ProtectedRoute>} />
      <Route path="prices" element={<ProtectedRoute><Prices /></ProtectedRoute>} />
      <Route path="payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function AdminRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <TooltipProvider>
          <AuthProvider>
            <div className="admin-app">
              <AdminRouteTree />
            </div>
          </AuthProvider>
          <Toaster />
        </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
