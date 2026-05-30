'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      router.push('/diary');
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google 가입에 실패했습니다');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🍵</div>
          <h1 className="text-2xl font-bold" style={{ color: '#2A1F14' }}>
            Tea Tea Note
          </h1>
          <p className="text-gray-600 mt-2">나만의 차 이야기를 시작하세요</p>
        </div>

        <div className="tea-card p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: '#E8E4DE' }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: '#E8E4DE' }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                style={{ borderColor: '#E8E4DE' }}
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2"
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <div className="my-4 flex items-center">
            <div className="flex-1" style={{ borderTopColor: '#E8E4DE', borderTopWidth: 1 }}></div>
            <span className="px-2 text-gray-500 text-sm">또는</span>
            <div className="flex-1" style={{ borderTopColor: '#E8E4DE', borderTopWidth: 1 }}></div>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full border py-2 rounded-lg text-center font-medium"
            style={{ borderColor: '#E8E4DE', color: '#2A1F14' }}
          >
            Google로 가입
          </button>
        </div>

        <p className="text-center mt-6 text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" style={{ color: '#D4813A' }} className="font-medium">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
