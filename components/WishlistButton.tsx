'use client';

import { useState } from 'react';

export function WishlistButton({ productId, initialIsLiked = false }: { productId: number, initialIsLiked?: boolean }) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // 링크 이동 방지
    e.stopPropagation();

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isLiked) {
        await fetch(`/api/wishlists?productId=${productId}`, { method: 'DELETE' });
        setIsLiked(false);
      } else {
        await fetch(`/api/wishlists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
        setIsLiked(true);
      }
    } catch (err) {
      console.error(err);
      alert('위시리스트 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      type="button" 
      onClick={toggleWishlist} 
      disabled={isLoading}
      aria-label={isLiked ? "위시리스트에서 제거" : "위시리스트에 추가"}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: 'rgba(255, 255, 255, 0.8)',
        border: 'none',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "#ff4d4f" : "none"} stroke={isLiked ? "#ff4d4f" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}
