import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Clock } from 'lucide-react';
import { DUMMY_POSTS } from './magazineData';
import BaseCard from '../../components/ui/BaseCard';

export default function WeddingMagazineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const post = DUMMY_POSTS.find(p => String(p.id) === id);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-text-muted">
        <p className="text-sm">아티클을 찾을 수 없어요.</p>
      </div>
    );
  }

  return (
    <div className="-mx-5 md:-mx-8 -mt-5 md:-mt-8 -mb-5 md:-mb-8">
      {/* 히어로 이미지 */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          type="button"
          onClick={() => navigate('/magazine')}
          className="absolute top-5 left-5 flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          목록으로
        </button>
        <div className="absolute bottom-5 left-5">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-[#463730] backdrop-blur-sm">
            {post.category}
          </span>
        </div>
      </div>

      {/* 본문 */}
      <div className="mx-auto max-w-2xl px-5 md:px-8 py-8 md:py-12">
        <BaseCard className="p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-text leading-tight mb-4">
            {post.title}
          </h1>

          {/* 메타 */}
          <div className="flex items-center gap-4 text-xs text-text-muted mb-8 pb-6 border-b border-border">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" strokeWidth={1.8} />
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.8} />
              {post.comments}
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.8} />
              {post.date}
            </span>
          </div>

          {/* 내용 */}
          <div className="text-sm md:text-base text-text leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </BaseCard>
      </div>
    </div>
  );
}
