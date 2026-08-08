import { useState, useMemo, useEffect } from 'react';
import clsx from 'clsx';
import { Check, Edit2, Trash2, Plus, X } from 'lucide-react';

import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';

type CategoryTab = '예식장' | '예물' | '신혼여행';

interface EstimateItem {
  id: string;
  category: CategoryTab;
  item_name: string;
  planned: number;
  actual: number;
  is_paid: boolean;
}

// 초기 템플릿 더미 데이터
const INITIAL_ITEMS: EstimateItem[] = [
  { id: '1', category: '예식장', item_name: '웨딩홀 대관료', planned: 15000000, actual: 0, is_paid: false },
  { id: '2', category: '예식장', item_name: '식사 비용', planned: 8000000, actual: 8000000, is_paid: true },
  { id: '3', category: '예식장', item_name: '꽃 장식', planned: 3000000, actual: 2500000, is_paid: true },
  { id: '4', category: '예식장', item_name: '사회자/축가', planned: 1000000, actual: 0, is_paid: false },
  { id: '5', category: '예식장', item_name: '웨딩 촬영', planned: 2000000, actual: 0, is_paid: false },
  
  { id: '6', category: '예물', item_name: '예복 (드레스)', planned: 1500000, actual: 0, is_paid: false },
  { id: '7', category: '예물', item_name: '예복 (턱시도)', planned: 500000, actual: 0, is_paid: false },
  { id: '8', category: '예물', item_name: '예단/예물 세트', planned: 3000000, actual: 0, is_paid: false },
  { id: '9', category: '예물', item_name: '예물 보관함', planned: 200000, actual: 0, is_paid: false },
];

const formatWon = (n: number) => '₩' + n.toLocaleString('ko-KR');

export default function WeddingEstimatePage() {
  const [activeTab, setActiveTab] = useState<CategoryTab>('예식장');
  const [items, setItems] = useState<EstimateItem[]>(() => {
    const saved = localStorage.getItem('wedding_estimate_items');
    if (saved) {
      return JSON.parse(saved);
    }
    return INITIAL_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('wedding_estimate_items', JSON.stringify(items));
  }, [items]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPlanned, setNewItemPlanned] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlanned, setEditPlanned] = useState('');
  const [editActual, setEditActual] = useState('');

  const tabs: CategoryTab[] = ['예식장', '예물', '신혼여행'];

  const filteredItems = useMemo(() => items.filter(item => item.category === activeTab), [items, activeTab]);
  
  const totalPlanned = useMemo(() => items.reduce((sum, item) => sum + item.planned, 0), [items]);
  const totalActual = useMemo(() => items.reduce((sum, item) => sum + item.actual, 0), [items]);
  const remainingBudget = totalPlanned - totalActual;

  const tabSubtotalPlanned = filteredItems.reduce((sum, item) => sum + item.planned, 0);
  const tabSubtotalActual = filteredItems.reduce((sum, item) => sum + item.actual, 0);

  const handleTogglePaid = (id: string) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const isNowPaid = !item.is_paid;
      const newActual = isNowPaid 
        ? (item.actual === 0 ? item.planned : item.actual) 
        : 0;
      return { ...item, is_paid: isNowPaid, actual: newActual };
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPlanned.trim()) return;

    const planned = parseInt(newItemPlanned.replace(/,/g, ''), 10);
    if (isNaN(planned) || planned < 0) return;

    const newItem: EstimateItem = {
      id: Date.now().toString(),
      category: activeTab,
      item_name: newItemName.trim(),
      planned,
      actual: 0,
      is_paid: false,
    };

    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemPlanned('');
    setShowAddForm(false);
  };

  const handleUpdateItem = (id: string) => {
    const planned = parseInt(editPlanned.replace(/,/g, ''), 10) || 0;
    const actual = parseInt(editActual.replace(/,/g, ''), 10) || 0;

    setItems(items.map(item => {
      if (item.id !== id) return item;
      const newIsPaid = actual > 0 ? true : false;
      return { ...item, planned, actual, is_paid: newIsPaid };
    }));
    
    setEditingId(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="mx-auto max-w-5xl pb-20">
      
      {/* 1. 페이지 헤더 */}
      <div className="mb-10 text-center">
        <p className="mb-2 font-serif text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Wedding Estimate
        </p>
        <h2 className="mb-3 font-serif text-3xl font-bold text-text md:text-4xl">
          웨딩 견적
        </h2>
        <p className="text-sm text-text-muted">
          예식장, 예물, 신혼여행까지 — 큰 항목별로 예상 비용과 실제 지출을 비교해보세요.<br/>
          파트너와 함께 관리하면 더 편리해요.
        </p>
      </div>

      {/* 2. 전체 요약 카드 */}
      <div className="mb-10 mx-auto flex w-full max-w-4xl items-center justify-center rounded-[3rem] border border-border bg-white px-6 py-8 shadow-sm md:px-12 md:py-10">
        <div className="flex w-full flex-row items-center justify-center">
          <div className="flex flex-1 flex-col items-start">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted md:text-xs">전체 예상 비용</p>
            <p className="font-serif text-xl font-semibold text-text sm:text-2xl md:text-4xl">{formatWon(totalPlanned)}</p>
          </div>
          <div className="mx-2 h-10 w-px bg-border md:mx-6 md:h-16" />
          <div className="flex flex-1 flex-col items-start">
            <p className="mb-2 text-sm  font-semibold uppercase tracking-widest text-text-muted md:text-xs">실제 지출</p>
            <p className="font-serif text-xl font-semibold text-primary sm:text-2xl md:text-4xl">{formatWon(totalActual)}</p>
          </div>
          <div className="mx-2 h-10 w-px bg-border md:mx-6 md:h-16" />
          <div className="flex flex-1 flex-col items-start">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-muted md:text-xs">
              {remainingBudget >= 0 ? '남은 예산' : '초과 금액'}
            </p>
            <p className={clsx('font-serif text-xl font-semibold sm:text-2xl md:text-4xl', remainingBudget >= 0 ? 'text-[#C89B7B]' : 'text-red-500')}>
              {formatWon(Math.abs(remainingBudget))}
            </p>
          </div>
        </div>
      </div>

      {/* 3. 탭 버튼 */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-full border border-border bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition-all',
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:text-text'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 4. 항목 리스트 카드 */}
      <div className="mb-10 mx-auto flex flex-col w-full max-w-4xl rounded-[3rem] border border-border bg-white shadow-sm overflow-hidden">
      {/* <BaseCard className="overflow-hidden shadow-sm rounded-[3rem]"> */}
        
        {/* 카드 헤더 */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <h3 className="font-serif text-xl font-bold text-text">{activeTab} 항목</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light/50 text-primary transition-colors hover:bg-primary-light"
          >
            {showAddForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>

        {/* 항목 추가 폼 */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="flex flex-col gap-3 border-b border-border bg-[#FAFAFA] p-6 sm:flex-row">
            <div className="flex-1">
              <TextField
                placeholder="항목 이름"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <TextField
                placeholder="예상 금액"
                type="number"
                value={newItemPlanned}
                onChange={(e) => setNewItemPlanned(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={!newItemName.trim() || !newItemPlanned.trim()} className="h-10.5 sm:w-24">
              추가
            </Button>
          </form>
        )}

        {/* 리스트 영역 */}
        <div className="flex flex-col">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-md text-text-muted">등록된 항목이 없습니다.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-border/50 p-6 last:border-0 hover:bg-[#FAFAFA]/50 transition-colors">
                
                {editingId === item.id ? (
                  // 수정 모드
                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                    <span className="flex-1 text-sm font-medium text-text">{item.item_name}</span>
                    <TextField
                      placeholder="예상"
                      type="number"
                      value={editPlanned}
                      onChange={(e) => setEditPlanned(e.target.value)}
                      className="w-full sm:w-32"
                    />
                    <TextField
                      placeholder="실제"
                      type="number"
                      value={editActual}
                      onChange={(e) => setEditActual(e.target.value)}
                      className="w-full sm:w-32"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateItem(item.id)} className="h-[42px] px-4 text-xs">
                        저장
                      </Button>
                      <Button variant="secondary" onClick={() => setEditingId(null)} className="h-[42px] px-4 text-xs">
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 읽기 모드
                  <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      {/* 체크 박스 */}
                      <button
                        onClick={() => handleTogglePaid(item.id)}
                        className={clsx(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors',
                          item.is_paid ? 'bg-primary text-white' : 'bg-gray-100 border border-gray-200 text-transparent hover:border-primary'
                        )}
                      >
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </button>
                      
                      {/* 텍스트 정보 */}
                      <div className="min-w-0">
                        <p className={clsx('truncate text-md font-bold', item.is_paid ? 'text-text' : 'text-text')}>
                          {item.item_name}
                        </p>
                        <p className="mt-0.5 flex items-center text-sm text-text-muted">
                          예상 {formatWon(item.planned)}
                          {item.is_paid && item.actual > 0 && (
                            <span className="ml-2 text-primary">
                              → 실제 {formatWon(item.actual)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditPlanned(String(item.planned));
                          setEditActual(String(item.actual));
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-gray-100 hover:text-text"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 하단 소계 */}
        {filteredItems.length > 0 && (
          <div className="flex items-center justify-between bg-[#FAFAFA] p-6">
            <span className="text-md font-bold text-text">{activeTab} 소계</span>
            <div className="text-right">
              <p className="text-base font-bold text-text">{formatWon(tabSubtotalPlanned)}</p>
              {tabSubtotalActual > 0 && (
                <p className="mt-0.5 text-xs text-primary">실제 {formatWon(tabSubtotalActual)}</p>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}