
'use client';

import React, { useState, useMemo } from 'react';
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
import type { StockMovement } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';

const ALL_PRODUCTS_VALUE = "all-products"; // Define a constant for clarity

export default function MovementReportPage() {
  const { movements, products } = useStock();
  const [selectedProductId, setSelectedProductId] = useState<string>(''); // Initial empty string for placeholder
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredMovements = useMemo(() => {
    return movements
      .filter((movement) => {
        // Product filter:
        // Only apply product-specific filtering if selectedProductId is not empty AND not the "all products" value.
        if (selectedProductId && selectedProductId !== ALL_PRODUCTS_VALUE && movement.productId !== selectedProductId) {
          return false;
        }
        
        // Date filter:
        if (dateRange?.from && parseISO(movement.date) < dateRange.from) {
          return false;
        }
        if (dateRange?.to && parseISO(movement.date) > dateRange.to) {
          return false;
        }
        return true;
      })
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
  }, [movements, selectedProductId, dateRange]);

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'Data inválida';
  };
  
  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Relatório Detalhado de Movimentação" />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="product-filter" className="block text-sm font-medium mb-1">Produto</label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger id="product-filter">
                <SelectValue placeholder="Todos os Produtos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_PRODUCTS_VALUE}>Todos os Produtos</SelectItem> 
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="date-range-filter" className="block text-sm font-medium mb-1">Período</label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    id="date-range-filter"
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!dateRange && "text-muted-foreground"}`}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                        dateRange.to ? (
                        <>
                            {format(dateRange.from, "LLL dd, y", {locale: ptBR})} -{" "}
                            {format(dateRange.to, "LLL dd, y", {locale: ptBR})}
                        </>
                        ) : (
                        format(dateRange.from, "LLL dd, y", {locale: ptBR})
                        )
                    ) : (
                        <span>Selecione um período</span>
                    )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={ptBR}
                    />
                </PopoverContent>
            </Popover>
          </div>
          <Button onClick={() => {setSelectedProductId(''); setDateRange(undefined)}} variant="outline" className="self-end">Limpar Filtros</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMovements.length === 0 ? (
             <p className="text-center text-muted-foreground py-4">Nenhuma movimentação encontrada para os filtros selecionados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead>Motivo (Saída)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{formatDate(movement.date)}</TableCell>
                    <TableCell className="font-medium">{movement.productName || products.find(p => p.id === movement.productId)?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={movement.type === 'entrada' ? 'default' : 'secondary'} 
                             className={movement.type === 'entrada' ? 'bg-accent text-accent-foreground' : 'bg-orange-100 text-orange-700 border-orange-300'}>
                        {movement.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{movement.quantity}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{movement.reason || '-'}</TableCell>
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

