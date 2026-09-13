'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RefreshCw, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHealth } from './health.api';

const settingsSchema = z.object({
  interval: z.number().int().min(5, 'Tối thiểu 5 giây').max(60, 'Tối đa 60 giây'),
});
type Settings = z.infer<typeof settingsSchema>;

export function HealthPanel() {
  const [interval, setInterval] = useState(15);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Settings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { interval: 15 },
  });
  const query = useQuery({
    queryKey: ['platform-health'],
    queryFn: ({ signal }) => getHealth(signal),
    refetchInterval: interval * 1000,
  });
  const healthy =
    !query.isError &&
    query.data?.broker === 'up' &&
    Object.values(query.data.services).every((s) => s === 'up');
  const label = query.isPending
    ? 'Đang kiểm tra kết nối'
    : query.isError
      ? 'Chưa thể kết nối hệ thống'
      : healthy
        ? 'Hệ thống đang phản hồi'
        : 'Một số thành phần chưa sẵn sàng';

  return (
    <section
      id="status"
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      aria-labelledby="health-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex gap-4">
          <span className="rounded-xl bg-muted p-3 text-primary">
            <Activity aria-hidden="true" size={22} />
          </span>
          <div>
            <h2 id="health-title" className="text-lg font-semibold">
              Trạng thái hệ thống
            </h2>
            <p role="status" className="mt-1 text-sm text-muted-foreground">
              {label}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => void query.refetch()} disabled={query.isFetching}>
          <RefreshCw
            size={15}
            aria-hidden="true"
            className={query.isFetching ? 'animate-spin' : ''}
          />{' '}
          Kiểm tra lại
        </Button>
      </div>
      {query.data && !query.isError && (
        <div className="mt-6 flex flex-wrap gap-2" aria-label="Trạng thái các thành phần">
          {Object.entries({
            gateway: query.data.gateway,
            broker: query.data.broker,
            ...query.data.services,
          }).map(([name, status]) => (
            <span
              key={name}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs"
            >
              <span
                className={
                  status === 'up'
                    ? 'size-1.5 rounded-full bg-emerald-600'
                    : 'size-1.5 rounded-full bg-amber-600'
                }
              />
              {name} · {status === 'up' ? 'Sẵn sàng' : 'Chưa sẵn sàng'}
            </span>
          ))}
        </div>
      )}
      <details className="mt-5 text-sm text-muted-foreground">
        <summary className="w-fit cursor-pointer">Tùy chọn kiểm tra</summary>
        <form
          className="mt-4 flex flex-wrap items-end gap-3"
          onSubmit={handleSubmit((values) => setInterval(values.interval))}
        >
          <div>
            <label htmlFor="interval" className="mb-1 block text-xs">
              Tự kiểm tra sau mỗi (giây)
            </label>
            <input
              id="interval"
              type="number"
              min={5}
              max={60}
              className="h-9 w-28 rounded-md border border-input bg-background px-3 text-foreground"
              aria-invalid={Boolean(errors.interval)}
              aria-describedby={errors.interval ? 'interval-error' : undefined}
              {...register('interval', { valueAsNumber: true })}
            />
          </div>
          <Button type="submit" size="sm" variant="outline">
            Áp dụng
          </Button>
          {errors.interval && (
            <p id="interval-error" role="alert">
              {errors.interval.message}
            </p>
          )}
        </form>
      </details>
    </section>
  );
}
