'use client';
import { Button } from '@/components/ui/button';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl space-y-4 px-6 py-20">
      <h1 className="text-2xl font-semibold">Không thể tải nội dung</h1>
      <p>Vui lòng thử lại sau ít phút.</p>
      <Button onClick={reset}>Thử lại</Button>
    </main>
  );
}
