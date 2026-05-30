'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ShareTearoomPage() {
  const params = useParams();
  const token = params.token as string;

  const [visit, setVisit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVisit = async () => {
      const { data } = await supabase
        .from('tearoom_visits')
        .select('*')
        .eq('share_token', token)
        .eq('is_public', true)
        .single();

      if (data) {
        setVisit(data);
      }
      setLoading(false);
    };

    loadVisit();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">공유된 방문기를 찾을 수 없습니다</p>
      </div>
    );
  }

  const data = visit.data || {};

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b" style={{ borderColor: '#E8E4DE' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← 돌아가기
          </Link>
          <Link href="/auth/login" className="btn-primary px-4 py-2">
            로그인
          </Link>
        </div>
      </header>

      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="tea-card p-8">
          {/* 제목 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#2A1F14' }}>
              {visit.tearoom_name}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span>{visit.location}</span>
              <span>{visit.visited_at}</span>
              <span>{visit.mood}</span>
            </div>
          </div>

          {/* 분위기 */}
          <div className="mb-8 p-4 rounded" style={{ backgroundColor: '#FAFAF7' }}>
            <h2 className="font-bold mb-4" style={{ color: '#2A1F14' }}>
              분위기
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {data.companion && (
                <div>
                  <p className="text-gray-600">동반자</p>
                  <p className="font-bold">{data.companion}</p>
                </div>
              )}
              {data.interior_style && (
                <div>
                  <p className="text-gray-600">인테리어</p>
                  <p className="font-bold">{data.interior_style}</p>
                </div>
              )}
              {data.crowd_level && (
                <div>
                  <p className="text-gray-600">혼잡도</p>
                  <p className="font-bold">{data.crowd_level}</p>
                </div>
              )}
              {data.noise_level && (
                <div>
                  <p className="text-gray-600">소음</p>
                  <p className="font-bold">{data.noise_level}</p>
                </div>
              )}
            </div>
          </div>

          {/* 평가 */}
          {(data.service_rating || data.cleanliness_rating || data.value_rating) && (
            <div className="mb-8">
              <h2 className="font-bold mb-4" style={{ color: '#2A1F14' }}>
                평가
              </h2>
              <div className="space-y-3">
                {[
                  { key: 'service_rating', label: '서비스' },
                  { key: 'cleanliness_rating', label: '청결도' },
                  { key: 'value_rating', label: '가성비' },
                ].map(({ key, label }) => {
                  const value = data[key as keyof typeof data];
                  if (!value) return null;
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{label}</span>
                        <span className="text-sm font-bold" style={{ color: '#6B8E6B' }}>
                          {value}/5
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(value / 5) * 100}%`,
                            backgroundColor: '#6B8E6B',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 편의시설 */}
          {(data.wifi || data.pet_friendly || data.outdoor_seating || data.parking) && (
            <div className="mb-8 p-4 rounded" style={{ backgroundColor: '#FAFAF7' }}>
              <h2 className="font-bold mb-4" style={{ color: '#2A1F14' }}>
                편의시설
              </h2>
              <div className="space-y-2 text-sm">
                {data.wifi && <p>✓ WiFi</p>}
                {data.pet_friendly && <p>✓ 반려동물 동반 가능</p>}
                {data.outdoor_seating && <p>✓ 야외 좌석</p>}
                {data.parking && <p>주차: {data.parking}</p>}
              </div>
            </div>
          )}

          {/* 메모 */}
          {data.memo && (
            <div className="mb-8 p-4 rounded" style={{ backgroundColor: '#FAFAF7' }}>
              <h2 className="font-bold mb-2" style={{ color: '#2A1F14' }}>
                메모
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{data.memo}</p>
            </div>
          )}

          {/* 종합 평가 */}
          {visit.rating_overall && (
            <div className="text-sm">
              <p className="text-gray-600 mb-1">종합 평가</p>
              <p className="text-2xl">{'⭐'.repeat(visit.rating_overall)}</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: '#E8E4DE' }}>
            <p className="text-center text-gray-600 mb-4">
              나도 나만의 차 이야기를 기록하고 싶다면?
            </p>
            <Link
              href="/auth/login"
              className="block w-full text-center py-3 rounded-lg font-bold"
              style={{ backgroundColor: '#6B8E6B', color: 'white' }}
            >
              Tea Tea Note 시작하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
