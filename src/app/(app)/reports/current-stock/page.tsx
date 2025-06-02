
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToCSV, getProductStatusText } from '@/lib/exportUtils';
import type { Product } from '@/lib/types';

export default function CurrentStockReportPage() {
  const { products } = useStock();

  const handleExport = () => {
    const columns = [
      { key: 'name' as keyof Product, label: 'Produto' },
      { key: 'currentStock' as keyof Product, label: 'Estoque Atual' },
      { key: 'minStockLevel' as keyof Product, label: 'Estoque Mínimo' },
      { key: (item: Product) => getProductStatusText(item), label: 'Status' },
    ];
    exportToCSV(products, columns, 'relatorio_estoque_atual');
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader 
        title="Relatório de Estoque Atual" 
        actions={
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral do Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
             <p className="text-center text-muted-foreground py-4">Nenhum produto para exibir.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Estoque Atual</TableHead>
                  <TableHead className="text-right">Estoque Mínimo</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{product.currentStock}</TableCell>
                    <TableCell className="text-right">{product.minStockLevel}</TableCell>
                    <TableCell className="text-center">
                      {product.currentStock < product.minStockLevel ? (
                        <Badge variant="destructive">Baixo</Badge>
                      ) : product.currentStock === product.minStockLevel ? (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-600">Mínimo</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">OK</Badge>
                      )}
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
