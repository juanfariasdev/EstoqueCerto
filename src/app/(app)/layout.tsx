'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import AppLogo from '@/components/shared/AppLogo';
import { LayoutDashboard, Package, ArrowRightLeft, FileText, AlertTriangle, History, PlusCircle, MinusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar'; // Import useSidebar

const navItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/products', label: 'Produtos', icon: Package },
  {
    label: 'Estoque',
    icon: ArrowRightLeft,
    subItems: [
      { href: '/stock/entry', label: 'Entrada de Estoque', icon: PlusCircle },
      { href: '/stock/withdrawal', label: 'Saída de Estoque', icon: MinusCircle },
    ],
  },
  {
    label: 'Relatórios',
    icon: FileText,
    subItems: [
      { href: '/reports/current-stock', label: 'Estoque Atual', icon: FileText },
      { href: '/reports/low-stock', label: 'Estoque Baixo', icon: AlertTriangle },
      { href: '/reports/movement', label: 'Movimentações', icon: History },
    ],
  },
];

function MainSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar(); // Get sidebar state
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar">
      <SidebarHeader>
        <AppLogo collapsed={isCollapsed} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) =>
            item.subItems ? (
              <SidebarMenuItem key={item.label}>
                 <SidebarMenuButton 
                    className="justify-start w-full"
                    isActive={item.subItems.some(sub => pathname.startsWith(sub.href))}
                    tooltip={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.label}</span>}
                 </SidebarMenuButton>
                 {!isCollapsed && (
                    <ul className="pl-4 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                        <li key={subItem.href}>
                        <Link href={subItem.href} passHref legacyBehavior>
                            <SidebarMenuButton 
                            asChild
                            className="justify-start w-full text-sm"
                            isActive={pathname.startsWith(subItem.href)}
                            >
                            <a>
                                <subItem.icon className="h-4 w-4 mr-2" />
                                {subItem.label}
                            </a>
                            </SidebarMenuButton>
                        </Link>
                        </li>
                    ))}
                    </ul>
                 )}
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton 
                    asChild 
                    className="justify-start w-full"
                    isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                    tooltip={isCollapsed ? item.label : undefined}
                  >
                    <a>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen">
        <MainSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" /> {/* Hamburger for mobile */}
            <div className="flex-1">
              {/* Could add breadcrumbs or page title here */}
            </div>
            {/* User menu or other header items can go here */}
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
