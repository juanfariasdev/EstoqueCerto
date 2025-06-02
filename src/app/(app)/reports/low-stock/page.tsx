
'use client';

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStock } from '@/contexts/StockContext';
import { AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/exportUtils';
import type { Product } from '@/lib/types';

export default function LowStockReportPage() {
  const { products } = useStock();
  const lowStockProducts = products.filter(p => p.currentStock < p.minStockLevel);

  const handleExport = () => {
    const columns = [
      { key: 'name' as keyof Product, label: 'Produto' },
      { key: 'currentStock' as keyof Product, label: 'Estoque Atual' },
      { key: 'minStockLevel' as keyof Product, label: 'Estoque Mínimo' },
      { key: (item: Product) => item.minStockLevel - item.currentStock, label: 'Necessário Repor' },
    ];
    exportToCSV(lowStockProducts, columns, 'relatorio_estoque_baixo');
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader 
        title="Relatório de Produtos com Estoque Baixo" 
        actions={
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
            Produtos Abaixo do Nível Mínimo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Nenhum produto com estoque baixo.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Estoque Atual</TableHead>
                  <TableHead className="text-right">Estoque Mínimo</TableHead>
                  <TableHead className="text-right">Necessário Repor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product.id} className="text-destructive hover:bg-destructive/10">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{product.currentStock}</TableCell>
                    <TableCell className="text-right">{product.minStockLevel}</TableCell>
                    <TableCell className="text-right font-bold">
                      {product.minStockLevel - product.currentStock}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
