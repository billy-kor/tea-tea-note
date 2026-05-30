'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function TearoomDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [visit, setVisit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadVisit = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from('tearoom_visits')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setVisit(data);
      }
      setLoading(false);
    };

    loadVisit();
  }, [id, router]);

  const handleShare = async () => {
    if (!visit) return;

    try {
      const shareUrl = `${window.location.origin}/share/tearoom/${visit.share_token}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('클립보드 복사 실패');
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('tearoom_visits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      router.push('/diary');
    } catch (err: any) {
      alert('삭제 실패: ' + err.message);
    }
  };

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
        <p className="text-gray-600">방문기를 찾을 수 없습니다</p>
      </div>
    );
  }

  const data = visit.data || {};

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b" style={{ borderColor: '#E8E4DE' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/diary" className="text-gray-600 hover:text-gray-900">
            ← 돌아가기
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded text-sm font-medium"
              style={{ backgroundColor: '#6B8E6B', color: 'white' }}
            >
              {copied ? '✓ 복사됨' : '공유'}
            </button>
            <Link
              href={`/diary/tearoom/${id}/edit`}
              className="px-4 py-2 rounded text-sm font-medium border"
              style={{ borderColor: '#E8E4DE', color: '#2A1F14' }}
            >
              수정
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded text-sm font-medium border"
              style={{ borderColor: '#E8E4DE', color: '#DC143C' }}
            >
              삭제
            </button>
          </div>
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
        </div>
      </div>
    </div>
  );
}
