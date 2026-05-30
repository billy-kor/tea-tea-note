// 차 종류
export const TEA_TYPES = [
  { value: '녹차', label: '녹차' },
  { value: '백차', label: '백차' },
  { value: '황차', label: '황차' },
  { value: '우롱차', label: '우롱차' },
  { value: '홍차', label: '홍차' },
  { value: '흑차', label: '흑차' },
  { value: '보이차_생차', label: '보이차 (생차)' },
  { value: '보이차_숙차', label: '보이차 (숙차)' },
  { value: '기타', label: '기타' },
];

// 무드 이모지
export const MOODS = [
  { value: 'calm', emoji: '🍃', label: '평온' },
  { value: 'energetic', emoji: '☀️', label: '활기참' },
  { value: 'peaceful', emoji: '🌧️', label: '차분함' },
  { value: 'thoughtful', emoji: '🌙', label: '사색적' },
  { value: 'special', emoji: '💫', label: '특별한 날' },
];

// 탕색 (12개)
export const LIQUOR_COLORS = [
  { value: '#F5F0DC', label: '연한 황록' },
  { value: '#D8E89A', label: '황록' },
  { value: '#C4D460', label: '초록빛 황' },
  { value: '#EED870', label: '황금' },
  { value: '#E4C030', label: '진한 황금' },
  { value: '#DCA020', label: '호박' },
  { value: '#C07818', label: '진한 호박' },
  { value: '#B85010', label: '구리빛 적' },
  { value: '#8C1E10', label: '홍적' },
  { value: '#5C1008', label: '진한 적갈' },
  { value: '#340804', label: '흑갈' },
  { value: '#6B4226', label: '황갈' },
];

// 엽저
export const WET_LEAF_OPTIONS = [
  '온전한 잎', '부서진 잎', '어린 싹', '성숙한 잎',
  '균일함', '다양함', '광택 있음', '칙칙함', '두꺼운 잎',
];

// 향
export const AROMA_OPTIONS = [
  '풀향', '꽃향', '과일향', '구수함', '볶음향', '나무향', '흙향',
  '달콤함', '연향(煙香)', '해초향', '허브향', '발효향', '견과류',
  '시트러스', '유제품', '버섯향', '캠퍼향', '곰팡이향',
];

// 맛 강도 라벨
export const TASTE_LABELS = [
  { key: 'sweetness', label: '단맛' },
  { key: 'bitterness', label: '쓴맛' },
  { key: 'astringency', label: '떫음' },
  { key: 'sourness', label: '신맛' },
  { key: 'umami', label: '감칠맛' },
  { key: 'huigan', label: '회감' },
];

// 질감
export const TEXTURE_OPTIONS = [
  '가벼움', '중간', '묵직함', '부드러움', '거칠음',
  '오일리', '크리미', '건조함', '촉촉함', '살아있음', '두꺼움',
];

// 여운
export const FINISH_OPTIONS = [
  '짧음(~5초)', '중간(5~15초)', '긴 여운(15초+)',
  '달콤한 여운', '쓴 여운', '꽃향 여운', '시원함', '따뜻함', '회감(回甘)',
];

// 재구매 의향
export const REPURCHASE_OPTIONS = [
  { value: '꼭 재구매', label: '꼭 재구매' },
  { value: '아마 재구매', label: '아마 재구매' },
  { value: '보류', label: '보류' },
  { value: '재구매 안 함', label: '재구매 안 함' },
];

// 보이차 채엽 시기
export const PUERH_HARVEST_SEASONS = [
  { value: '춘차', label: '춘차 (봄)' },
  { value: '하차', label: '하차 (여름)' },
  { value: '추차', label: '추차 (가을)' },
];

// 보이차 수령
export const PUERH_TREE_AGES = [
  { value: '대지차', label: '대지차' },
  { value: '생태차', label: '생태차' },
  { value: '고수차', label: '고수차' },
  { value: '노수차', label: '노수차' },
];

// 보이차 악퇴 정도
export const PUERH_OXIDATION_LEVELS = [
  { value: '경~30%', label: '경발효 ~30%' },
  { value: '~50%', label: '~50%' },
  { value: '~70%', label: '~70%' },
  { value: '중~100%', label: '중발효 ~100%' },
];

// 보관 환경
export const STORAGE_OPTIONS = [
  { value: '건창', label: '건창' },
  { value: '습창', label: '습창' },
  { value: '자연', label: '자연' },
];

// 동행 (찻집)
export const COMPANION_OPTIONS = [
  { value: 'alone', label: '혼자' },
  { value: 'friends', label: '친구와' },
  { value: 'family', label: '가족과' },
  { value: 'lover', label: '연인과' },
  { value: 'group', label: '모임' },
];

// 분위기 태그 (찻집)
export const ATMOSPHERE_OPTIONS = [
  '조용함', '아늑함', '모던함', '전통적', '자연친화적', '넓음', '아담함',
  '인스타감성', '혼자 오기 좋음', '대화하기 좋음', '작업하기 좋음', '데이트 추천',
];

// 다시 방문 의향
export const REVISIT_OPTIONS = [
  { value: 'definitely', label: '꼭 다시 방문' },
  { value: 'probably', label: '아마 다시 방문' },
  { value: 'maybe', label: '보류' },
  { value: 'no', label: '다시 방문 안 함' },
];
