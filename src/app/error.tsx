'use client';

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">오류 발생</h1>
        <p className="text-gray-600">문제가 발생했습니다. 다시 시도해 주세요.</p>
      </div>
    </div>
  );
}
