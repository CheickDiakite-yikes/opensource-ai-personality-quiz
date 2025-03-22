
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigationItems } from "./NavigationItems";

const MobileMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { navigationItems, isActive } = useNavigationItems();
  const location = useLocation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="hover:bg-accent/50 transition-colors rounded-full w-9 h-9 p-0"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[300px] pt-6 pb-4">
        <div className="py-2 overflow-y-auto h-full scrollable-content flex flex-col">
          <div className="px-1 mb-2">
            <h2 className="text-lg font-semibold px-4 mb-4">Menu</h2>
          </div>
          
          <nav className="flex flex-col space-y-1 flex-1">
            <Link
              to="/"
              className={`flex items-center px-4 py-3 text-sm rounded-md transition-all duration-300 ease-in-out ${
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
                className={`flex items-center px-4 py-3 text-sm rounded-md transition-all duration-300 ease-in-out ${
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
                  className={`flex items-center px-4 py-3 text-sm rounded-md transition-all duration-300 ease-in-out ${
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
          </nav>
          
          <div className="mt-auto pt-4 border-t border-border">
            {user && (
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 text-sm rounded-md transition-all duration-300 ease-in-out hover:bg-accent hover:text-accent-foreground"
                onClick={signOut}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            )}
            
            <div className="px-4 py-3 text-xs text-muted-foreground mt-2">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/a6a49449-db76-4794-8533-d61d6a85d466.png" 
                  alt="Who Am I Logo" 
                  className="h-4 w-auto mr-2" 
                />
                <span>Who Am I? - Understanding your true self</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
