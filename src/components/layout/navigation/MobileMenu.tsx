
import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigationItems } from "./NavigationItems";

const MobileMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { navigationItems, isActive } = useNavigationItems();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="hover:bg-accent/50 transition-colors">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] sm:w-[300px]">
        <div className="py-4">
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              className={`flex items-center px-4 py-3 text-sm rounded-md transition-all duration-300 ease-in-out hover:scale-[1.02] ${
                isActive("/")
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              Home
            </Link>
            
            {!user && (
              <Link
                to="/auth"
                className={`flex items-center px-4 py-3 text-sm rounded-md transition-all duration-300 ease-in-out hover:scale-[1.02] ${
                  isActive("/auth")
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <User className="mr-3 h-5 w-5" />
                Login / Register
              </Link>
            )}
            
            {navigationItems.map((item) => (
              (!item.requiresAuth || user) && (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-md transition-all duration-300 ease-in-out hover:scale-[1.02] ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            ))}
            
            {user && (
              <Button
                variant="ghost"
                className="justify-start px-4 py-3 text-sm rounded-md transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-accent hover:text-accent-foreground"
                onClick={signOut}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
