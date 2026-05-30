import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4" style={{ color: '#2A1F14' }}>
          404
        </h1>
        <p className="text-gray-600 mb-8">페이지를 찾을 수 없습니다</p>
        <Link href="/" className="btn-primary inline-block px-6 py-3">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
