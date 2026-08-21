'use client';

import { useState } from 'react';
import { toggleWishlist } from '../actions/wishlist';

export default function WishlistButton({ productId }: { productId: number }) {
  const [active, setActive] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 낙관적 업데이트
    setActive(!active);
    try {
      await toggleWishlist(productId, active);
    } catch (error) {
      console.error(error);
      setActive(active); // 실패 시 롤백
      alert('위시리스트 추가/삭제에 실패했습니다. 로그인 상태를 확인해주세요.');
    }
  };

  return (
    <button 
      onClick={handleClick}
      aria-label={active ? "위시리스트 삭제" : "위시리스트 추가"}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 10,
        background: 'rgba(255,255,255,0.8)',
        border: 'none',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "var(--color-danger)" : "none"} stroke={active ? "var(--color-danger)" : "currentColor"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}
