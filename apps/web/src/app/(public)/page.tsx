import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HealthPanel } from '@/features/health/components/health-panel';
import { apiUrl } from '@/services/api-client';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white">
              E
            </span>
            EMS
          </Link>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            Phase 0 · Project setup
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-bold tracking-widest text-primary uppercase">
            Một nền tảng cho mọi sự kiện
          </p>
          <h1 className="mt-5 text-4xl leading-tight font-bold tracking-tight sm:text-6xl">
            Event Management
            <br />
            System<span className="text-primary">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Hệ thống Quản lý và Điều hành Sự kiện Toàn diện. Nền tảng đang được
            xây dựng từng bước, bắt đầu từ hạ tầng và kết nối dịch vụ.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href={`${apiUrl}/docs`} target="_blank" rel="noreferrer">
                Mở tài liệu API ↗
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#roadmap">Lộ trình phát triển ↓</a>
            </Button>
          </div>
        </div>
        <div className="mt-12">
          <HealthPanel />
        </div>
        <section id="roadmap" className="mt-12" aria-labelledby="roadmap-title">
          <h2 id="roadmap-title" className="text-2xl font-bold">
            Từng bước đến MVP
          </h2>
          <p className="mt-2 text-muted-foreground">
            Các tính năng dưới đây thuộc những giai đoạn tiếp theo.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Tài khoản & phân quyền',
                text: 'Đăng ký, đăng nhập và quyền truy cập theo sự kiện.',
              },
              {
                number: '02–03',
                title: 'Sự kiện & người tham dự',
                text: 'Quản lý lịch trình, phòng và đăng ký tham gia.',
              },
              {
                number: '04–05',
                title: 'Vé & check-in',
                text: 'Đặt vé, thanh toán thử nghiệm và xác thực QR.',
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-xl border bg-white p-6"
              >
                <p className="text-sm font-bold text-primary">
                  PHASE {item.number}
                </p>
                <h3 className="mt-4 font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="mx-auto max-w-6xl border-t px-6 py-6 text-xs text-muted-foreground">
        Event Management System · Nền tảng phát triển MVP
      </footer>
    </div>
  );
}
