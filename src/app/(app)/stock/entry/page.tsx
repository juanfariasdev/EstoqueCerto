'use client';

import PageHeader from '@/components/shared/PageHeader';
import { StockEntryForm } from '@/components/stock/StockEntryForm';

export default function StockEntryPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Entrada de Estoque" />
      <StockEntryForm />
    </div>
  );
}
