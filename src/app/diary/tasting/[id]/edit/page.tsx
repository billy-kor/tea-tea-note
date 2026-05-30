'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const TEA_TYPES = ['녹차', '백차', '황차', '청차', '홍차', '흑차', '보이차'];
const MOODS = ['😍', '🥰', '😊', '🤔', '😐', '😕', '😢'];
const COLORS = [
  '#FFD700', '#FFA500', '#FF8C00', '#FF6347',
  '#DC143C', '#8B0000', '#654321', '#8B4513',
  '#D2B48C', '#A0826D', '#6B4423', '#3E2723',
];

export default function EditTastingNotePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tea_name: '',
    tea_type: '',
    mood: '',
    noted_at: '',
    color: '',
    data: {
      brewing: { water_temp: '', water_amount: '', tea_amount: '', steeping_time: '' },
      infusions: [] as any[],
      flavors: [] as string[],
      aromas: [] as string[],
      textures: [] as string[],
      aftertaste: [] as string[],
      flavor_intensity: { sweetness: 0, bitterness: 0, astringency: 0, umami: 0, body: 0, smoothness: 0 },
      astringency: { toggle: false, intensity: 0 },
      origin: '',
      purchase_place: '',
      repurchase: false,
      pairing: '',
      memo: '',
      rating: 0,
    },
  });

  useEffect(() => {
    const loadNote = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from('tasting_notes')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setFormData({
          tea_name: data.tea_name,
          tea_type: data.tea_type || '',
          mood: data.mood || '',
          noted_at: data.noted_at,
          color: data.color || '',
          data: data.data || formData.data,
        });
      }
      setLoading(false);
    };

    loadNote();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('tasting_notes')
        .update({
          tea_name: formData.tea_name,
          tea_type: formData.tea_type,
          mood: formData.mood,
          noted_at: formData.noted_at,
          color: formData.color,
          data: formData.data,
        })
        .eq('id', id);

      if (error) throw error;
      router.push(`/diary/tasting/${id}`);
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
            테이스팅 노트 수정
          </h1>
          <Link href={`/diary/tasting/${id}`} className="text-gray-600 hover:text-gray-900">
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
                <label className="block text-sm font-medium mb-2">차 이름 *</label>
                <input
                  type="text"
                  value={formData.tea_name}
                  onChange={(e) =>
                    setFormData({ ...formData, tea_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">차 종류</label>
                  <select
                    value={formData.tea_type}
                    onChange={(e) =>
                      setFormData({ ...formData, tea_type: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: '#E8E4DE' }}
                  >
                    <option value="">선택하세요</option>
                    {TEA_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">날짜</label>
                  <input
                    type="date"
                    value={formData.noted_at}
                    onChange={(e) =>
                      setFormData({ ...formData, noted_at: e.target.value })
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

          {/* 탕색 */}
          <section className="tea-card p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#2A1F14' }}>
              탕색
            </h2>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className="w-12 h-12 rounded-full border-2"
                  style={{
                    backgroundColor: color,
                    borderColor: formData.color === color ? '#2A1F14' : '#E8E4DE',
                    borderWidth: formData.color === color ? '3px' : '2px',
                  }}
                  title={color}
                />
              ))}
            </div>
          </section>

          {/* 우리기 조건 */}
          <section className="tea-card p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#2A1F14' }}>
              우리기 조건
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">물 온도 (°C)</label>
                <input
                  type="number"
                  value={formData.data.brewing.water_temp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data: {
                        ...formData.data,
                        brewing: {
                          ...formData.data.brewing,
                          water_temp: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">물 양 (ml)</label>
                <input
                  type="number"
                  value={formData.data.brewing.water_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data: {
                        ...formData.data,
                        brewing: {
                          ...formData.data.brewing,
                          water_amount: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">차 양 (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.data.brewing.tea_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data: {
                        ...formData.data,
                        brewing: {
                          ...formData.data.brewing,
                          tea_amount: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">우리는 시간 (초)</label>
                <input
                  type="number"
                  value={formData.data.brewing.steeping_time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data: {
                        ...formData.data,
                        brewing: {
                          ...formData.data.brewing,
                          steeping_time: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                />
              </div>
            </div>
          </section>

          {/* 맛 강도 */}
          <section className="tea-card p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#2A1F14' }}>
              맛 강도 (0-5)
            </h2>
            <div className="space-y-4">
              {[
                { key: 'sweetness', label: '단맛' },
                { key: 'bitterness', label: '쓴맛' },
                { key: 'astringency', label: '떫은맛' },
                { key: 'umami', label: '감칠맛' },
                { key: 'body', label: '바디감' },
                { key: 'smoothness', label: '부드러움' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">{label}</label>
                    <span className="text-sm font-bold" style={{ color: '#D4813A' }}>
                      {formData.data.flavor_intensity[key as keyof typeof formData.data.flavor_intensity]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.data.flavor_intensity[key as keyof typeof formData.data.flavor_intensity]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        data: {
                          ...formData.data,
                          flavor_intensity: {
                            ...formData.data.flavor_intensity,
                            [key]: parseInt(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 기타 */}
          <section className="tea-card p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#2A1F14' }}>
              기타 정보
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">산지</label>
                <input
                  type="text"
                  value={formData.data.origin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data: { ...formData.data, origin: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">구입처</label>
                <input
                  type="text"
                  value={formData.data.purchase_place}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data: { ...formData.data, purchase_place: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">페어링</label>
                <input
                  type="text"
                  value={formData.data.pairing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data: { ...formData.data, pairing: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: '#E8E4DE' }}
                />
              </div>

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
                        setFormData({ ...formData, data: { ...formData.data, rating: star } })
                      }
                      className="text-2xl"
                    >
                      {star <= formData.data.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.data.repurchase}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      data: { ...formData.data, repurchase: e.target.checked },
                    })
                  }
                  id="repurchase"
                />
                <label htmlFor="repurchase" className="text-sm font-medium">
                  재구매 의향
                </label>
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
            <Link href={`/diary/tasting/${id}`} className="flex-1 btn-secondary py-3 text-center">
              취소
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
