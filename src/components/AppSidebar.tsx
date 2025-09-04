import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { 
  BarChart3, 
  Camera, 
  Calendar, 
  Users, 
  MapPin, 
  Settings,
  LogOut,
  User,
  Tag,
  UserCheck
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";

const menuItems = [
  { title: "Overview", url: "/", icon: BarChart3, section: "overview" },
  { title: "Equipment", url: "/equipment", icon: Camera, section: "equipment" },
  { title: "Categories", url: "/categories", icon: Tag, section: "categories" },
  { title: "Bookings", url: "/bookings", icon: Calendar, section: "bookings" },
  { title: "Customers", url: "/customers", icon: UserCheck, section: "customers" },
  { title: "Users", url: "/users", icon: Users, section: "users" },
  { title: "Stores", url: "/stores", icon: MapPin, section: "stores" },
];

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  const getNavCls = (section: string) =>
    activeTab === section 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border/40">
        {!isCollapsed && (
          <div className="flex items-center gap-2 p-4">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Camera className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Camera Rental</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center p-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Camera className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={getNavCls(item.section)}
                  >
                    <button 
                      onClick={() => onTabChange(item.section)}
                      className="w-full flex items-center justify-start"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span className="ml-2">{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40">
        {!isCollapsed && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="p-2 space-y-2">
            <div className="flex justify-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}