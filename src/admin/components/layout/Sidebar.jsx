import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@admin/services/auth";
import { useSettings } from "@admin/services/SettingsContext";
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Camera,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@admin/components/ui/avatar";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Confirm Requests", icon: CalendarCheck },
  { href: "/admin/inquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/photographers", label: "Photographers", icon: Users },
  { href: "/admin/prices", label: "Services", icon: DollarSign },
  { href: "/admin/payments", label: "Payments", icon: DollarSign },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavLink({ item, isCollapsed }) {
  const location = useLocation();
  const isActive =
    location.pathname === item.href ||
    (item.href !== "/admin" && location.pathname.startsWith(item.href));

  return (
    <Link
      to={item.href}
      className={`group relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-white/10 text-white"
          : "text-sidebar-foreground hover:bg-white/5 hover:text-white"
      }`}
      title={isCollapsed ? item.label : undefined}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
      )}
      <item.icon
        className={`h-4.5 w-4.5 shrink-0 ${
          isActive
            ? "text-primary"
            : "text-sidebar-foreground/70 group-hover:text-white"
        }`}
      />
      {!isCollapsed && (
        <>
          <span>{item.label}</span>
          {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-sidebar-foreground/70" />}
        </>
      )}
    </Link>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const isCollapsed = settings.collapseSidebar;

  return (
    <div 
      className="flex flex-col h-full bg-sidebar transition-all duration-300"
      style={settings.themeMode !== 'dark' && settings.sidebarColor ? { backgroundColor: settings.sidebarColor } : undefined}
    >
      {/* Logo */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-5 py-5 border-b border-white/5`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/30">
          <Camera className="h-5 w-5 text-primary" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0 transition-opacity duration-300">
            <h1 className="text-sm font-bold text-white tracking-wide truncate">TK Studio</h1>
            <p className="text-[11px] text-sidebar-foreground/70 truncate">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 px-3 py-4 space-y-0.5 overflow-y-auto ${isCollapsed ? 'items-center' : ''}`}>
        {!isCollapsed && (
          <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/60">
            Menu
          </p>
        )}
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-2' : 'gap-3'} px-2 py-2.5 rounded-lg`}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user?.avatar || ""} />
            <AvatarFallback className="bg-primary/20 text-primary-foreground text-xs font-semibold">
              {user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[11px] text-sidebar-foreground/70 truncate">{user?.email}</p>
            </div>
          )}

          <button
            onClick={logout}
            className={`shrink-0 p-1.5 rounded-md text-sidebar-foreground/70 hover:text-white hover:bg-white/5 transition-colors ${isCollapsed ? 'w-full flex justify-center mt-2 bg-white/5' : ''}`}
            title="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
