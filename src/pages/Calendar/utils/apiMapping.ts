import type { ScheduleItem } from '../CalendarPage';
import { toBackendCategory, toFrontCategory } from './categoryMap';

interface BackendEvent {
  eventId: number;
  title: string;
  eventDate: string; // "2026-08-06"
  eventAt: string;   // "2026-08-06T14:00:00.000Z"
  category: string;
  memo: string | null;
}

// 백엔드 응답 → 프론트 ScheduleItem
export function fromBackendEvent(raw: BackendEvent): ScheduleItem {
  const timePart = raw.eventAt?.split('T')[1]?.slice(0, 5) ?? '00:00'; // "14:00"
  return {
    id: String(raw.eventId),
    title: raw.title,
    date: raw.eventDate,
    time: timePart,
    category: toFrontCategory(raw.category),
    memo: raw.memo ?? '',
  };
}

// 프론트 → 백엔드로 보낼 요청 바디
export function toBackendPayload(item: Omit<ScheduleItem, 'id'>) {
  return {
    title: item.title,
    eventDate: item.date,
    eventAt: `${item.date}T${item.time}:00.000Z`,
    category: toBackendCategory(item.category),
    memo: item.memo ?? '',
  };
}