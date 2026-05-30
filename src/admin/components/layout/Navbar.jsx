import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@admin/services/auth";
import { Bell, Menu } from "lucide-react";
import { Button } from "@admin/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@admin/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@admin/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@admin/components/ui/dropdown-menu";
import Sidebar from "@admin/components/layout/Sidebar";

const PAGE_TITLES = {
  "/admin": "Dashboard",
  "/admin/bookings": "Confirm Requests",
  "/admin/inquiries": "Enquiries",
  "/admin/photographers": "Photographers",
  "/admin/prices": "Services",
  "/admin/payments": "Payments",
  "/admin/settings": "Settings",
  "/admin/profile": "My Profile",
};

function PageTitle() {
  const location = useLocation();
  const matched = Object.entries(PAGE_TITLES).find(([path]) =>
    path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(path)
  );
  return (
    <h2 className="text-sm font-semibold text-foreground">
      {matched ? matched[1] : ""}
    </h2>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="h-14 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 fixed top-0 left-0 right-0 z-40 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60 border-0">
            <SheetTitle className="sr-only">Admin navigation</SheetTitle>
            <SheetDescription className="sr-only">Main admin menu links</SheetDescription>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <PageTitle />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-muted transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback className="bg-primary/20 text-primary-foreground text-xs font-semibold">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium text-foreground">
                {user?.name}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs text-muted-foreground">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                if (!window.confirm("Are you sure you want to sign out?")) return;
                await logout();
                navigate("/admin/login", { replace: true });
              }}
              className="text-red-600"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
