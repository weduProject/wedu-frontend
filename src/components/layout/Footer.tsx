import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-4.4-1.2L3 20l1.2-5.1A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const FOOTER_COLUMNS = [
  {
    title: '서비스',
    links: [
      { label: '심리테스트', path: '/onboarding/quiz' },
      { label: '프로포즈 플래닝', path: '/shop' },
      { label: '나만의 프로포즈', path: '/builder-start' },
    ],
  },
  {
    title: '관리 도구',
    links: [
      { label: 'D-day 관리', path: '/dday' },
      { label: '예산 관리', path: '/budget' },
      { label: '체크리스트', path: '/checklist' },
      { label: '일정 관리', path: '/calendar' },
    ],
  },
  {
    title: '커뮤니티',
    links: [
      { label: '전체 게시글', path: '/community' },
      { label: '프로포즈 후기', path: '/community' },
      { label: '웨딩 팁', path: '/community' },
    ],
  },
];

const CUSTOMER_SERVICE_ITEMS = ['이용약관', '개인정보처리방침', '1:1 문의'];

const SOCIAL_LINKS = [
  { label: '인스타그램', Icon: InstagramIcon, href: 'https://www.instagram.com/wedu_startup?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
  { label: '카카오톡 채널', Icon: ChatIcon, href: '#' },
  { label: '유튜브', Icon: YoutubeIcon, href: '#' },
  { label: '이메일 문의', Icon: Mail, href: 'mailto:hello@wedu.com' },
];

export default function Footer() {
  return (
    <footer className="relative bg-background-100">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(254,171,160,0.3) 50%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-16 lg:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="mb-2 text-base font-semibold text-foreground-950">{column.title}</h4>
              <span className="mb-5 block h-px w-8 bg-primary-300" aria-hidden />
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm font-normal text-foreground-600 no-underline transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-2 text-base font-semibold text-foreground-950">고객센터</h4>
            <span className="mb-5 block h-px w-8 bg-primary-300" aria-hidden />
            <ul className="flex flex-col gap-2">
              {CUSTOMER_SERVICE_ITEMS.map((label) => (
                <li key={label}>
                  <span className="text-sm font-normal text-foreground-600">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-background-200/60 pt-[33px] sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-rosegold text-[48px] font-bold leading-[48px]">WEDU</span>
            <p className="mt-2 text-sm text-foreground-600/90">당신의 특별한 순간을 함께 준비합니다.</p>
          </div>

          <div className="flex items-center gap-5 sm:flex-col sm:items-end sm:gap-3">
            <span className="text-xs text-text-muted">© 2025 WEDU. All rights reserved.</span>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((item) => {
                const Icon = item.Icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:text-primary"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}