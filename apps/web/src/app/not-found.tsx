import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="space-y-4 p-10">
      <h1 className="text-2xl">Không tìm thấy trang</h1>
      <Link href="/" className="underline">
        Về trang chủ
      </Link>
    </main>
  );
}
