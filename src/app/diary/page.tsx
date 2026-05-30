'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function DiaryPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tastingNotes, setTastingNotes] = useState<any[]>([]);
  const [tearoomVisits, setTearoomVisits] = useState<any[]>([]);
  const [tab, setTab] = useState<'all' | 'tasting' | 'tearoom'>('all');
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);
      await loadNotes(user.id);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const loadNotes = async (userId: string) => {
    const { data: tasting } = await supabase
      .from('tasting_notes')
      .select('*')
      .eq('user_id', userId)
      .order('noted_at', { ascending: false });

    const { data: tearoom } = await supabase
      .from('tearoom_visits')
      .select('*')
      .eq('user_id', userId)
      .order('visited_at', { ascending: false });

    setTastingNotes(tasting || []);
    setTearoomVisits(tearoom || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

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
          <button onClick={handleLogout} className="btn-secondary">
            로그아웃
          </button>
        </div>
      </header>

      {/* 메인 */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 달력 */}
          <div className="lg:col-span-1">
            <div className="tea-card p-4">
              <Calendar
                value={selectedDate}
                onChange={(value: any) => setSelectedDate(value)}
                className="w-full"
              />
            </div>
          </div>

          {/* 기록 목록 */}
          <div className="lg:col-span-2">
            {/* 탭 */}
            <div className="flex gap-4 mb-6 border-b" style={{ borderColor: '#E8E4DE' }}>
              <button
                onClick={() => setTab('all')}
                className={`pb-2 font-medium ${
                  tab === 'all' ? 'border-b-2' : ''
                }`}
                style={{
                  borderBottomColor: tab === 'all' ? '#D4813A' : 'transparent',
                  color: tab === 'all' ? '#D4813A' : '#999',
                }}
              >
                전체
              </button>
              <button
                onClick={() => setTab('tasting')}
                className={`pb-2 font-medium ${
                  tab === 'tasting' ? 'border-b-2' : ''
                }`}
                style={{
                  borderBottomColor: tab === 'tasting' ? '#D4813A' : 'transparent',
                  color: tab === 'tasting' ? '#D4813A' : '#999',
                }}
              >
                테이스팅
              </button>
              <button
                onClick={() => setTab('tearoom')}
                className={`pb-2 font-medium ${
                  tab === 'tearoom' ? 'border-b-2' : ''
                }`}
                style={{
                  borderBottomColor: tab === 'tearoom' ? '#D4813A' : 'transparent',
                  color: tab === 'tearoom' ? '#D4813A' : '#999',
                }}
              >
                찻집
              </button>
            </div>

            {/* 기록 카드 */}
            <div className="space-y-4">
              {tab !== 'tearoom' &&
                tastingNotes.map((note) => (
                  <Link
                    key={note.id}
                    href={`/diary/tasting/${note.id}`}
                    className="tea-card p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h3 className="font-bold text-lg">{note.tea_name}</h3>
                    <p className="text-sm text-gray-600">{note.tea_type}</p>
                    <p className="text-xs text-gray-500 mt-2">{note.noted_at}</p>
                  </Link>
                ))}

              {tab !== 'tasting' &&
                tearoomVisits.map((visit) => (
                  <Link
                    key={visit.id}
                    href={`/diary/tearoom/${visit.id}`}
                    className="tea-card p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h3 className="font-bold text-lg">{visit.tearoom_name}</h3>
                    <p className="text-sm text-gray-600">{visit.location}</p>
                    <p className="text-xs text-gray-500 mt-2">{visit.visited_at}</p>
                  </Link>
                ))}

              {((tab === 'all' && tastingNotes.length === 0 && tearoomVisits.length === 0) ||
                (tab === 'tasting' && tastingNotes.length === 0) ||
                (tab === 'tearoom' && tearoomVisits.length === 0)) && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-4">아직 기록이 없습니다</p>
                  <p className="text-sm">첫 번째 차 이야기를 기록해 보세요 🍵</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8">
        <div className="relative">
          <button
            onClick={() => setShowFab(!showFab)}
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-shadow"
            style={{ backgroundColor: '#D4813A', color: 'white' }}
          >
            +
          </button>

          {showFab && (
            <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-lg p-2 space-y-2">
              <Link
                href="/diary/tasting/new"
                className="block px-4 py-2 text-sm font-medium rounded hover:bg-gray-100"
                style={{ color: '#D4813A' }}
              >
                📝 테이스팅 노트
              </Link>
              <Link
                href="/diary/tearoom/new"
                className="block px-4 py-2 text-sm font-medium rounded hover:bg-gray-100"
                style={{ color: '#6B8E6B' }}
              >
                🏠 찻집 방문기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
