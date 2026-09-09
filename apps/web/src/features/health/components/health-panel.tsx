'use client';

import { Button } from '@/components/ui/button';
import { useHealth } from '../hooks/use-health';

export function HealthPanel() {
  const health = useHealth();
  return (
    <section
      className="rounded-2xl border bg-white p-6 sm:p-8"
      aria-labelledby="health-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Kết nối hệ thống
          </p>
          <h2 id="health-title" className="mt-2 text-xl font-bold">
            Trạng thái dịch vụ
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={health.isFetching}
          onClick={() => void health.refetch()}
        >
          {health.isFetching ? 'Đang kiểm tra…' : 'Kiểm tra lại'}
        </Button>
      </div>
      <div className="mt-6" aria-live="polite" role="status">
        {health.isPending ? (
          <p className="text-muted-foreground">Đang kết nối đến API…</p>
        ) : health.isError ? (
          <div className="rounded-lg bg-amber-50 p-4 text-amber-900">
            <p className="font-semibold">Chưa kết nối được dịch vụ</p>
            <p className="mt-1 text-sm">
              {health.error.message === 'Failed to fetch'
                ? 'Hãy khởi động backend tại cổng 3001 và PostgreSQL.'
                : health.error.message}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {['NestJS API', 'PostgreSQL qua Prisma'].map((label) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-900"
              >
                <span
                  className="h-2 w-2 rounded-full bg-emerald-600"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold">
                  {label} · Sẵn sàng
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Kiểm tra trực tiếp mỗi 30 giây. Redis được kiểm tra bằng Docker
        healthcheck.
      </p>
    </section>
  );
}
