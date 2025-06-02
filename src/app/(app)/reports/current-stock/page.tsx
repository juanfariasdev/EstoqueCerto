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

export default function CurrentStockReportPage() {
  const { products } = useStock();

  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Relatório de Estoque Atual" />
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
