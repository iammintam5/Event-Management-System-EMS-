'use client';

import { useQuery } from '@tanstack/react-query';
import { getHealth } from '../api/health.api';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: ({ signal }) => getHealth(signal),
    refetchInterval: 30_000,
  });
}
