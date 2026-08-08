import { useNavigate } from 'react-router-dom';
import type { Product } from '../shopData';
import { Heart } from 'lucide-react';
import { useWishlist } from '../utils/useWishlist';
import { useAuth } from '../../../contexts/AuthContext';
import { formatWon } from '../utils/price';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isWished, toggleWish } = useWishlist();
  const liked = isWished(product.id);

  const handleWishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    toggleWish(product.id);
  };

  return (
    <div
      onClick={() => navigate(`/shop/${product.id}`)}
      className="group block cursor-pointer overflow-hidden rounded-2xl border border-[#E7E4E3]/60 bg-white transition-colors hover:border-[#D9C9C6]"
    >
      <div className="relative h-[231px] w-full overflow-hidden bg-[#F0EEED]">
        {product.image && (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-[#463730] backdrop-blur-sm">
          {product.category}
        </span>

        <button
          type="button"
          aria-label="찜하기"
          aria-pressed={liked}
          onClick={handleWishClick}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
        >
          <Heart
            className={liked ? 'h-4 w-4 fill-primary text-primary' : 'h-4 w-4 text-[#5C4840]'}
            strokeWidth={1.8}
          />
        </button>
      </div>

      <div className="p-5">
        <h3 className="mb-2 line-clamp-1 text-base font-semibold text-text">{product.title}</h3>
        <p className="mb-3 line-clamp-2 text-sm leading-6 text-[#7C6358]">{product.description}</p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {product.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-md bg-[#FAF8F4] px-2 py-0.5 text-xs text-text-muted">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#0C0B0A]">{formatWon(product.price)}</span>
          <span className="rounded-full bg-[linear-gradient(111.47deg,#F79689_0%,#E8796C_33.33%,#FEABA0_66.67%,#E8796C_100%)] px-4 py-2 text-xs font-semibold text-white">
            상세보기
          </span>
        </div>
      </div>
    </div>
  );
}