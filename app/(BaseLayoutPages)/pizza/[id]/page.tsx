'use client';

import PizzaInfo from "@/widgets/PizzaInfo";
import { use } from 'react';

interface PizzaPageProps {
  params: Promise<{
    id: string;
  }>
}

export default function Page({ params }: PizzaPageProps) {
  const { id } = use(params);
  const numericId = parseInt(id, 10);
  return <PizzaInfo id={numericId} />;
}