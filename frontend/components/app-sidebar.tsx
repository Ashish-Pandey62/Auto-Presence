"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  CalendarSync,
  ChartNoAxesCombined,
  ChevronUp,
  House,
  MessageSquareMore,
  Moon,
  PenLine,
  Plus,
  Sun,
  User2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: House,
  },
  {
    title: "Product",
    url: "/product",
    icon: Plus,
  },
  {
    title: "Post",
    url: "/post",
    icon: PenLine,
  },
  {
    title: "Schedule",
    url: "/calendar",
    icon: CalendarSync,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Replies",
    url: "/replies",
    icon: MessageSquareMore,
  },
];

export const AppSidebar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-4 py-6">
        <h1 className="text-purple-600 font-bold text-2xl">
          <a href="/">SocioConnect</a>
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="gap-3 px-4 py-2"
                  >
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full gap-3">
                  <User2 className="h-5 w-5" />
                  <span>Ankit Raj Mehta</span>
                  <ChevronUp className="ml-auto h-5 w-5" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
