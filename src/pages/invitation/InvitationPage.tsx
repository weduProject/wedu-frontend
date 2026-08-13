import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface InvitationTemplate {
  id: string;
  name: string;
  style: string;
  styleLabel: string;
  description: string;
  previewImage: string;
  detailImage: string;
  colors: string[];
  features: string[];
}

const invitationTemplates: InvitationTemplate[] = [
  {
    id: 'classic-ivory',
    name: '클래식 아이보리',
    style: 'classic',
    styleLabel: '클래식',
    description: '시간이 지나도 변하지 않는 우아함. 아이보리 톤의 전통적인 레이아웃에 금박 포인트로 품격을 더한 클래식 청첩장입니다.',
    previewImage: 'https://readdy.ai/api/search-image?query=Elegant%20classic%20ivory%20wedding%20invitation%20card%20design%20with%20gold%20foil%20accents%20delicate%20calligraphy%20and%20pressed%20cream%20roses%20flat%20lay%20on%20soft%20linen%20fabric%20background%20warm%20natural%20lighting%20editorial%20stationery%20photography%20with%20refined%20luxurious%20feel&width=800&height=1200&seq=invite-classic-01&orientation=portrait',
    detailImage: 'https://readdy.ai/api/search-image?query=Luxurious%20classic%20ivory%20wedding%20invitation%20suite%20displayed%20on%20marble%20surface%20with%20gold%20foil%20details%20cream%20silk%20ribbon%20wax%20seal%20and%20delicate%20floral%20arrangement%20of%20white%20garden%20roses%20and%20eucalyptus%20editorial%20flat%20lay%20photography%20with%20soft%20golden%20hour%20lighting%20elegant%20and%20timeless%20stationery%20design&width=1200&height=800&seq=invite-classic-detail-01&orientation=landscape',
    colors: ['#F5F0E8', '#D4C5A9', '#C9A96E', '#8B7355'],
    features: ['금박 엠보싱', '코튼 페이퍼', '실크 리본', '왁스씰 포함'],
  },
  {
    id: 'modern-minimal',
    name: '모던 미니멀',
    style: 'modern',
    styleLabel: '모던',
    description: '불필요한 요소를 덜어낸 절제된 아름다움. 깔끔한 산세리프 타이포그래피와 여백의 미학이 돋보이는 세련된 청첩장입니다.',
    previewImage: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20wedding%20invitation%20with%20clean%20sans%20serif%20typography%20simple%20geometric%20layout%20and%20subtle%20blind%20embossing%20on%20thick%20textured%20white%20card%20stock%20with%20botanical%20line%20art%20illustration%20editorial%20stationery%20design%20with%20generous%20white%20space&width=800&height=1200&seq=invite-modern-01&orientation=portrait',
    detailImage: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20wedding%20invitation%20suite%20with%20clean%20geometric%20typography%20blind%20debossed%20details%20and%20delicate%20line%20art%20botanical%20illustrations%20on%20textured%20cream%20paper%20flat%20lay%20with%20dried%20pampas%20grass%20and%20ceramic%20vase%20editorial%20stationery%20photography%20soft%20natural%20light&width=1200&height=800&seq=invite-modern-detail-01&orientation=landscape',
    colors: ['#FAFAFA', '#E8E4E1', '#2C2C2C', '#8E8E8E'],
    features: ['블라인드 엠보싱', '텍스처 카드지', '라인아트 일러스트', '반투명 봉투'],
  },
  {
    id: 'floral-romance',
    name: '플로럴 로맨스',
    style: 'floral',
    styleLabel: '로맨틱',
    description: '수채화로 그린 듯한 섬세한 플라워 일러스트가 사랑스러운 분위기를 자아냅니다. 봄, 여름 웨딩에 특히 잘 어울리는 디자인이에요.',
    previewImage: 'https://readdy.ai/api/search-image?query=Romantic%20wedding%20invitation%20with%20watercolor%20floral%20wreath%20illustration%20in%20soft%20blush%20pink%20peach%20and%20sage%20green%20tones%20elegant%20script%20calligraphy%20on%20textured%20ivory%20paper%20delicate%20botanical%20design%20with%20scattered%20petals%20editorial%20stationery%20photography&width=800&height=1200&seq=invite-floral-01&orientation=portrait',
    detailImage: 'https://readdy.ai/api/search-image?query=Romantic%20watercolor%20floral%20wedding%20invitation%20suite%20with%20blush%20pink%20roses%20and%20sage%20green%20foliage%20wreath%20design%20elegant%20calligraphy%20on%20handmade%20paper%20flat%20lay%20with%20fresh%20garden%20roses%20loose%20petals%20and%20silk%20ribbon%20editorial%20photography%20soft%20dreamy%20lighting%20pastel%20tones&width=1200&height=800&seq=invite-floral-detail-01&orientation=landscape',
    colors: ['#FDF2F4', '#E8C4C8', '#C49799', '#8B9D83'],
    features: ['수채화 일러스트', '핸드메이드 페이퍼', '드라이플라워 동봉', '컬러 봉투 포함'],
  },
  {
    id: 'vintage-heritage',
    name: '빈티지 헤리티지',
    style: 'vintage',
    styleLabel: '빈티지',
    description: '오래된 편지지에서 영감을 받은 디자인. 세피아 톤의 레이스 패턴과 앤티크한 타이포그래피로 특별한 추억을 담아보세요.',
    previewImage: 'https://readdy.ai/api/search-image?query=Vintage%20wedding%20invitation%20design%20with%20antique%20lace%20border%20patterns%20sepia%20toned%20background%20old%20style%20serif%20typography%20and%20ornate%20filigree%20details%20reminiscent%20of%20old%20love%20letters%20on%20aged%20parchment%20paper%20texture%20editorial%20stationery%20photography&width=800&height=1200&seq=invite-vintage-01&orientation=portrait',
    detailImage: 'https://readdy.ai/api/search-image?query=Vintage%20style%20wedding%20invitation%20suite%20with%20antique%20lace%20patterns%20sepia%20tones%20old%20fashioned%20letterpress%20details%20wax%20seal%20and%20dried%20lavender%20stems%20on%20aged%20wooden%20surface%20flat%20lay%20editorial%20photography%20with%20warm%20nostalgic%20lighting%20and%20soft%20shadows&width=1200&height=800&seq=invite-vintage-detail-01&orientation=landscape',
    colors: ['#F5EDE0', '#D4C5B2', '#A0846C', '#5C4A3A'],
    features: ['레터프레스 인쇄', '에이징 페이퍼', '레이스 패턴', '왁스씰 포함'],
  },
  {
    id: 'botanical-garden',
    name: '보태니컬 가든',
    style: 'floral',
    styleLabel: '로맨틱',
    description: '자연에서 영감을 받은 허브와 와일드플라워 모티브. 가든 웨딩이나 야외 예식을 계획 중인 커플에게 완벽한 선택입니다.',
    previewImage: 'https://readdy.ai/api/search-image?query=Botanical%20garden%20wedding%20invitation%20with%20delicate%20herb%20and%20wildflower%20illustrations%20in%20muted%20sage%20and%20dusty%20lavender%20tones%20elegant%20script%20typography%20on%20natural%20kraft%20textured%20paper%20organic%20garden%20inspired%20design%20editorial%20stationery%20photography&width=800&height=1200&seq=invite-botanical-01&orientation=portrait',
    detailImage: 'https://readdy.ai/api/search-image?query=Botanical%20garden%20style%20wedding%20invitation%20suite%20with%20pressed%20wildflowers%20and%20herbs%20sage%20green%20and%20lavender%20color%20palette%20natural%20kraft%20paper%20texture%20linen%20ribbon%20tied%20details%20flat%20lay%20on%20rustic%20wooden%20board%20with%20fresh%20herbs%20editorial%20photography%20soft%20diffused%20morning%20light&width=1200&height=800&seq=invite-botanical-detail-01&orientation=landscape',
    colors: ['#F7F4EF', '#D5DCC8', '#9CAD8E', '#6B7F6A'],
    features: ['보태니컬 일러스트', '크라프트 페이퍼', '린넨 리본', '프레스드 플라워'],
  },
  {
    id: 'midnight-elegance',
    name: '미드나잇 엘레강스',
    style: 'modern',
    styleLabel: '모던',
    description: '딥 네이비와 골드의 조화로운 대비. 이브닝 웨딩이나 겨울 시즌에 어울리는 고급스러운 디자인으로 특별함을 더합니다.',
    previewImage: 'https://readdy.ai/api/search-image?query=Elegant%20dark%20navy%20and%20gold%20wedding%20invitation%20with%20metallic%20gold%20foil%20text%20modern%20calligraphy%20on%20deep%20navy%20card%20stock%20dramatic%20contrast%20with%20subtle%20constellation%20or%20star%20pattern%20luxurious%20evening%20wedding%20stationery%20design%20editorial%20photography&width=800&height=1200&seq=invite-midnight-01&orientation=portrait',
    detailImage: 'https://readdy.ai/api/search-image?query=Luxurious%20navy%20blue%20and%20gold%20wedding%20invitation%20suite%20with%20gold%20foil%20details%20metallic%20accents%20dark%20card%20stock%20and%20modern%20calligraphy%20flat%20lay%20with%20gold%20geometric%20accessories%20brass%20candle%20holder%20and%20navy%20velvet%20ribbon%20editorial%20photography%20dramatic%20elegant%20lighting&width=1200&height=800&seq=invite-midnight-detail-01&orientation=landscape',
    colors: ['#1C2431', '#2D3A4A', '#C9A96E', '#E8D5B7'],
    features: ['골드 포일 프레스', '네이비 카드지', '메탈릭 디테일', '벨벳 리본'],
  },
];

const styleFilters = [
  { id: 'all', label: '전체' },
  { id: 'classic', label: '클래식' },
  { id: 'modern', label: '모던' },
  { id: 'floral', label: '로맨틱' },
  { id: 'vintage', label: '빈티지' },
];

const features = [
  { icon: 'ri-smartphone-line', title: '모바일 최적화', desc: '스마트폰에서 가장 아름답게 보이도록 디자인되어, 어디서든 편하게 공유할 수 있어요.' },
  { icon: 'ri-palette-line', title: '커스텀 컬러', desc: '원하는 컬러 팔레트로 변경 가능. 웨딩 테마에 딱 맞는 색감으로 완성해 드려요.' },
  { icon: 'ri-image-line', title: '포토 갤러리', desc: '웨딩 촬영본, 우정샷까지 여러 장의 사진을 갤러리 형태로 담을 수 있어요.' },
  { icon: 'ri-map-pin-line', title: '오시는 길', desc: '예식장 위치를 지도로 안내하고, 네비게이션 바로 연결까지 한 번에.' },
  { icon: 'ri-chat-heart-line', title: '방명록', desc: '하객들이 남기는 따뜻한 축하 메시지. 소중한 마음을 모아 간직할 수 있어요.' },
  { icon: 'ri-share-line', title: '간편 공유', desc: '카카오톡, 문자, 이메일로 간편하게 공유. 링크 하나면 충분해요.' },
];

export default function InvitationPage() {
  const [activeStyle, setActiveStyle] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplate | null>(null);

  const filteredTemplates = activeStyle === 'all'
    ? invitationTemplates
    : invitationTemplates.filter((t) => t.style === activeStyle);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=Editorial%20wedding%20stationery%20boutique%20atmosphere%20luxurious%20warm%20cream%20and%20champagne%20tones%20soft%20silk%20fabric%20and%20delicate%20dried%20flowers%20scattered%20on%20marble%20surface%20elegant%20calligraphy%20tools%20gold%20accents%20refined%20minimal%20composition%20with%20dreamy%20diffused%20backlight%20high%20end%20magazine%20aesthetic&width=1800&height=1200&seq=invitation-hero-v3&orientation=landscape"
            alt=""
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/25"></div>
        </div>

        <div className="absolute relative z-10 w-full px-6 md:px-10 lg:px-16 py-24 md:py-32">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-white/40"></div>
                <span className="text-white/60 text-xs md:text-sm tracking-[0.35em] uppercase font-bold">Mobile Invitation</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight leading-[1.08] mb-6">
                당신의 이야기를
                <br />
                가장 아름답게
                <br />
                <span className="italic font-normal">전하는 편지</span>
              </h1>
              <p className="text-white/80 text-sm md:text-base max-w-lg leading-relaxed mb-10 font-light">
                클래식부터 모던까지, 손끝에서 펼쳐지는 우아한 초대의 순간.
                당신만의 모바일 청첩장으로 소중한 사람들을 초대하세요.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#templates"
                  className="px-8 py-4 bg-[#B76E79] hover:bg-[#B8985D] text-white rounded-full text-sm font-bold shadow-lg shadow-[#C9A96E]/30 transition-all whitespace-nowrap hover:-translate-y-0.5"
                >
                  템플릿 둘러보기
                </a>
                <Link
                  to="/invitation/create"
                  className="px-8 py-4 rounded-full border border-white/40 text-white text-sm font-bold hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  시작하기
                </Link>
              </div>
            </div>

            <div className="flex-1 items-center justify-center relative h-[420px] md:h-[500px] hidden lg:flex">
              <div className="absolute animate-float-card-main w-[260px]">
                <div className="relative rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl shadow-black/25 overflow-hidden border border-white/50 p-5">
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent mb-4"></div>
                  <div className="text-center space-y-3">
                    <p className="text-[10px] text-gray-500 tracking-[0.25em] uppercase font-bold">Save the Date</p>
                    <p className="text-xl italic text-gray-800 font-bold">2026. 10. 24</p>
                    <p className="text-xs text-gray-500">토요일 오후 2시</p>
                    <div className="py-1.5">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-px bg-gray-300"></div>
                        <i className="ri-heart-fill text-[#C9A96E] text-base animate-heartbeat"></i>
                        <div className="w-8 h-px bg-gray-300"></div>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">수지</p>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight -mt-1">인준</p>
                    <div className="pt-2">
                      <p className="text-[11px] text-gray-500 leading-relaxed italic">
                        &ldquo;서로를 향한 마음이 하나 되는 날,<br />소중한 분들과 함께하고 싶습니다.&rdquo;
                      </p>
                    </div>
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="templates" className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between py-3 md:py-4">
            <p className="text-xs text-[#C9A96E] font-bold tracking-wider whitespace-nowrap hidden sm:block">FILTER BY STYLE</p>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-nowrap ml-auto sm:ml-0 pb-2 pt-1 px-1 -mx-1">
              {styleFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveStyle(filter.id)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    activeStyle === filter.id
                      ? 'bg-[#C9A96E] text-white shadow-md shadow-[#C9A96E]/20'
                      : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <p className="text-xs text-[#C9A96E] tracking-[0.2em] uppercase font-bold mb-3">Curated Collection</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">청첩장 템플릿</h2>
            </div>
            <p className="text-sm font-bold text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full hidden sm:block">{filteredTemplates.length}개의 디자인</p>
          </div>

          <div className="flex gap-6 md:gap-10 overflow-x-auto py-6 px-4 -mx-4 scrollbar-hide snap-x snap-mandatory">
            {filteredTemplates.map((template, idx) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className="group flex-shrink-0 snap-start cursor-pointer animate-float-up"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <div className="relative w-[260px] md:w-[320px]">
                  <div className="relative rounded-[2.5rem] md:rounded-[3rem] border-[3px] border-gray-100 bg-white p-2.5 md:p-3 transition-all duration-500 group-hover:border-[#C9A96E]/50 group-hover:shadow-[0_20px_40px_-15px_rgba(201,169,110,0.3)] group-hover:-translate-y-2">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-24 h-6 md:h-7 bg-gray-100 rounded-b-2xl z-10 transition-colors group-hover:bg-[#f8f5f0]"></div>
                    <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-gray-100 aspect-[9/16]">
                      <img
                        src={template.previewImage}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[11px] md:text-xs font-bold text-gray-800 shadow-sm">
                        {template.styleLabel}
                      </div>
                      {idx === 0 && (
                        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#C9A96E] text-[11px] font-bold text-white shadow-md">
                          인기
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#C9A96E] transition-colors">
                      {template.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      {template.colors.slice(0, 3).map((color, i) => (
                        <div
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-gray-200 transition-transform group-hover:scale-110 shadow-sm"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-6 md:px-10 lg:px-16 py-16 md:py-24 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="text-xs text-[#C9A96E] tracking-[0.2em] uppercase font-bold mb-3">Details</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">특별함을 더하는 디테일</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-transparent hover:bg-white hover:border-[#C9A96E]/30 hover:shadow-lg hover:shadow-[#C9A96E]/5 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:border-[#C9A96E]/30 transition-colors shadow-sm">
                      <i className={`${feat.icon} text-xl text-[#C9A96E]`}></i>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-gray-900 mb-1.5">{feat.title}</h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DdayPreviewCard />
          </div>
        </div>
      </section>

      {selectedTemplate && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedTemplate(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
          <div
            className="relative z-10 bg-white rounded-3xl md:rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors z-20 cursor-pointer text-gray-600 hover:text-gray-900"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-[3/4] md:aspect-auto overflow-hidden bg-gray-100">
                <img src={selectedTemplate.detailImage} alt={selectedTemplate.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mb-4 w-fit">
                  {selectedTemplate.styleLabel}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{selectedTemplate.name}</h2>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8">{selectedTemplate.description}</p>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Color Palette</h4>
                    <div className="flex gap-2">
                      {selectedTemplate.colors.map((color, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color }}></div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  to="/invitation/create"
                  onClick={() => setSelectedTemplate(null)}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-bold bg-[#C9A96E] hover:bg-[#B8985D] text-white shadow-lg shadow-[#C9A96E]/30 whitespace-nowrap self-start transition-all hover:-translate-y-0.5"
                >
                  이 템플릿으로 시작하기
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DdayPreviewCard() {
  const [timeLeft, setTimeLeft] = useState({ days: '80', hours: '14', mins: '32' });

  useEffect(() => {
    const target = new Date('2026-10-24T14:00:00').getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: '0', hours: '0', mins: '0' });
        clearInterval(timer);
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-full">
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <p className="text-xs text-[#C9A96E] tracking-[0.2em] uppercase mb-4 font-bold">Save the Date</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
          수지 <span className="text-[#C9A96E] font-normal italic">&amp;</span> 인준
        </h2>
        <p className="text-[15px] font-medium text-gray-500 mb-8">2026년 10월 24일 토요일 오후 2시</p>
        
        <div className="inline-flex items-center gap-4 md:gap-6 px-8 py-5 md:px-10 md:py-6 bg-white rounded-2xl border border-gray-100 mb-10 shadow-sm">
          {[
            { value: timeLeft.days, unit: 'DAYS' },
            { value: timeLeft.hours, unit: 'HOURS' },
            { value: timeLeft.mins, unit: 'MINS' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 md:gap-6">
              {i > 0 && <div className="w-px h-8 bg-gray-200"></div>}
              <div className="text-center min-w-[48px]">
                <p className="text-2xl md:text-3xl font-bold text-[#C9A96E] tabular-nums tracking-tight">{item.value}</p>
                <p className="text-[10px] md:text-xs text-gray-400 tracking-widest font-bold mt-1">{item.unit}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Link
          to="/invitation/create"
          className="px-8 py-4 rounded-full text-[15px] font-bold bg-[#C9A96E] hover:bg-[#B8985D] text-white shadow-lg shadow-[#C9A96E]/30 transition-all whitespace-nowrap hover:-translate-y-0.5"
        >
          나만의 청첩장 만들기
        </Link>
      </div>
    </div>
  );
}
