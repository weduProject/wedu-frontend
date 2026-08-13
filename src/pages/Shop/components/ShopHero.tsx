import shopHeroBg from '../../../assets/shop/hero.jpg';

export default function ShopHero() {
  return (
    <section className="relative">
      <div className="relative h-[658px] w-full overflow-hidden">
        <img
          src={shopHeroBg}
          alt="프로포즈 편집실"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.4) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/15 px-[17px] py-[7px] text-sm font-medium tracking-[2.8px] text-white/90 backdrop-blur-[6px]">
            Proposal Studio
          </span>
          <h1 className="max-w-3xl text-[60px] font-semibold leading-15 tracking-[-1.5px] text-white">프로포즈 편집실</h1>
          <p className="mt-6 max-w-xl text-lg leading-7 text-white/70">
            장소부터 선물, 특별한 경험까지.
            <br />
            당신의 완벽한 프로포즈를 위한 모든 것을 둘러보세요.
          </p>
        </div>
      </div>
    </section>
  );
}