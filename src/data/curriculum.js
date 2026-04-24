// 새롬고등학교 수학과학중점과정 선택 묶음 데이터
export const CHOICE_GROUPS = [
  { id: 1, grade: 2, semester: 1, nChoose: 3, perCredit: 4, subjects: [
    { name: '세계시민과 지리', group: '사회', type: '일반선택' },
    { name: '세계사', group: '사회', type: '일반선택' },
    { name: '사회와 문화', group: '사회', type: '일반선택' },
    { name: '현대사회와 윤리', group: '사회', type: '일반선택' },
    { name: '금융과 경제생활', group: '사회', type: '융합선택' },
    { name: '물리학', group: '과학', type: '일반선택', sci: true },
    { name: '화학', group: '과학', type: '일반선택', sci: true },
    { name: '생명과학', group: '과학', type: '일반선택', sci: true },
    { name: '지구과학', group: '과학', type: '일반선택', sci: true },
    { name: '프로그래밍', group: '기술·가정/정보', type: '진로선택' },
    { name: '로봇과 공학세계', group: '기술·가정/정보', type: '진로선택' },
  ]},
  { id: 2, grade: 2, semester: 1, nChoose: 1, perCredit: 2, subjects: [
    { name: '음악 연주와 창작', group: '예술', type: '진로선택' },
    { name: '미술 창작', group: '예술', type: '진로선택' },
  ]},
  { id: 3, grade: 2, semester: 1, nChoose: 1, perCredit: 3, subjects: [
    { name: '중국어', group: '제2외국어', type: '일반선택' },
    { name: '일본어', group: '제2외국어', type: '일반선택' },
  ]},
  { id: 4, grade: 2, semester: 2, nChoose: 1, perCredit: 3, subjects: [
    { name: '주제 탐구 독서', group: '국어', type: '진로선택' },
    { name: '기하', group: '수학', type: '진로선택', math: true },
    { name: '심화 영어', group: '영어', type: '진로선택' },
  ]},
  { id: 5, grade: 2, semester: 2, nChoose: 3, perCredit: 3, subjects: [
    { name: '도시의 미래 탐구', group: '사회', type: '진로선택' },
    { name: '인문학과 윤리', group: '사회', type: '진로선택' },
    { name: '동아시아 역사 기행', group: '사회', type: '진로선택' },
    { name: '경제', group: '사회', type: '진로선택' },
    { name: '정치', group: '사회', type: '진로선택' },
    { name: '기후변화와 지속가능한 세계', group: '사회', type: '융합선택' },
    { name: '역학과 에너지', group: '과학', type: '진로선택', sci: true },
    { name: '물질과 에너지', group: '과학', type: '진로선택', sci: true },
    { name: '세포와 물질대사', group: '과학', type: '진로선택', sci: true },
    { name: '지구시스템과학', group: '과학', type: '진로선택', sci: true },
  ]},
  { id: 6, grade: 2, semester: 2, nChoose: 1, perCredit: 2, subjects: [
    { name: '음악 감상과 비평', group: '예술', type: '진로선택' },
    { name: '미술과 매체', group: '예술', type: '융합선택' },
  ]},
  { id: 7, grade: 2, semester: 2, nChoose: 1, perCredit: 3, subjects: [
    { name: '중국어 회화', group: '제2외국어', type: '진로선택' },
    { name: '일본어 회화', group: '제2외국어', type: '진로선택' },
    { name: '인공지능 기초', group: '기술·가정/정보', type: '진로선택' },
    { name: '생활과학 탐구', group: '기술·가정/정보', type: '진로선택' },
  ]},
  { id: 8, grade: 3, semester: 1, nChoose: 1, perCredit: 4, subjects: [
    { name: '문학과 영상', group: '국어', type: '진로선택' },
    { name: '미적분Ⅱ', group: '수학', type: '진로선택', math: true },
    { name: '세계 문화와 영어', group: '영어', type: '융합선택' },
  ]},
  { id: 9, grade: 3, semester: 1, nChoose: 3, perCredit: 3, subjects: [
    { name: '윤리와 사상', group: '사회', type: '진로선택' },
    { name: '법과 사회', group: '사회', type: '진로선택' },
    { name: '한국지리 탐구', group: '사회', type: '진로선택' },
    { name: '역사로 탐구하는 현대 세계', group: '사회', type: '융합선택' },
    { name: '사회문제 탐구', group: '사회', type: '융합선택' },
    { name: '전자기와 양자', group: '과학', type: '진로선택', sci: true },
    { name: '화학 반응의 세계', group: '과학', type: '진로선택', sci: true },
    { name: '생물의 유전', group: '과학', type: '진로선택', sci: true },
    { name: '행성우주과학', group: '과학', type: '진로선택', sci: true },
    { name: '물리학 실험', group: '과학', type: '융합선택', sci: true },
    { name: '화학 실험', group: '과학', type: '융합선택', sci: true },
    { name: '생명과학 실험', group: '과학', type: '융합선택', sci: true },
    { name: '지구과학 실험', group: '과학', type: '융합선택', sci: true },
    { name: '운동과 건강', group: '체육', type: '진로선택' },
    { name: '음악과 미디어', group: '예술', type: '융합선택' },
    { name: '미술 감상과 비평', group: '예술', type: '진로선택' },
    { name: '데이터 과학', group: '기술·가정/정보', type: '진로선택' },
    { name: '아동발달과 부모', group: '기술·가정/정보', type: '융합선택' },
  ]},
  { id: 10, grade: 3, semester: 2, nChoose: 3, perCredit: 4, subjects: [
    { name: '독서 토론과 글쓰기', group: '국어', type: '융합선택' },
    { name: '언어생활 탐구', group: '국어', type: '융합선택' },
    { name: '수학과 문화', group: '수학', type: '융합선택', math: true },
    { name: '수학과제 탐구', group: '수학', type: '융합선택', math: true },
    { name: '심화 영어 독해와 작문', group: '영어', type: '진로선택' },
    { name: '실생활 영어 회화', group: '영어', type: '융합선택' },
  ]},
  { id: 11, grade: 3, semester: 2, nChoose: 3, perCredit: 3, subjects: [
    { name: '경제 수학', group: '수학', type: '진로선택' },
    { name: '고급 대수', group: '수학', type: '진로선택', math: true },
    { name: '국제 관계의 이해', group: '사회', type: '진로선택' },
    { name: '여행지리', group: '사회', type: '융합선택' },
    { name: '역사로 탐구하는 현대 세계', group: '사회', type: '융합선택' },
    { name: '윤리문제 탐구', group: '사회', type: '융합선택' },
    { name: '융합과학 탐구', group: '과학', type: '융합선택', sci: true },
    { name: '과학의 역사와 문화', group: '과학', type: '융합선택', sci: true },
    { name: '기후변화와 환경생태', group: '과학', type: '융합선택', sci: true },
    { name: '기초 체육 전공 실기', group: '체육', type: '진로선택' },
    { name: '음악과 문화', group: '예술', type: '융합선택' },
    { name: '미술과 사회', group: '예술', type: '융합선택' },
  ]},
  { id: 12, grade: 3, semester: 2, nChoose: 1, perCredit: 4, subjects: [
    { name: '중국 문화', group: '제2외국어', type: '융합선택' },
    { name: '일본 문화', group: '제2외국어', type: '융합선택' },
    { name: '소프트웨어와 생활', group: '기술·가정/정보', type: '융합선택' },
    { name: '창의 공학 설계', group: '기술·가정/정보', type: '융합선택' },
  ]},
];

export const GROUP_COLORS = {
  '국어': '#FF7A59', '수학': '#2B7FFF', '영어': '#3BC4A0', '사회': '#FFC93C',
  '과학': '#A56BFF', '체육': '#FF5B8A', '예술': '#E07BC0', '제2외국어': '#6BB8FF',
  '기술·가정/정보': '#8FBF3A',
};

export const TYPE_COLORS = {
  '일반선택': { bg: '#E3F2FD', fg: '#1976D2' },
  '진로선택': { bg: '#FFF3E0', fg: '#F57C00' },
  '융합선택': { bg: '#F3E5F5', fg: '#7B1FA2' },
};

export const MISSIONS = [
  { id: 'm1', title: '관심 부스 3곳 방문', desc: '궁금했던 교과 부스 3곳을 돌며 체크인하기', points: 30 },
  { id: 'm2', title: '선배 인터뷰', desc: '해당 과목을 수강한 선배와 5분 이상 대화', points: 20 },
  { id: 'm3', title: '시뮬레이션 완주', desc: '과목 선택 시뮬레이션 한 번 끝까지 체험', points: 20 },
  { id: 'm4', title: '박람회 커뮤니티', desc: '커뮤니티에 후기나 의견, 유용한 정보 자유롭게 남기기', points: 15 },
  { id: 'm5', title: '진로상담 부스 방문', desc: '진로상담 부스에서 1회 이상 상담받기', points: 15 },
];
