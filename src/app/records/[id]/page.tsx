"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useDataStore } from '@/hooks/use-data-store';
import type { DataRecord } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Building, Briefcase, BookText, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function RecordDetailPage() {
  const params = useParams();
  const { getRecordById, isInitialized } = useDataStore();
  const [record, setRecord] = useState<DataRecord | null | undefined>(undefined);
  
  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (isInitialized && id) {
      const foundRecord = getRecordById(id);
      setRecord(foundRecord ?? null);
    }
  }, [id, getRecordById, isInitialized]);

  if (!isInitialized || record === undefined) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Skeleton className="h-8 w-48" />
          </div>
          <Card>
            <CardHeader className="bg-muted/30">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-8 w-3/5" />
              </div>
              <Skeleton className="h-4 w-4/5 mt-2" />
            </CardHeader>
            <CardContent className="p-6 grid gap-6">
              {[...Array(4)].map((_, i) => (
                <div className="flex items-start gap-4" key={i}>
                  <Skeleton className="w-5 h-5 rounded" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (record === null) {
    notFound();
  }

  const DetailItem = ({ icon: Icon, label, value, valueClassName }: { icon: React.ElementType, label: string, value: string | React.ReactNode, valueClassName?: string }) => (
    <div className="flex items-start gap-4">
      <Icon className="w-5 h-5 mt-1 text-primary" />
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={cn("text-lg text-foreground", valueClassName)}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
       <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to all records
            </Link>
          </Button>
        </div>
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="font-headline text-3xl flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              {record.name}
            </CardTitle>
            <CardDescription>
              Detailed information for this record.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid gap-6">
            <DetailItem icon={Mail} label="Email" value={<a href={`mailto:${record.email}`} className="hover:underline">{record.email}</a>} />
            <DetailItem icon={Building} label="Company" value={record.company} />
            <DetailItem icon={Briefcase} label="Title" value={record.title} />
            {record.notes && (
              <DetailItem icon={BookText} label="Notes" value={record.notes} valueClassName="whitespace-pre-wrap" />
            )}
            <DetailItem icon={Calendar} label="Record Created" value={new Date(record.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
