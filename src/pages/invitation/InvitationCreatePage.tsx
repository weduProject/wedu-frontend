import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type SectionKey =
  | 'basic'
  | 'photos'
  | 'wedding'
  | 'message'
  | 'gallery'
  | 'account'
  | 'parents'
  | 'directions'
  | 'design';

interface SectionDef {
  key: SectionKey;
  label: string;
  icon: string;
}

const sections: SectionDef[] = [
  { key: 'basic', label: '기본 정보', icon: 'ri-user-line' },
  { key: 'photos', label: '사진', icon: 'ri-camera-line' },
  { key: 'wedding', label: '예식 정보', icon: 'ri-calendar-check-line' },
  { key: 'message', label: '인사말', icon: 'ri-chat-heart-line' },
  { key: 'gallery', label: '갤러리', icon: 'ri-image-line' },
  { key: 'account', label: '계좌 정보', icon: 'ri-bank-line' },
  { key: 'parents', label: '혼주·연락처', icon: 'ri-user-heart-line' },
  { key: 'directions', label: '오시는 길', icon: 'ri-map-pin-line' },
  { key: 'design', label: '디자인', icon: 'ri-palette-line' },
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

interface GalleryItem {
  url: string;
  order: number;
}

export default function InvitationCreatePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionKey>('basic');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    title: '',
    template_id: 'classic-ivory',
    groom_name: '',
    bride_name: '',
    groom_photo: '',
    bride_photo: '',
    groom_contact: '',
    bride_contact: '',
    groom_parents: '',
    bride_parents: '',
    wedding_date: '',
    wedding_time: '',
    venue_name: '',
    venue_address: '',
    venue_detail: '',
    latitude: '',
    longitude: '',
    main_greeting: '',
    invitation_message: '',
    additional_message: '',
    gallery_images: [] as GalleryItem[],
    groom_bank: '',
    groom_account: '',
    groom_account_holder: '',
    bride_bank: '',
    bride_account: '',
    bride_account_holder: '',
    groom_parent_contact: '',
    bride_parent_contact: '',
    transport_guide: '',
    parking_guide: '',
    public_transport_guide: '',
    main_color: '#C9A96E',
    font_family: 'serif',
    bgm_url: '',
  });

  const updateField = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback((publish: boolean) => {
    setSaving(true);
    setSaveMessage(null);

    setTimeout(() => {
      setSaving(false);
      setSaveMessage({
        type: 'success',
        text: publish ? '청첩장이 발행되었습니다!' : '임시 저장되었습니다.',
      });
      if (publish) {
        navigate('/invitation');
      }
    }, 600);
  }, [navigate]);

  const handlePublish = useCallback(() => handleSave(true), [handleSave]);
  const handleDraft = useCallback(() => handleSave(false), [handleSave]);

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

          <div className="hidden md:flex justify-center sticky top-4 z-50 mb-8">
            <div className="w-full max-w-4xl flex items-center justify-center gap-1 bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-x-auto scrollbar-hide">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    activeSection === section.key
                      ? 'bg-[#C9A96E] text-white shadow-md shadow-[#C9A96E]/20 transform scale-[1.02]'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <i className={`${section.icon} text-sm`}></i>
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm -mx-4 px-4 py-3 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    activeSection === section.key
                      ? 'bg-[#C9A96E] text-white shadow-md shadow-[#C9A96E]/20'
                      : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              ))}
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
                    <i className="ri-tools-line text-2xl text-gray-300"></i>
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
    </div>
  );
}
