
'use client';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStock } from '@/contexts/StockContext';
import { AlertTriangle, Package, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';
import DashboardStatCard from '@/components/dashboard/DashboardStatCard';

export default function DashboardPage() {
  const { products } = useStock();

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.currentStock < p.minStockLevel).length;

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Painel - Estoque Certo" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardStatCard
          title="Total de Produtos"
          value={totalProducts}
          description="Produtos cadastrados no sistema"
          icon={Package}
          linkHref="/products"
          linkText="Ver Produtos"
        />

        <DashboardStatCard
          title="Produtos com Estoque Baixo"
          value={lowStockProducts}
          description="Produtos abaixo do nível mínimo"
          icon={AlertTriangle}
          iconClassName="text-destructive"
          linkHref="/reports/low-stock"
          linkText="Ver Relatório"
        />
        
        <DashboardStatCard
          title="Movimentações Recentes"
          value="-" // Placeholder as per original
          description="Nenhuma movimentação recente (mock)"
          icon={ArrowRightLeft}
          linkHref="/reports/movement"
          linkText="Ver Detalhes"
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/products" className="block text-primary hover:underline">Cadastrar Novo Produto</Link>
            <Link href="/stock/entry" className="block text-primary hover:underline">Registrar Entrada de Estoque</Link>
            <Link href="/stock/withdrawal" className="block text-primary hover:underline">Registrar Saída de Estoque</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/reports/current-stock" className="block text-primary hover:underline">Relatório de Estoque Atual</Link>
            <Link href="/reports/low-stock" className="block text-primary hover:underline">Relatório de Produtos com Estoque Baixo</Link>
            <Link href="/reports/movement" className="block text-primary hover:underline">Relatório Detalhado de Movimentação</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
