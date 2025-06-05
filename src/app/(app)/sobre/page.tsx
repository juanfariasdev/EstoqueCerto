
'use client';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="container mx-auto py-8">
      <PageHeader title="Sobre o Estoque Certo" />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-6 w-6 mr-3 text-primary" />
            Informações do Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground">
            Este sistema foi desenvolvido por:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
            <li>Juan Pablo Farias</li>
            <li>Amanda Dias</li>
            <li>Laura Evelyn Neves</li>
          </ul>
          <CardDescription className="mt-6 text-sm">
            Estoque Certo - Versão 1.0.0
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
