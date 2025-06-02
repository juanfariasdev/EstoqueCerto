import { Package } from 'lucide-react';
import React from 'react';

const AppLogo = ({ collapsed }: { collapsed?: boolean }) => {
  return (
    <div className="flex items-center gap-2 px-2 py-4">
      <Package className="h-8 w-8 text-sidebar-foreground" />
      {!collapsed && (
        <h1 className="text-xl font-bold text-sidebar-foreground">Estoque Certo</h1>
      )}
    </div>
  );
};

export default AppLogo;
