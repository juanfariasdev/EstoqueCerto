'use client';

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStock } from '@/contexts/StockContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const stockWithdrawalSchema = z.object({
  productId: z.string().min(1, { message: 'Selecione um produto.' }),
  quantity: z.coerce.number().min(1, { message: 'Quantidade deve ser maior que zero.' }),
  reason: z.string().min(1, { message: 'Motivo é obrigatório.' }),
});

type StockWithdrawalFormData = z.infer<typeof stockWithdrawalSchema>;

export function StockWithdrawalForm() {
  const { products, addStockWithdrawal, getProductById } = useStock();
  const { toast } = useToast();

  const form = useForm<StockWithdrawalFormData>({
    resolver: zodResolver(stockWithdrawalSchema),
    defaultValues: {
      productId: '',
      quantity: 1,
      reason: '',
    },
  });

  const onSubmit: SubmitHandler<StockWithdrawalFormData> = (data) => {
    try {
      const product = getProductById(data.productId);
      if (product && product.currentStock < data.quantity) {
        form.setError('quantity', { type: 'manual', message: `Estoque insuficiente. Disponível: ${product.currentStock}` });
        return;
      }
      addStockWithdrawal(data.productId, data.quantity, data.reason);
      const productName = product?.name || 'Produto';
      toast({
        title: 'Sucesso!',
        description: `${data.quantity} unidade(s) de ${productName} removida(s) do estoque.`,
        className: 'bg-accent text-accent-foreground'
      });
      form.reset();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro!', description: 'Falha ao registrar saída de estoque.' });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Saída de Estoque</CardTitle>
        <CardDescription>Selecione o produto, informe a quantidade e o motivo da saída.</CardDescription>
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
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da Saída</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: Venda, Uso interno, Perda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Registrar Saída</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
