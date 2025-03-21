
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
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
  SidebarRail
} from "@/components/ui/sidebar";
import { Home, LogOut, User } from "lucide-react";
import { useNavigationItems } from "./NavigationItems";

const DesktopSidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { navigationItems, isActive } = useNavigationItems();

  return (
    <Sidebar className="hidden md:flex">
      <SidebarHeader>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-3"
        >
          <Link to="/" className="text-xl font-bold hover:text-primary transition-colors flex items-center">
            <img 
              src="/lovable-uploads/5f4224f1-f59e-4af0-90ab-186051436b51.png" 
              alt="Who Am I Logo" 
              className="h-8 w-auto mr-2" 
            />
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
  );
};

export default DesktopSidebar;
