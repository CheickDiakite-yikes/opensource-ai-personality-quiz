import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NotificationCenter from "../notifications/NotificationCenter";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
  SidebarRail,
  SidebarInset
} from "@/components/ui/sidebar";
import { Brain, BarChart, ClipboardList, User, Home, ChevronLeft, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Navigation items used in both sidebar and mobile menu - Settings removed
  const navigationItems = [
    { name: "Assessment", path: "/assessment", icon: Brain, requiresAuth: true },
    { name: "Report", path: "/report", icon: ClipboardList, requiresAuth: true },
    { name: "Tracker", path: "/tracker", icon: BarChart, requiresAuth: true },
    { name: "Profile", path: "/profile", icon: User, requiresAuth: true },
  ];

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="flex min-h-screen flex-col w-full">
          {/* Mobile Header - Only visible on mobile */}
          <header className="md:hidden py-4 px-4 border-b">
            <div className="container flex justify-between items-center">
              <div className="flex items-center gap-2">
                {location.pathname !== "/" && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleBack}
                    className="mr-1 hover:bg-accent/50 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">Go back</span>
                  </Button>
                )}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to="/" className="text-xl font-bold hover:text-primary transition-colors">
                    Who Am I?
                  </Link>
                </motion.div>
              </div>
              <div className="flex items-center space-x-3">
                <NotificationCenter />
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
              </div>
            </div>
          </header>
          
          {/* Desktop Sidebar with Content */}
          <div className="flex flex-1">
            {/* Sidebar for desktop and tablet */}
            <Sidebar className="hidden md:flex">
              <SidebarHeader>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-3"
                >
                  <Link to="/" className="text-xl font-bold hover:text-primary transition-colors flex items-center">
                    <Home className="mr-2 h-5 w-5" />
                    Who Am I?
                  </Link>
                </motion.div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {!user && (
                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive("/auth")}
                            tooltip="Login / Register"
                            className="transition-all duration-300 ease-in-out hover:translate-x-1"
                          >
                            <Link to="/auth">
                              <User className="transition-transform" />
                              <span>Login / Register</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                      
                      {navigationItems.map((item) => (
                        (!item.requiresAuth || user) && (
                          <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton 
                              asChild 
                              isActive={isActive(item.path)}
                              tooltip={item.name}
                              className="transition-all duration-300 ease-in-out hover:translate-x-1"
                            >
                              <Link to={item.path}>
                                <item.icon className="transition-transform" />
                                <span>{item.name}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      ))}
                      
                      {user && (
                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            onClick={signOut}
                            tooltip="Logout"
                            className="transition-all duration-300 ease-in-out hover:translate-x-1"
                          >
                            <LogOut className="transition-transform" />
                            <span>Logout</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                <div className="p-3 flex items-center">
                  <span className="text-xs text-muted-foreground">© Who Am I? {new Date().getFullYear()}</span>
                </div>
              </SidebarFooter>
              <SidebarRail />
            </Sidebar>
            
            {/* Main content area */}
            <SidebarInset className="flex-1 flex flex-col">
              {/* Desktop Header - Only visible on desktop and tablet */}
              <header className="hidden md:flex py-4 px-4 border-b">
                <div className="container flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger className="mr-2 hover:bg-accent/50 transition-colors" />
                    {location.pathname !== "/" && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleBack}
                        className="hover:bg-accent/50 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="sr-only">Go back</span>
                      </Button>
                    )}
                  </div>
                  <div>
                    <NotificationCenter />
                  </div>
                </div>
              </header>
              
              <main className="flex-1">
                <AnimatePresence mode="wait">
                  <Outlet />
                </AnimatePresence>
              </main>
              
              <Footer />
            </SidebarInset>
          </div>
        </div>
        <Toaster position="top-center" />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Layout;
