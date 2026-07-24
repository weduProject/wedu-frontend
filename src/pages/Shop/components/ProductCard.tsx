import { useNavigate } from 'react-router-dom';
import type { Product } from '../shopData';
import { Heart } from 'lucide-react';
import { useWishlist } from '../WishlistContext';
import { useAuth } from '../../../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isWished, toggleWish } = useWishlist();
  const liked = isWished(product.id);

  const handleWishClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleWish(product.id);
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#EAE4D8] bg-white">
      <div className="relative h-48 w-full bg-[#F2EEE6]">
        {product.image && (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover"
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
          className="group absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <Heart
            className={
              liked
                ? 'h-4 w-4 text-primary fill-primary'
                : 'h-4 w-4 text-[#5C4840] transition-colors group-hover:fill-primary group-hover:text-primary'
            }
            strokeWidth={1.8}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-base font-semibold text-[#0D0A09]">
          {product.title}
        </h3>

        <p className="mb-3 text-sm leading-6 text-[#7C6358]">
          {product.description}
        </p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[#FAF8F4] px-2 py-0.5 text-xs text-[#968178]"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-bold text-[#0D0A09]">
            {product.price}
          </span>
          <button
            type="button"
            onClick={() => navigate(`/shop/${product.id}`)}
            className="rounded-full bg-[#FC4A4D] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            상세보기
          </button>
        </div>
      </div>
    </article>
  );
}