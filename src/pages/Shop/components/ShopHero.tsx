export default function ShopHero() {
  return (
    <section className="relative">
      <div className="relative h-[658px] w-full overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Romantic%20proposal%20planning%20workspace%20with%20soft%20warm%20cream%20and%20blush%20tones%2C%20elegant%20stationery%20and%20flower%20arrangement%20on%20marble%20desk%2C%20rose%20gold%20accessories%2C%20editorial%20flat%20lay%20photography%20with%20diffused%20natural%20light%2C%20sophisticated%20feminine%20aesthetic%2C%20minimal%20composition&width=1600&height=600&seq=propose-hero-v3&orientation=landscape"
          alt="프로포즈 편집실"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.4) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/15 px-[17px] py-[7px] text-sm font-medium tracking-[2.8px] text-white/90 backdrop-blur-[6px]">
            Proposal Studio
          </span>
          <h1 className="max-w-3xl text-[60px] font-semibold leading-15 tracking-[-1.5px] text-white">프로포즈 편집실</h1>
          <p className="mt-6 max-w-xl text-lg leading-7 text-white/70">장소부터 선물, 특별한 경험까지. 당신의 완벽한 프로포즈를 위한 모든 것을 둘러보세요.</p>
        </div>
      </div>
    </section>
  );
}