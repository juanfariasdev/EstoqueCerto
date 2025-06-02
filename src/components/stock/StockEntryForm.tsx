'use client';

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStock } from '@/contexts/StockContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const stockEntrySchema = z.object({
  productId: z.string().min(1, { message: 'Selecione um produto.' }),
  quantity: z.coerce.number().min(1, { message: 'Quantidade deve ser maior que zero.' }),
});

type StockEntryFormData = z.infer<typeof stockEntrySchema>;

export function StockEntryForm() {
  const { products, addStockEntry, getProductById } = useStock();
  const { toast } = useToast();

  const form = useForm<StockEntryFormData>({
    resolver: zodResolver(stockEntrySchema),
    defaultValues: {
      productId: '',
      quantity: 1,
    },
  });

  const onSubmit: SubmitHandler<StockEntryFormData> = (data) => {
    try {
      addStockEntry(data.productId, data.quantity);
      const productName = getProductById(data.productId)?.name || 'Produto';
      toast({
        title: 'Sucesso!',
        description: `${data.quantity} unidade(s) de ${productName} adicionada(s) ao estoque.`,
        className: 'bg-accent text-accent-foreground'
      });
      form.reset();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro!', description: 'Falha ao registrar entrada de estoque.' });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Entrada de Estoque</CardTitle>
        <CardDescription>Selecione o produto e informe a quantidade que está entrando no estoque.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (Atual: {product.currentStock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Registrar Entrada</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
