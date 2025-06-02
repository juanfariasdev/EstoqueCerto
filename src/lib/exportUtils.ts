
'use client';

interface ColumnDefinition<T> {
  key: keyof T | ((item: T) => string | number | undefined);
  label: string;
}

export function exportToCSV<T extends object>(
  data: T[],
  columns: ColumnDefinition<T>[],
  filename: string
): void {
  if (!data || data.length === 0) {
    console.warn('No data to export.');
    // Optionally, show a toast or alert to the user
    alert('Nenhum dado para exportar.');
    return;
  }

  const headerRow = columns.map(col => col.label).join(',');

  const dataRows = data.map(item => {
    return columns.map(col => {
      let value: string | number | undefined | boolean;
      if (typeof col.key === 'function') {
        value = col.key(item);
      } else {
        value = item[col.key] as string | number | undefined | boolean;
      }

      if (value === undefined || value === null) {
        return '';
      }
      const stringValue = String(value);
      // Escape commas and quotes
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  }).join('\n');

  const csvContent = `${headerRow}\n${dataRows}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Fallback for older browsers or environments where download attribute is not supported
    alert('Seu navegador não suporta download direto. O CSV será aberto em uma nova aba se possível.');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  }
}

export function getProductStatusText(product: { currentStock: number; minStockLevel: number }): string {
  if (product.currentStock < product.minStockLevel) {
    return 'Baixo';
  } else if (product.currentStock === product.minStockLevel) {
    return 'Mínimo';
  } else {
    return 'OK';
  }
}
