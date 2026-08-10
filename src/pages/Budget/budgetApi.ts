import { apiFetch } from '../../lib/apiClient';
import type { ApiEnvelope } from '../../lib/apiClient';
import type { BudgetItem } from './hooks/useBudget';

// 1. 조회 (GET)
export async function fetchBudgetItems() {
  const res = await apiFetch('/api/budget-items');
  const body: ApiEnvelope<BudgetItem[]> = await res.json();
  if (!body.success) throw new Error('조회 실패');
  return body.data;
}

// 2. 생성 (POST)
export async function createBudgetItem(newItem: Omit<BudgetItem, 'id'>) {
  const res = await apiFetch('/api/budget-items', {
    method: 'POST',
    body: JSON.stringify(newItem),
  });
  const body: ApiEnvelope<BudgetItem> = await res.json();
  if (!body.success) throw new Error('생성 실패');
  return body.data;
}

// 3. 수정 (PUT)
export async function editBudgetItem(itemId: string, updates: Partial<BudgetItem>) {
  const res = await apiFetch(`/api/budget-items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  const body: ApiEnvelope<BudgetItem> = await res.json();
  if (!body.success) throw new Error('수정 실패');
  return body.data;
}

// 4. 상태 변경 (PATCH)
export async function patchBudgetCompletion(itemId: string) {
  const res = await apiFetch(`/api/budget-items/${itemId}/completion`, {
    method: 'PATCH',
  });
  const body: ApiEnvelope<boolean> = await res.json();
  if (!body.success) throw new Error('상태 변경 실패');
  return body.data;
}

// 5. 삭제 (DELETE)
export async function removeBudgetItem(itemId: string) {
  const res = await apiFetch(`/api/budget-items/${itemId}`, {
    method: 'DELETE',
  });
  const body: ApiEnvelope<null> = await res.json();
  if (!body.success) throw new Error('삭제 실패');
  return body.success;
}