'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="border-b" style={{ borderColor: '#E8E4DE' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍵</span>
            <h1 className="text-xl font-bold" style={{ color: '#2A1F14' }}>
              Tea Tea Note
            </h1>
          </div>
          <nav className="flex gap-4">
            {user ? (
              <Link href="/diary" className="btn-primary">
                내 일기
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary">
                  로그인
                </Link>
                <Link href="/signup" className="btn-primary">
                  시작하기
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* 히어로 */}
      <section className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-2xl">
          <div className="text-7xl mb-6">🍵</div>
          <h2 className="text-5xl font-bold mb-4" style={{ color: '#2A1F14' }}>
            나만의 차 이야기를 기록하세요
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            차를 마시는 순간의 감정, 향, 맛을 기록하고<br />
            찻집 방문 기억을 남겨보세요.
          </p>
          {!user && (
            <Link href="/signup" className="btn-primary inline-block text-lg px-8 py-3">
              무료로 시작하기
            </Link>
          )}
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="bg-white border-t" style={{ borderColor: '#E8E4DE' }}>
        <div className="max-w-6xl mx-auto px-4 py-24">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: '#2A1F14' }}>
            차 한 잔의 모든 기억
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="tea-card p-6">
              <div className="text-4xl mb-4">📝</div>
              <h4 className="text-lg font-bold mb-2" style={{ color: '#D4813A' }}>
                테이스팅 노트
              </h4>
              <p className="text-gray-600">
                향, 맛, 탕색, 우리기 조건 등 차의 모든 특징을 기록하세요.
              </p>
            </div>
            <div className="tea-card p-6">
              <div className="text-4xl mb-4">🏠</div>
              <h4 className="text-lg font-bold mb-2" style={{ color: '#6B8E6B' }}>
                찻집 방문기
              </h4>
              <p className="text-gray-600">
                찻집의 분위기, 서비스, 마신 차를 기록하고 평가하세요.
              </p>
            </div>
            <div className="tea-card p-6">
              <div className="text-4xl mb-4">📅</div>
              <h4 className="text-lg font-bold mb-2" style={{ color: '#D4813A' }}>
                차 일기
              </h4>
              <p className="text-gray-600">
                달력으로 나만의 차 기록을 돌아보고 공유하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t" style={{ borderColor: '#E8E4DE' }}>
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600 text-sm">
          <p>호랑티티 © 2026</p>
        </div>
      </footer>
    </div>
  );
}
