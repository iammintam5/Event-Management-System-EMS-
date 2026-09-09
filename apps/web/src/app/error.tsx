'use client';

import { Button } from '@/components/ui/button';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-xl space-y-4 p-12">
      <h1 className="text-2xl font-bold">Không thể tải trang</h1>
      <p>Đã có lỗi xảy ra. Vui lòng thử lại.</p>
      <Button onClick={reset}>Thử lại</Button>
    </main>
  );
}
