'use client';

import PageHeader from '@/components/shared/PageHeader';
import { StockWithdrawalForm } from '@/components/stock/StockWithdrawalForm';

export default function StockWithdrawalPage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Saída de Estoque" />
      <StockWithdrawalForm />
    </div>
  );
}
