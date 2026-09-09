import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl space-y-4 p-12">
      <p className="text-primary">404</p>
      <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
      <Button asChild>
        <Link href="/">Về trang chủ</Link>
      </Button>
    </main>
  );
}
