'use client';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStock } from '@/contexts/StockContext';
import { AlertTriangle, Package, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { products } = useStock();

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.currentStock < p.minStockLevel).length;

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Painel - Estoque Certo" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Produtos cadastrados no sistema</p>
            <Link href="/products" className="text-sm text-primary hover:underline mt-2 block">
              Ver Produtos
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos com Estoque Baixo</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Produtos abaixo do nível mínimo</p>
            <Link href="/reports/low-stock" className="text-sm text-primary hover:underline mt-2 block">
              Ver Relatório
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimentações Recentes</CardTitle>
            <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* This could display a summary or link to the detailed report */}
            <div className="text-2xl font-bold">-</div> 
            <p className="text-xs text-muted-foreground">Nenhuma movimentação recente (mock)</p>
            <Link href="/reports/movement" className="text-sm text-primary hover:underline mt-2 block">
              Ver Detalhes
            </Link>
          </CardContent>
        </Card>
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
