'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const MOODS = ['😍', '🥰', '😊', '🤔', '😐', '😕', '😢'];

export default function EditTearoomVisitPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tearoom_name: '',
    location: '',
    mood: '',
    visited_at: '',
    data: {
      companion: '',
      atmosphere: '',
      menu_tried: [] as string[],
      service_rating: 0,
      cleanliness_rating: 0,
      value_rating: 0,
      interior_style: '',
      music: '',
      crowd_level: '',
      noise_level: '',
      parking: '',
      wifi: false,
      pet_friendly: false,
      outdoor_seating: false,
      memo: '',
      rating_overall: 0,
    },
  });

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
        setFormData({
          tearoom_name: data.tearoom_name,
          location: data.location || '',
          mood: data.mood || '',
          visited_at: data.visited_at,
          data: data.data || formData.data,
        });
      }
      setLoading(false);
    };

    loadVisit();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('tearoom_visits')
        .update({
          tearoom_name: formData.tearoom_name,
          location: formData.location,
          mood: formData.mood,
          visited_at: formData.visited_at,
          rating_overall: formData.data.rating_overall,
          data: formData.data,
        })
        .eq('id', id);

      if (error) throw error;
      router.push(`/diary/tearoom/${id}`);
    } catch (err: any) {
      alert('저장 실패: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b" style={{ borderColor: '#E8E4DE' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold" style={{ color: '#2A1F14' }}>
            찻집 방문기 수정
          </h1>
          <Link href={`/diary/tearoom/${id}`} className="text-gray-600 hover:text-gray-900">
            ✕
          </Link>
        </div>
      </header>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* 기본 정보 */}
          <section className="tea-card p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#2A1F14' }}>
              기본 정보
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">찻집 이름 *</label>
                <input
                  type="text"
                  value={formData.tearoom_name}
                  onChange={(e) =>
                    setFormData({ ...formData, tearoom_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">위치</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: '#E8E4DE' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">방문 날짜</label>
                  <input
                    type="date"
                    value={formData.visited_at}
                    onChange={(e) =>
                      setFormData({ ...formData, visited_at: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: '#E8E4DE' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">무드</label>
                <div className="flex gap-2">
                  {MOODS.map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood })}
                      className={`text-2xl p-2 rounded ${
                        formData.mood === mood ? 'bg-gray-200' : ''
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 분위기 */}
          <section className="tea-card p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#2A1F14' }}>
              분위기
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">동반자</label>
                <input
                  type="text"
                  value={formData.data.companion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data: { ...formData.data, companion: e.target.value },
                    })
                  }
                  placeholder="혼자, 친구, 가족 등"
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">인테리어 스타일</label>
                <input
                  type="text"
                  value={formData.data.interior_style}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data: { ...formData.data, interior_style: e.target.value },
                    })
                  }
                  placeholder="모던, 한옥, 미니멀 등"
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">혼잡도</label>
                  <select
                    value={formData.data.crowd_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        data: { ...formData.data, crowd_level: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: '#E8E4DE' }}
                  >
                    <option value="">선택하세요</option>
                    <option value="한산">한산</option>
                    <option value="보통">보통</option>
                    <option value="붐빔">붐빔</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">소음 수준</label>
                  <select
                    value={formData.data.noise_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        data: { ...formData.data, noise_level: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: '#E8E4DE' }}
                  >
                    <option value="">선택하세요</option>
                    <option value="조용">조용</option>
                    <option value="보통">보통</option>
                    <option value="시끄러움">시끄러움</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* 평가 */}
          <section className="tea-card p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#2A1F14' }}>
              평가 (1-5)
            </h2>
            <div className="space-y-4">
              {[
                { key: 'service_rating', label: '서비스' },
                { key: 'cleanliness_rating', label: '청결도' },
                { key: 'value_rating', label: '가성비' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">{label}</label>
                    <span className="text-sm font-bold" style={{ color: '#6B8E6B' }}>
                      {formData.data[key as keyof typeof formData.data]}/5
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.data[key as keyof typeof formData.data]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        data: {
                          ...formData.data,
                          [key]: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 편의시설 */}
          <section className="tea-card p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#2A1F14' }}>
              편의시설
            </h2>
            <div className="space-y-3">
              {[
                { key: 'wifi', label: 'WiFi' },
                { key: 'pet_friendly', label: '반려동물 동반 가능' },
                { key: 'outdoor_seating', label: '야외 좌석' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.data[key as keyof typeof formData.data] as boolean}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        data: {
                          ...formData.data,
                          [key]: e.target.checked,
                        },
                      })
                    }
                    id={key}
                  />
                  <label htmlFor={key} className="text-sm font-medium">
                    {label}
                  </label>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-2">주차</label>
                <input
                  type="text"
                  value={formData.data.parking}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data: { ...formData.data, parking: e.target.value },
                    })
                  }
                  placeholder="없음, 무료, 유료 등"
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                />
              </div>
            </div>
          </section>

          {/* 메모 및 종합 평가 */}
          <section className="tea-card p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#2A1F14' }}>
              종합 평가
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">메모</label>
                <textarea
                  value={formData.data.memo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data: { ...formData.data, memo: e.target.value },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">별점</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          data: { ...formData.data, rating_overall: star },
                        })
                      }
                      className="text-2xl"
                    >
                      {star <= formData.data.rating_overall ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 버튼 */}
          <div className="flex gap-4 pb-8">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-primary py-3"
            >
              {submitting ? '저장 중...' : '저장'}
            </button>
            <Link href={`/diary/tearoom/${id}`} className="flex-1 btn-secondary py-3 text-center">
              취소
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
