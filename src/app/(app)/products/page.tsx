'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { ProductForm } from '@/components/product/ProductForm';
import { useStock } from '@/contexts/StockContext';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


export default function ProductsPage() {
  const { products, getProductById, deleteProduct: contextDeleteProduct } = useStock();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [deletingProduct, setDeletingProduct] = useState<Product | undefined>(undefined);
  const { toast } = useToast();

  const handleEdit = (productId: string) => {
    const productToEdit = getProductById(productId);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setIsModalOpen(true);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingProduct(undefined); 
    }
  }

  const handleDeleteClick = (product: Product) => {
    if (product.currentStock > 0) {
       toast({
        variant: 'destructive',
        title: 'Exclusão não permitida',
        description: `O produto "${product.name}" possui estoque e não pode ser excluído.`,
      });
      return;
    }
    setDeletingProduct(product);
  };

  const confirmDelete = () => {
    if (deletingProduct) {
      const success = contextDeleteProduct(deletingProduct.id);
      if (success) {
        toast({ title: "Sucesso!", description: `Produto "${deletingProduct.name}" excluído.`, className: 'bg-accent text-accent-foreground' });
      } else {
        // This case should ideally be caught by the pre-check or if context.deleteProduct becomes more sophisticated
        toast({ variant: 'destructive', title: "Erro!", description: `Falha ao excluir o produto "${deletingProduct.name}". Verifique se o estoque está zerado.` });
      }
      setDeletingProduct(undefined);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Produtos"
        actions={
          <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Cadastrar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <ProductForm 
                product={editingProduct} 
                onSuccess={() => {
                  setIsModalOpen(false);
                }} 
              />
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Nenhum produto cadastrado.</p>
          ) : (
            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Estoque Atual</TableHead>
                    <TableHead className="text-right">Estoque Mínimo</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">{product.description}</TableCell>
                      <TableCell className="text-muted-foreground">{product.unit || '-'}</TableCell>
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
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product.id)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        
                        <AlertDialog open={deletingProduct?.id === product.id} onOpenChange={(open) => !open && setDeletingProduct(undefined)}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={product.currentStock > 0 ? "text-muted-foreground cursor-not-allowed" : "text-destructive hover:text-destructive-foreground hover:bg-destructive"}
                                onClick={(e) => {
                                  if (product.currentStock > 0) {
                                    e.preventDefault(); // Prevent AlertDialog trigger if disabled logic is also handled by onClick
                                    toast({
                                      variant: 'destructive',
                                      title: 'Exclusão não permitida',
                                      description: `O produto "${product.name}" não pode ser excluído pois possui ${product.currentStock} unidade(s) em estoque.`,
                                    });
                                  } else {
                                    setDeletingProduct(product); // This will trigger the AlertDialog via its `open` prop
                                  }
                                }}
                                // disabled={product.currentStock > 0} // Can also use disabled, but onClick gives more control for toast
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </TooltipTrigger>
                            {product.currentStock > 0 && (
                              <TooltipContent>
                                <p>Não pode ser excluído. Estoque: {product.currentStock}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                          {deletingProduct?.id === product.id && ( // Ensure DialogContent is rendered only when this product is being deleted
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o produto "{deletingProduct.name}"? Esta ação não pode ser desfeita.
                                  O estoque atual é {deletingProduct.currentStock}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeletingProduct(undefined)}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmDelete} disabled={deletingProduct.currentStock > 0}>Excluir</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          )}
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
