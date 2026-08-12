import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, CalendarCheck, MessageCircleHeart, Image as ImageIcon, Landmark, Users, MapPin, Palette } from 'lucide-react'; // Remix Icon -> Lucide React 교체

type SectionKey = 'basic' | 'photos' | 'wedding' | 'message' | 'gallery' | 'account' | 'parents' | 'directions' | 'design';

interface SectionDef {
  key: SectionKey;
  label: string;
  icon: React.ElementType; // 아이콘 타입 변경
}

// Lucide 컴포넌트 매핑
const sections: SectionDef[] = [
  { key: 'basic', label: '기본 정보', icon: User },
  { key: 'photos', label: '사진', icon: Camera },
  { key: 'wedding', label: '예식 정보', icon: CalendarCheck },
  { key: 'message', label: '인사말', icon: MessageCircleHeart },
  { key: 'gallery', label: '갤러리', icon: ImageIcon },
  { key: 'account', label: '계좌 정보', icon: Landmark },
  { key: 'parents', label: '혼주·연락처', icon: Users },
  { key: 'directions', label: '오시는 길', icon: MapPin },
  { key: 'design', label: '디자인', icon: Palette },
];

const colorOptions = [
  { name: '로즈골드', value: '#C9A96E' },
  { name: '세이지 그린', value: '#9CAD8E' },
  { name: '소프트 핑크', value: '#E8C4C8' },
  { name: '차콜 그레이', value: '#4A4A4A' },
  { name: '네이비', value: '#2D3A4A' },
  { name: '라벤더', value: '#C4C4E0' },
  { name: '웜 아이보리', value: '#D4C5A9' },
  { name: '피치', value: '#E8C8A0' },
];

export default function InvitationCreatePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionKey>('basic');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [form, setForm] = useState({
    title: '',
    template_id: 'classic-ivory',
    main_color: '#C9A96E',
  });

  const updateField = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // 🚀 API 연동을 위한 임시저장 로직 수정
  const handleDraft = useCallback(async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      // API 통신 예시 (실제 백엔드 엔드포인트로 수정 필요)
      await fetch('/api/invitations/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'DRAFT' })
      });
      setSaveMessage({ type: 'success', text: '임시 저장되었습니다.' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  }, [form]);

  // 🚀 API 연동을 위한 발행 로직 수정
  const handlePublish = useCallback(async () => {
    setShowPublishModal(true);
    setIsPublished(false);
    
    try {
      // API 통신 예시 (실제 백엔드 엔드포인트로 수정 필요)
      const response = await fetch('/api/invitations/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'PUBLISHED' })
      });
      
      if (!response.ok) throw new Error('발행 실패');
      
      // 통신 성공 시 완료 모달 전환
      setIsPublished(true);
    } catch (error) {
      setShowPublishModal(false);
      alert('발행 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }, [form]);

  const currentSectionIdx = sections.findIndex((s) => s.key === activeSection);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="pt-20 pb-16">
        <div className="w-full px-4 md:px-10 lg:px-16">
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-[#C9A96E] tracking-[0.2em] uppercase font-bold mb-2">Create</p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  모바일 청첩장 만들기
                </h1>
              </div>
              {saveMessage && (
                <div className={`px-4 py-2 rounded-full text-xs font-medium shadow-sm ${
                  saveMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {saveMessage.text}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex justify-center sticky top-4 z-40 mb-8">
            <div className="w-full max-w-4xl flex items-center justify-center gap-1 bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-x-auto scrollbar-hide">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      activeSection === section.key
                        ? 'bg-[#C9A96E] text-white shadow-md shadow-[#C9A96E]/20 transform scale-[1.02]'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-12 min-h-[400px]">
              
              {activeSection === 'basic' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-[#C9A96E] rounded-full"></div>
                    기본 정보
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">청첩장 제목</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="예: 수지 ❤ 인준 결혼식에 초대합니다"
                        className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/30 focus:border-[#C9A96E] transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'design' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-[#C9A96E] rounded-full"></div>
                    디자인 색상 변경
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateField('main_color', color.value)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all cursor-pointer ${
                          form.main_color === color.value 
                            ? 'border-[#C9A96E] bg-[#fdfaf6] text-[#C9A96E] shadow-sm' 
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: color.value }}
                        ></span>
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeSection !== 'basic' && activeSection !== 'design' && (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <Palette className="h-8 w-8 text-gray-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-medium">해당 섹션 설정 영역입니다. (미리보기 모드)</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
                <button
                  onClick={() => {
                    const prevIdx = currentSectionIdx - 1;
                    if (prevIdx >= 0) setActiveSection(sections[prevIdx].key);
                  }}
                  disabled={currentSectionIdx === 0}
                  className="px-6 py-3 rounded-full text-sm font-bold text-gray-500 disabled:opacity-30 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  이전
                </button>

                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full">
                  {currentSectionIdx + 1} / {sections.length}
                </span>

                {currentSectionIdx < sections.length - 1 ? (
                  <button
                    onClick={() => {
                      const nextIdx = currentSectionIdx + 1;
                      if (nextIdx < sections.length) setActiveSection(sections[nextIdx].key);
                    }}
                    className="px-8 py-3 rounded-full text-sm font-bold bg-[#C9A96E] hover:bg-[#B8985D] text-white shadow-md shadow-[#C9A96E]/20 cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    다음
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDraft}
                      disabled={saving}
                      className="px-6 py-3 rounded-full text-sm font-bold border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 transition-all"
                    >
                      임시 저장
                    </button>
                    <button
                      onClick={handlePublish}
                      disabled={saving}
                      className="px-8 py-3 rounded-full text-sm font-bold bg-[#C9A96E] hover:bg-[#B8985D] text-white shadow-md shadow-[#C9A96E]/20 cursor-pointer transition-all hover:-translate-y-0.5"
                    >
                      발행하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPublishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => isPublished && setShowPublishModal(false)}
          ></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in border border-gray-100">
            {!isPublished ? (
              <div className="py-8">
                <div className="w-14 h-14 border-4 border-[#C9A96E]/20 border-t-[#C9A96E] rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">청첩장을 발행하고 있습니다...</h3>
                <p className="text-sm text-gray-500">잠시만 기다려주세요.</p>
              </div>
            ) : (
              <div className="py-4 animate-fade-in">
                <div className="w-16 h-16 bg-[#C9A96E]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#C9A96E] text-3xl shadow-inner">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">발행이 완료되었습니다!</h3>
                <p className="text-sm text-gray-500 mb-8">이제 소중한 사람들에게 청첩장을 공유해보세요.</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      alert('클립보드에 URL이 복사되었습니다!');
                    }}
                    className="w-full py-3.5 rounded-full text-[15px] font-bold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    URL 복사하기
                  </button>
                  <button
                    onClick={() => {
                      setShowPublishModal(false);
                      navigate('/invitation');
                    }}
                    className="w-full py-3.5 rounded-full text-[15px] font-bold bg-[#C9A96E] text-white hover:bg-[#B8985D] transition-colors shadow-md shadow-[#C9A96E]/20"
                  >
                    목록으로 돌아가기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
