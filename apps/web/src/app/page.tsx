import Link from 'next/link';
import {
  ArrowDown,
  ArrowUpRight,
  Ticket,
  CalendarDays,
  UsersRound,
  ChartNoAxesCombined,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HealthPanel } from '@/features/health/health-panel';

const capabilities = [
  {
    number: '01',
    icon: Ticket,
    title: 'Registration',
    subtitle: 'Đăng ký & đón tiếp',
    description: 'Từ biểu mẫu đăng ký đến vé điện tử, mã QR và check-in người tham dự.',
  },
  {
    number: '02',
    icon: CalendarDays,
    title: 'Event Program',
    subtitle: 'Nội dung & chương trình',
    description: 'Kết nối địa điểm, phòng, diễn giả và từng phiên trong một lịch trình rõ ràng.',
  },
  {
    number: '03',
    icon: UsersRound,
    title: 'Operations & Resources',
    subtitle: 'Vận hành & tài nguyên',
    description: 'Phối hợp đội ngũ, phân công nhiệm vụ, quản lý thiết bị và nhà tài trợ.',
  },
  {
    number: '04',
    icon: ChartNoAxesCombined,
    title: 'Reporting',
    subtitle: 'Báo cáo & thống kê',
    description: 'Theo dõi mức độ tham gia và hiệu quả vận hành để cải thiện từng sự kiện.',
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <a href="#main" className="sr-only focus:not-sr-only">
        Đến nội dung chính
      </a>
      <header className="flex h-24 items-center justify-between border-b border-border">
        <Link href="/" className="flex items-center gap-3" aria-label="EMS trang chủ">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            e.
          </span>
          <span className="font-semibold tracking-tight">
            EMS
            <span className="ml-3 hidden text-xs font-normal text-muted-foreground sm:inline">
              Event Management System
            </span>
          </span>
        </Link>
        <a
          href="#status"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Trạng thái hệ thống <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </header>
      <main id="main" className="pb-16">
        <section className="relative py-16 sm:py-24" aria-labelledby="hero-title">
          <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-8 bg-primary" /> Hệ thống quản lý & điều hành sự kiện
          </div>
          <h1
            id="hero-title"
            className="max-w-4xl font-serif text-5xl leading-[1.12] tracking-tight sm:text-7xl"
          >
            Mỗi sự kiện.
            <br />
            <span className="text-primary">Một trải nghiệm trọn vẹn.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            Một không gian để kết nối người tham dự, chương trình và đội ngũ vận hành. Được xây dựng
            cho hành trình từ chuẩn bị đến tổng kết.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button asChild size="lg">
              <a href="#capabilities">
                Khám phá nền tảng <ArrowDown size={16} aria-hidden="true" />
              </a>
            </Button>
            <span className="text-sm text-muted-foreground">
              Đang xây dựng · Giai đoạn nền tảng
            </span>
          </div>
        </section>
        <section id="capabilities" aria-labelledby="capabilities-title" className="mb-10">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="capabilities-title" className="text-xl font-semibold">
              Bốn trọng tâm. Một hành trình.
            </h2>
            <p className="text-sm text-muted-foreground">Phạm vi sản phẩm dự kiến</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(({ number, icon: Icon, title, subtitle, description }) => (
              <article key={number} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-9 flex items-center justify-between">
                  <Icon className="text-primary" size={24} strokeWidth={1.5} aria-hidden="true" />
                  <span className="font-mono text-xs text-muted-foreground">{number}</span>
                </div>
                <h3 className="font-semibold tracking-tight">{title}</h3>
                <p className="mt-1 text-xs font-medium text-primary">{subtitle}</p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>
        <HealthPanel />
      </main>
      <footer className="flex flex-wrap justify-between gap-3 border-t border-border py-6 text-xs text-muted-foreground">
        <span>EMS · Event Management System</span>
        <span>Chuẩn bị tốt hơn. Kết nối trọn vẹn hơn.</span>
      </footer>
    </div>
  );
}
