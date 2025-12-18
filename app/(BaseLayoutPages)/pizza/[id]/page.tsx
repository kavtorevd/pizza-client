'use client';

import PizzaInfo from "@/widgets/PizzaInfo";
import { use } from 'react';

interface PizzaPageProps {
  params: Promise<{
    id: string;
  }>
}

export default function Page({ params }: PizzaPageProps) {
  // Используем React.use() для распаковки Promise
  const { id } = use(params);
  
  console.log('ID:', id);
  
  const numericId = parseInt(id, 10);
  
  return <PizzaInfo id={numericId} />;
}