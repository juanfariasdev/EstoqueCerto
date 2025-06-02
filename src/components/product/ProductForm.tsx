'use client';

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import type { Product } from '@/lib/types';
import { useStock } from '@/contexts/StockContext';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório.' }),
  description: z.string().min(1, { message: 'Descrição é obrigatória.' }),
  unit: z.string().optional(),
  minStockLevel: z.coerce.number().min(0, { message: 'Nível mínimo deve ser 0 ou maior.' }),
  // currentStock is managed by movements, not directly in this form for new products or edits.
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product; // If product is provided, it's an edit
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { addProduct, updateProduct } = useStock();
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      unit: product?.unit || '',
      minStockLevel: product?.minStockLevel || 0,
    },
  });

  // Reset form if product prop changes (e.g., from edit to new, or different product)
  React.useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        unit: product.unit || '',
        minStockLevel: product.minStockLevel,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        unit: '',
        minStockLevel: 0,
      });
    }
  }, [product, form]);


  const onSubmit: SubmitHandler<ProductFormData> = (data) => {
    try {
      if (product) {
        // Update existing product
        // Retain currentStock and id from the existing product object
        updateProduct({ ...product, ...data });
        toast({ title: 'Sucesso!', description: 'Produto atualizado com sucesso.', className: 'bg-accent text-accent-foreground'});
      } else {
        // Add new product
        addProduct(data); // addProduct will assign id and initial currentStock (0)
        toast({ title: 'Sucesso!', description: 'Produto cadastrado com sucesso.', className: 'bg-accent text-accent-foreground'});
      }
      // form.reset(); // Resetting here might clear the form before dialog close animation
      onSuccess?.();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro!', description: 'Falha ao salvar produto.' });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{product ? 'Editar Produto' : 'Cadastrar Novo Produto'}</DialogTitle>
        <DialogDescription>
          {product ? 'Atualize os detalhes do produto.' : 'Preencha os detalhes do novo produto.'}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Parafuso Sextavado M10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ex: Parafuso de aço carbono M10x50mm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade de Medida (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: un, kg, L, pç" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minStockLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível Mínimo de Estoque</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ex: 50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar Produto</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
