"use client";

import { useState, useEffect, useCallback } from 'react';
import type { DataRecord } from '@/lib/types';

const STORE_KEY = 'data-sift-records';

const initialData: DataRecord[] = [
    {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Innovate Corp',
    title: 'Lead Developer',
    notes: 'Key contact for project Alpha. Expert in React and Next.js.',
    createdAt: new Date('2023-01-15T09:00:00.000Z').toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    company: 'Solutions Inc.',
    title: 'UX Designer',
    notes: 'Designed the new dashboard interface. Prefers Figma for mockups.',
    createdAt: new Date('2023-02-20T14:30:00.000Z').toISOString(),
  },
  {
    id: '3',
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    company: 'Innovate Corp',
    title: 'Project Manager',
    notes: 'Manages the overall project timeline and deliverables.',
    createdAt: new Date('2023-03-10T11:00:00.000Z').toISOString(),
  },
  {
    id: '4',
    name: 'Emily White',
    email: 'emily.white@example.com',
    company: 'Data Systems',
    title: 'Data Analyst',
    notes: 'Responsible for data analysis and reporting.',
    createdAt: new Date('2023-04-05T16:45:00.000Z').toISOString(),
  },
];

export function useDataStore() {
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORE_KEY);
      if (stored) {
        setRecords(JSON.parse(stored));
      } else {
        // First time load, use initial data and store it
        setRecords(initialData);
        window.localStorage.setItem(STORE_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      console.error('Error with localStorage', error);
      setRecords(initialData);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // This effect runs when `records` state changes, after the initial load.
    if (isInitialized) {
        try {
            window.localStorage.setItem(STORE_KEY, JSON.stringify(records));
        } catch (error) {
            console.error('Error writing to localStorage', error);
        }
    }
  }, [records, isInitialized]);

  const addRecord = useCallback((record: Omit<DataRecord, 'id' | 'createdAt'>) => {
    const newRecord: DataRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setRecords((prevRecords) => [newRecord, ...prevRecords]);
  }, []);
  
  const getRecordById = useCallback((id: string): DataRecord | undefined => {
      return records.find(record => record.id === id);
  }, [records]);

  return { records, addRecord, getRecordById, isInitialized };
}
