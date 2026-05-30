'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ShareTastingPage() {
  const params = useParams();
  const token = params.token as string;

  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      const { data } = await supabase
        .from('tasting_notes')
        .select('*')
        .eq('share_token', token)
        .eq('is_public', true)
        .single();

      if (data) {
        setNote(data);
      }
      setLoading(false);
    };

    loadNote();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">공유된 노트를 찾을 수 없습니다</p>
      </div>
    );
  }

  const data = note.data || {};

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
              {note.tea_name}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span>{note.tea_type}</span>
              <span>{note.noted_at}</span>
              <span>{note.mood}</span>
            </div>
          </div>

          {/* 탕색 */}
          {note.color && (
            <div className="mb-8 flex items-center gap-4">
              <div
                className="w-24 h-24 rounded-full border-2"
                style={{
                  backgroundColor: note.color,
                  borderColor: '#E8E4DE',
                }}
              />
              <div>
                <p className="text-sm text-gray-600">탕색</p>
                <p className="font-bold">{note.color}</p>
              </div>
            </div>
          )}

          {/* 우리기 조건 */}
          {data.brewing && Object.values(data.brewing).some((v) => v) && (
            <div className="mb-8 p-4 rounded" style={{ backgroundColor: '#FAFAF7' }}>
              <h2 className="font-bold mb-4" style={{ color: '#2A1F14' }}>
                우리기 조건
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {data.brewing.water_temp && (
                  <div>
                    <p className="text-gray-600">물 온도</p>
                    <p className="font-bold">{data.brewing.water_temp}°C</p>
                  </div>
                )}
                {data.brewing.water_amount && (
                  <div>
                    <p className="text-gray-600">물 양</p>
                    <p className="font-bold">{data.brewing.water_amount}ml</p>
                  </div>
                )}
                {data.brewing.tea_amount && (
                  <div>
                    <p className="text-gray-600">차 양</p>
                    <p className="font-bold">{data.brewing.tea_amount}g</p>
                  </div>
                )}
                {data.brewing.steeping_time && (
                  <div>
                    <p className="text-gray-600">우리는 시간</p>
                    <p className="font-bold">{data.brewing.steeping_time}초</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 맛 강도 */}
          {data.flavor_intensity && (
            <div className="mb-8">
              <h2 className="font-bold mb-4" style={{ color: '#2A1F14' }}>
                맛 강도
              </h2>
              <div className="space-y-3">
                {[
                  { key: 'sweetness', label: '단맛' },
                  { key: 'bitterness', label: '쓴맛' },
                  { key: 'astringency', label: '떫은맛' },
                  { key: 'umami', label: '감칠맛' },
                  { key: 'body', label: '바디감' },
                  { key: 'smoothness', label: '부드러움' },
                ].map(({ key, label }) => {
                  const value = data.flavor_intensity[key as keyof typeof data.flavor_intensity];
                  if (!value) return null;
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{label}</span>
                        <span className="text-sm font-bold" style={{ color: '#D4813A' }}>
                          {value}/5
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(value / 5) * 100}%`,
                            backgroundColor: '#D4813A',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 기타 정보 */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {data.origin && (
              <div>
                <p className="text-sm text-gray-600 mb-1">산지</p>
                <p className="font-bold">{data.origin}</p>
              </div>
            )}
            {data.purchase_place && (
              <div>
                <p className="text-sm text-gray-600 mb-1">구입처</p>
                <p className="font-bold">{data.purchase_place}</p>
              </div>
            )}
            {data.pairing && (
              <div>
                <p className="text-sm text-gray-600 mb-1">페어링</p>
                <p className="font-bold">{data.pairing}</p>
              </div>
            )}
            {data.rating && (
              <div>
                <p className="text-sm text-gray-600 mb-1">별점</p>
                <p className="text-2xl">{'⭐'.repeat(data.rating)}</p>
              </div>
            )}
          </div>

          {/* 메모 */}
          {data.memo && (
            <div className="mb-8 p-4 rounded" style={{ backgroundColor: '#FAFAF7' }}>
              <h2 className="font-bold mb-2" style={{ color: '#2A1F14' }}>
                메모
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{data.memo}</p>
            </div>
          )}

          {/* 재구매 의향 */}
          {data.repurchase && (
            <div className="text-sm text-gray-600">
              ✓ 재구매 의향 있음
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
              style={{ backgroundColor: '#D4813A', color: 'white' }}
            >
              Tea Tea Note 시작하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
