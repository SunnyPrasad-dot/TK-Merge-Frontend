import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import UserRoutes from "@user/routes/UserRoutes";

const AdminRoutes = lazy(() => import("@admin/routes/AdminRoutes"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </Suspense>
  );
}
