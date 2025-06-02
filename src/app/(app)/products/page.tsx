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


export default function ProductsPage() {
  const { products, getProductById } = useStock(); // updateProduct is handled within ProductForm via context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  // const [deletingProduct, setDeletingProduct] = useState<Product | undefined>(undefined); // For delete functionality - future
  const { toast } = useToast();

  const handleEdit = (productId: string) => {
    const productToEdit = getProductById(productId);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setIsModalOpen(true);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(undefined); // Ensure form is for new product
    setIsModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      // Reset editing product when modal closes, ensuring form resets for next "Add New"
      setEditingProduct(undefined); 
    }
  }

  // const handleDelete = (productId: string) => {
  //   // Logic to delete product - for future implementation
  //   // e.g. deleteProduct(productId);
  //   toast({ title: "Sucesso!", description: "Produto excluído (simulado)." });
  //   setDeletingProduct(undefined);
  // };
  
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
                  // setEditingProduct(undefined); // Already handled by onOpenChange
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
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {/* Delete Functionality - Future
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" onClick={() => setDeletingProduct(product)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        {deletingProduct?.id === product.id && (
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o produto "{deletingProduct.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeletingProduct(undefined)}>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(deletingProduct.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        )}
                      </AlertDialog>
                       */}
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
