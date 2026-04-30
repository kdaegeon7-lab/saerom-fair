import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen, Sparkles, Trophy, ArrowLeft, Plus, Check, MessageSquare,
  Users, Compass, Lightbulb, Globe, GraduationCap, Target, Heart,
  Send, Clock, Award, ChevronRight, RefreshCw, AlertCircle, MapPin,
  ThumbsUp, MessageCircle, FileText, X, LogIn, LogOut, User,
  Lock, Hash, Briefcase, ShieldCheck, Search,
  QrCode, Camera, Crown, Medal, Flame, TrendingUp,
  CheckCircle2, Download, Edit3, BarChart3, Wand2,
  MoreVertical, Trash2, Save,
  Settings, KeyRound, AlertTriangle, BarChart, ToggleLeft, ToggleRight
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from './supabase';

const SUBJECT_PDFS = {
  '주제 탐구 독서': 'topic-inquiry-reading.pdf',
  '문학과 영상': 'literature-and-media.pdf',
  '독서 토론과 글쓰기': 'reading-discussion-writing.pdf',
  '언어생활 탐구': 'language-life-inquiry.pdf',
  '기하': 'geometry.pdf',
  '미적분Ⅱ': 'calculus-2.pdf',
  '경제 수학': 'economic-math.pdf',
  '수학과 문화': 'math-and-culture.pdf',
  '수학과제 탐구': 'math-project-inquiry.pdf',
  '심화 영어': 'advanced-english.pdf',
  '심화 영어 독해와 작문': 'advanced-english-reading-writing.pdf',
  '실생활 영어 회화': 'practical-english-conversation.pdf',
  '세계 문화와 영어': 'world-culture-english.pdf',
  '세계시민과 지리': 'global-citizen-geography.pdf',
  '세계사': 'world-history.pdf',
  '사회와 문화': 'society-and-culture.pdf',
  '현대사회와 윤리': 'modern-society-ethics.pdf',
  '한국지리 탐구': 'korean-geography-inquiry.pdf',
  '도시의 미래 탐구': 'urban-future-inquiry.pdf',
  '동아시아 역사 기행': 'east-asia-history-travel.pdf',
  '정치': 'politics.pdf',
  '법과 사회': 'law-and-society.pdf',
  '경제': 'economics.pdf',
  '윤리와 사상': 'ethics-and-thought.pdf',
  '인문학과 윤리': 'humanities-and-ethics.pdf',
  '국제 관계의 이해': 'international-relations.pdf',
  '여행지리': 'travel-geography.pdf',
  '역사로 탐구하는 현대 세계': 'modern-world-history.pdf',
  '사회문제 탐구': 'social-issues-inquiry.pdf',
  '금융과 경제생활': 'finance-economic-life.pdf',
  '윤리문제 탐구': 'ethics-issues-inquiry.pdf',
  '기후변화와 지속가능한 세계': 'climate-sustainable-world.pdf',
  '물리학': 'physics.pdf',
  '화학': 'chemistry.pdf',
  '생명과학': 'biology.pdf',
  '지구과학': 'earth-science.pdf',
  '역학과 에너지': 'mechanics-energy.pdf',
  '전자기와 양자': 'electromagnetism-quantum.pdf',
  '물질과 에너지': 'matter-energy.pdf',
  '화학 반응의 세계': 'chemical-reactions.pdf',
  '세포와 물질대사': 'cell-metabolism.pdf',
  '생물의 유전': 'genetics.pdf',
  '지구시스템과학': 'earth-system-science.pdf',
  '행성우주과학': 'planetary-space-science.pdf',
  '과학의 역사와 문화': 'science-history-culture.pdf',
  '기후변화와 환경생태': 'climate-environment-ecology.pdf',
  '융합과학 탐구': 'convergence-science-inquiry.pdf',
  '운동과 건강': 'exercise-health.pdf',
  '음악 연주와 창작': 'music-performance-creation.pdf',
  '음악 감상과 비평': 'music-appreciation-criticism.pdf',
  '미술 창작': 'art-creation.pdf',
  '미술 감상과 비평': 'art-appreciation-criticism.pdf',
  '음악과 미디어': 'music-and-media.pdf',
  '미술과 매체': 'art-and-media.pdf',
  '로봇과 공학세계': 'robot-engineering.pdf',
  '생활과학 탐구': 'life-science-inquiry.pdf',
  '창의 공학 설계': 'creative-engineering-design.pdf',
  '아동발달과 부모': 'child-development-parenting.pdf',
  '프로그래밍': 'programming.pdf',
  '인공지능 기초': 'ai-basics.pdf',
  '데이터 과학': 'data-science.pdf',
  '소프트웨어와 생활': 'software-and-life.pdf',
  '중국어': 'chinese.pdf',
  '중국어 회화': 'chinese-conversation.pdf',
  '중국 문화': 'chinese-culture.pdf',
  '일본어': 'japanese.pdf',
  '일본어 회화': 'japanese-conversation.pdf',
  '일본 문화': 'japanese-culture.pdf',
  '고급 대수': 'advanced-algebra.pdf',
  '물리학 실험': 'physics-experiment.pdf',
  '화학 실험': 'chemistry-experiment.pdf',
  '생명과학 실험': 'biology-experiment.pdf',
  '지구과학 실험': 'earth-science-experiment.pdf',
  '기초 체육 전공 실기': 'basic-pe-major-practice.pdf',
  '음악과 문화': 'music-and-culture.pdf',
  '미술과 사회': 'art-and-society.pdf',
};

function getSubjectPdfUrl(subjectName) {
  const fname = SUBJECT_PDFS[subjectName];
  if (!fname) return null;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) return null;
  return `${supabaseUrl}/storage/v1/object/public/subject-guides/${fname}`;
}

async function hashPassword(password) {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const CHOICE_GROUPS = [
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

const GROUP_COLORS = {
  '국어': '#FF7A59', '수학': '#2B7FFF', '영어': '#3BC4A0', '사회': '#FFC93C',
  '과학': '#A56BFF', '체육': '#FF5B8A', '예술': '#E07BC0', '제2외국어': '#6BB8FF',
  '기술·가정/정보': '#8FBF3A',
};

const TYPE_COLORS = {
  '일반선택': { bg: '#E3F2FD', fg: '#1976D2' },
  '진로선택': { bg: '#FFF3E0', fg: '#F57C00' },
  '융합선택': { bg: '#F3E5F5', fg: '#7B1FA2' },
};

// 융합 선택 중 석차등급이 산출되지 않는 사회·과학 9과목
// (출처: 2022 개정 교육과정 학교생활기록부 기재 규정)
const NO_RANK_FUSION_SUBJECTS = new Set([
  // 사회 5과목
  '여행지리',
  '역사로 탐구하는 현대 세계',
  '사회문제 탐구',
  '금융과 경제생활',
  '윤리문제 탐구',
  '기후변화와 지속가능한 세계',
  // 과학 4과목 (사회과 1개 추가 = 9과목)
  '과학의 역사와 문화',
  '기후변화와 환경생태',
  '융합과학 탐구',
]);

// 새롬고 편성표의 "표6" 과목 — 특수 목적 고등학교 선택 과목 (과학·체육·예술 계열)
// 일반 고교에서도 5등급 석차등급이 산출됩니다.
// 출처: 2025·2026학년도 입학생 새롬고 편성표
const PYO6_SUBJECTS = new Set([
  // 과학 실험 4과목
  '물리학 실험',
  '화학 실험',
  '생명과학 실험',
  '지구과학 실험',
  // 수학
  '고급 대수',
  // 체육
  '기초 체육 전공 실기',
  // 예술
  '음악과 문화',
  '미술과 사회',
]);

/**
 * 과목의 평가 방식 정보를 반환한다.
 * @returns {{
 *   hasRank: boolean,        // 5등급 석차 산출 여부
 *   achievementLevels: 5|3|1, // 성취도 단계 (5=A~E, 3=A~C, 1=P)
 *   label: string,           // 짧은 라벨 (예: '5등급', '3단계', 'P')
 *   detail: string,          // 자세한 설명
 * }}
 */
function getEvaluationInfo(subject) {
  // ⭐ 표6 과목은 체육·예술이라도 5등급 석차등급 산출됨 (가장 우선 판정)
  if (PYO6_SUBJECTS.has(subject.name)) {
    return {
      hasRank: true,
      achievementLevels: 5,
      label: '5등급',
      detail: '특수 목적 고등학교 선택 과목(표6) — 일반 고교에서도 석차등급 산출',
      isPyo6: true,
    };
  }
  // 체육·예술 → 3단계 성취도, 석차등급 없음
  if (subject.group === '체육' || subject.group === '예술') {
    return {
      hasRank: false,
      achievementLevels: 3,
      label: '3단계',
      detail: '성취도 A·B·C 3단계 평가, 석차등급 없음',
    };
  }
  // 융합선택 중 사회·과학 9과목 → 5단계 성취도이지만 석차등급은 산출 안 함
  if (subject.type === '융합선택' && NO_RANK_FUSION_SUBJECTS.has(subject.name)) {
    return {
      hasRank: false,
      achievementLevels: 5,
      label: '등급X',
      detail: '성취도(A~E)는 부여되지만 석차등급은 산출되지 않는 융합선택 과목',
    };
  }
  // 그 외 모든 보통교과 과목 → 5등급
  return {
    hasRank: true,
    achievementLevels: 5,
    label: '5등급',
    detail: '석차등급(1~5)이 산출되는 과목',
  };
}

// 새롬고 특색 프로그램 (출처: 2026학년도 제2호 교육과정 톺아보기)
// 카테고리: '교과융합' | '수학과학중점' | '학교특색' | '방과후'
const PROGRAMS = [
  // === 교과 융합 ===
  {
    category: '교과융합',
    icon: BookOpen,
    title: '인문사회 융합 캠프 — 새롬 도서전',
    period: '5~10월',
    target: '전학년',
    desc: '국어·사회 교과 융합 프로그램. 사교 교사 특강을 통한 진로 연계 도서 탐색 및 선정 → 협력 독서 및 내용 탐구 → 선정 도서 홍보 부스 운영(7월 새롬 도서전) → 우수 사례 선정 및 환류 → 체험 답사 프로그램 기획·운영',
    note: '독서교육 선도학교 프로그램 연계',
    months: [5,6,7,8,9,10],
    tags: ['국어', '사회', '독서'],
  },
  {
    category: '교과융합',
    icon: Lightbulb,
    title: 'S.O.S — 코딩으로 지역 문제를 구하다',
    period: '5~11월',
    target: '전학년',
    desc: '정보·수학·과학 교과 융합. 학교 및 지역사회의 불편함 찾기(급식 잔반·교실 에너지 등) → 설문/관찰 데이터 수집 → 알고리즘 설계 및 프로토타입 제작(Python·C 활용) → 교내 SW/AI 창의 산출물 발표회(10월) 및 우수작 전시',
    months: [5,6,7,8,9,10,11],
    tags: ['정보', '수학', '과학', '코딩'],
  },
  {
    category: '교과융합',
    icon: Sparkles,
    title: '세종 이도리더프로그램 (과학)',
    period: '4~10월',
    target: '희망 학생',
    desc: '대학 및 전문 연구기관의 연구원과 1:팀 매칭, 12대 국가전략기술 분야와 연계한 전문 연구 수행 및 성과 공유 (반도체·디스플레이, 이차전지, 첨단모빌리티, 차세대원자력, 첨단바이오, 우주항공·해양, 수소, 사이버보안, AI, 차세대통신, 첨단로봇·제조, 양자)',
    months: [4,5,6,7,8,9,10],
    tags: ['과학', '연구', '국가전략기술'],
  },
  {
    category: '교과융합',
    icon: Sparkles,
    title: '세종 이도리더프로그램 (수학)',
    period: '4~10월',
    target: '희망 학생',
    desc: 'AI 수학 및 산업수학, 수학적 모델링 및 최적화, 확률·통계 기반 데이터 분석, 알고리즘 및 계산수학, 복잡계 및 네트워크 분석',
    months: [4,5,6,7,8,9,10],
    tags: ['수학', '연구', 'AI수학'],
  },

  // === 수학·과학 중점과정 ===
  {
    category: '수학과학중점',
    icon: Target,
    title: '실생활 문제 통계적 분석 캠프',
    period: '7월',
    target: '수학중점 1학년',
    desc: '데이터 분석 및 통계적 지식을 활용해 실생활 문제 해결 방법 탐구',
    months: [7],
    tags: ['수학', '통계', 'FIX2026'],
  },
  {
    category: '수학과학중점',
    icon: Target,
    title: '세상을 보는 방(정)식 캠프',
    period: '10월',
    target: '수학중점 2학년',
    desc: '생활 속의 여러 현상에 담긴 방정식을 탐구하고 수학적 원리를 분석',
    months: [10],
    tags: ['수학', '방정식'],
  },
  {
    category: '수학과학중점',
    icon: Target,
    title: '기술 속 수학·과학 원리 탐구 캠프',
    period: '2026.10.23~24',
    target: '희망 학생',
    desc: 'FIX2026와 2026 대한민국 미래모빌리티 엑스포에 참여해 다양한 최신 기술 동향을 파악하고 공학 기술의 과학적·수학적 원리 탐구',
    months: [10],
    tags: ['수학', '과학', '엑스포'],
  },
  {
    category: '수학과학중점',
    icon: Compass,
    title: '1학년 — 과학 진로 탐색 아카데미',
    period: '7~11월',
    target: '1학년',
    desc: '다양한 과학 분야(물리·화학·생명·지구과학)의 기초 개념 탐색, 관련 직업 탐색, 기초 탐구 활동과 진로 독서, 직업 인터뷰 자료 분석 등을 통해 흥미와 적성을 탐색하고 구체적 진로 방향 설정',
    months: [7,8,9,10,11],
    tags: ['1학년', '과학', '진로'],
  },
  {
    category: '수학과학중점',
    icon: Compass,
    title: '2학년 — 과학 창의 융합 아카데미',
    period: '7~11월',
    target: '2학년',
    desc: '과학 개념을 기반으로 공학·기술·사회적 문제를 융합적으로 연결하여 주제 설정. 팀 프로젝트 형태의 탐구 활동을 통해 자료 조사, 실험 설계, 데이터 분석 및 결과 해석으로 문제 해결 중심의 융합 탐구 실시',
    months: [7,8,9,10,11],
    tags: ['2학년', '과학', '융합'],
  },
  {
    category: '수학과학중점',
    icon: Compass,
    title: '3학년 — 첨단 과학 아카데미',
    period: '5~7월',
    target: '3학년',
    desc: '인공지능·바이오 기술·신소재 등 첨단 과학 분야를 중심으로 심화 주제를 선정. 학술 자료(논문·전문 서적)를 기반으로 한 탐구 수행, 연구 설계부터 결과 분석, 보고서 작성까지 실제 연구 과정에 준하는 활동',
    months: [5,6,7],
    tags: ['3학년', '첨단과학', 'AI'],
  },

  // === 학교 특색 (선도학교) ===
  {
    category: '학교특색',
    icon: Lightbulb,
    title: 'AI 리드 융합 캠프',
    period: '8월',
    target: '전교생',
    desc: 'AI 관련 도서를 읽고 4차 산업혁명에 관한 프로젝트 활동 및 창작활동, AI 관련 진로별 프로젝트 토론수업, 퍼실리테이터 진행',
    months: [8],
    tags: ['AI', '독서', '4차산업'],
  },
  {
    category: '학교특색',
    icon: BookOpen,
    title: '신문사설 읽기 프로그램',
    period: '5~12월',
    target: '전교생',
    desc: '진로 관련 신문사설을 읽고 비판적 사고 능력 및 문해력을 위한 사설읽기 프로그램. 구글클래스룸으로 첨삭지도 진행',
    note: '한 학기 단위로 운영',
    months: [5,6,7,8,9,10,11,12],
    tags: ['독서', '비판적사고', '문해력'],
  },
  {
    category: '학교특색',
    icon: Users,
    title: '진로독서 튜터링 프로그램',
    period: '5~12월',
    target: '전교생',
    desc: '독서연구회 교사들과 학생들이 매칭되어 멘토·멘티가 되어 튜터링 수업 진행',
    months: [5,6,7,8,9,10,11,12],
    tags: ['독서', '멘토링', '진로'],
  },
  {
    category: '학교특색',
    icon: Users,
    title: '이도학생학습공동체 (AI 중점)',
    period: '3~11월',
    target: '1·2학년 인공지능 관심 학생',
    desc: 'AI 및 데이터 활용을 통한 문제 해결 프로젝트 활동, AI 기반 사회 문제 해결 아이디어 탐구, 학생 간 협력 학습 및 결과 공유 활동. 11월 말 활동 결과 발표',
    months: [3,4,5,6,7,8,9,10,11],
    tags: ['AI', '학습공동체', '협력'],
  },

  // === 방과후 프로그램 ===
  {
    category: '방과후',
    icon: GraduationCap,
    title: '전공 심화 캠프',
    period: '연중 (8~10교시)',
    target: '희망 학생',
    desc: '정규 수업에서 다루기 어려운 교과 심화·탐구 활동을 학생 주도로 운영. 학생이 진로·관심 분야 연계 탐구 주제를 자율 설정 → 동일 관심사 학생 자체 모집 → 지도 교사 직접 섭외 → 운영 계획서 작성 → 개설 승인',
    note: '진로 연계 탐구 역량 강화, 학생부 진로 활동 내실화',
    months: [3,4,5,6,7,8,9,10,11,12],
    tags: ['심화', '학생주도', '진로'],
  },
  {
    category: '방과후',
    icon: Award,
    title: '학력 신장 강좌',
    period: '연중 (8~9교시)',
    target: '전학년',
    desc: '학생 수요 조사 → 강좌 개설 → 수강 신청. (수능 교과) 국어·수학·영어·사회·과학 교과별 유형별 학습, 수능 실전 대비 / (예술·체육) 미술 실기, 음악 실기, 체육 전공 기초 등 예체능 진로 연계 강좌',
    note: '공교육 내 다양한 학습 기회, 사교육 의존도 경감',
    months: [3,4,5,6,7,8,9,10,11,12],
    tags: ['수능', '예체능', '학력'],
  },
];

const PROGRAM_CATEGORIES = [
  { key: '교과융합', label: '교과 융합', icon: Sparkles, color: '#FF7A59', bg: '#FFE8E0' },
  { key: '수학과학중점', label: '수학·과학 중점과정', icon: Target, color: '#A56BFF', bg: '#F0E6FF' },
  { key: '학교특색', label: '학교 특색 (선도학교)', icon: Lightbulb, color: '#3BC4A0', bg: '#DDF5EA' },
  { key: '방과후', label: '방과후 프로그램', icon: Award, color: '#2B7FFF', bg: '#E0EDFF' },
];

// 미션 정의 - 모두 10P, 자동 적립 방식
const MISSIONS = [
  {
    id: 'booth-subject',
    title: '과목별 부스 방문',
    desc: '과목 부스에서 QR코드를 스캔하면 자동 적립 (1부스당 10P)',
    pointsPerVisit: 10,
    type: 'qr',
    category: 'subject',
  },
  {
    id: 'booth-senior',
    title: '선배와의 만남',
    desc: '선배 부스에서 QR코드를 스캔하면 자동 적립 (1부스당 10P)',
    pointsPerVisit: 10,
    type: 'qr',
    category: 'senior',
  },
  {
    id: 'simulation',
    title: '과목 선택 시뮬레이션 완주',
    desc: '시뮬레이션을 끝까지 완료하면 자동 적립 (최초 1회 10P)',
    points: 10,
    type: 'auto',
  },
  {
    id: 'community',
    title: '박람회 커뮤니티 활동',
    desc: '50자 이상의 후기·의견·정보를 남기면 글당 10P (최대 5회 50P)',
    pointsPerPost: 10,
    maxPosts: 5,
    type: 'auto',
  },
];

const ls = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  remove: (k) => { try { localStorage.removeItem(k); } catch {} },
};

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const saved = ls.get('current_user');
    if (saved && saved.student_id) {
      setUser(saved);
    }
    setAuthChecking(false);
  }, []);

  // ===== 브라우저/폰 뒤로가기 처리 =====
  // 사이트 진입 시 history에 'home' 상태 baseline을 깔아둔다.
  useEffect(() => {
    if (!user) return;
    // 첫 진입 시 baseline state 등록 (한 번만)
    if (!window.history.state || !window.history.state.appPage) {
      window.history.replaceState({ appPage: 'home' }, '');
    }
  }, [user]);

  // popstate 이벤트로 폰 뒤로가기 → page 상태 변경
  useEffect(() => {
    const onPopState = (e) => {
      const target = e.state?.appPage || 'home';
      setPage(target);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // setPage 대신 navigate를 사용 → history에 push
  const navigate = (target) => {
    if (target === page) return;
    if (target === 'home') {
      // 홈으로 갈 때는 history를 새로 시작 (뒤로가기 누르면 사이트 종료됨)
      window.history.pushState({ appPage: 'home' }, '');
    } else {
      window.history.pushState({ appPage: target }, '');
    }
    setPage(target);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    ls.set('current_user', userData);
  };

  const handleLogout = () => {
    if (!confirm('로그아웃 하시겠어요? 미션 진행 상황은 그대로 유지됩니다.')) return;
    setUser(null);
    ls.remove('current_user');
    setPage('home');
    // 로그아웃 시 history도 정리
    window.history.replaceState({ appPage: 'home' }, '');
  };

  if (authChecking) return null;

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFFBF0', color: '#1B2541' }}>
      <style>{`
        .wiggle:hover { animation: wiggle 0.4s ease-in-out; }
        @keyframes wiggle { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-1.2deg); } 75% { transform: rotate(1.2deg); } }
        .fade-in { animation: fadeIn 0.4s ease-out both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .pulse-ring { animation: pulseRing 1.5s ease-out infinite; }
        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(59,196,160,0.4); } 100% { box-shadow: 0 0 0 8px rgba(59,196,160,0); } }
      `}</style>

      {!isSupabaseConfigured && <SupabaseWarning />}

      <Header onHome={() => navigate('home')} page={page} user={user} onLogout={handleLogout} onAdmin={user?.is_admin ? () => navigate('admin') : null} />
      <div className="fade-in flex-1">
        {page === 'home' && <Home onNavigate={navigate} user={user} />}
        {page === 'simulation' && <Simulation onBack={() => navigate('home')} user={user} />}
        {page === 'programs' && <Programs onBack={() => navigate('home')} />}
        {page === 'fair' && <Fair onBack={() => navigate('home')} user={user} />}
        {page === 'admin' && user?.is_admin && <AdminPanel onBack={() => navigate('home')} user={user} />}
      </div>
      <Footer />
    </div>
  );
}

function SupabaseWarning() {
  return (
    <div className="p-3 text-center text-sm" style={{ background: '#FFF3E0', color: '#B8852F', borderBottom: '1px solid #FFC93C' }}>
      ⚠️ Supabase 환경변수가 설정되지 않아 일부 기능이 제한됩니다.
    </div>
  );
}

function Header({ onHome, page, user, onLogout, onAdmin }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md" style={{ background: 'rgba(255,251,240,0.9)', borderBottom: '1px solid #F0E6D2' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <button onClick={onHome} className="flex items-center gap-2 min-w-0">
          <img src="/saerom-logo.png" alt="새롬고" className="w-9 h-9 flex-shrink-0" />
          <span className="font-display text-base sm:text-xl truncate" style={{ color: '#1B2541' }}>
            새롬고 교육과정 박람회
          </span>
        </button>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: user.is_admin ? '#1B2541' : '#FFF3E0',
              border: `1.5px solid ${user.is_admin ? '#FFC93C' : '#FFC93C'}`,
            }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: avatarColor(user.nickname) }}>
              {user.nickname.slice(0, 1).toUpperCase()}
            </div>
            <div className="text-xs leading-tight">
              <div className="font-bold flex items-center gap-1" style={{ color: user.is_admin ? '#FFC93C' : '#1B2541' }}>
                {user.nickname}
                {user.is_admin && <ShieldCheck className="w-3 h-3" />}
              </div>
              <div style={{ color: user.is_admin ? '#A8B0BF' : '#8893A8' }}>{user.student_id}</div>
            </div>
          </div>
          <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: user.is_admin ? '#1B2541' : '#FFF3E0',
              border: '1.5px solid #FFC93C',
            }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: avatarColor(user.nickname) }}>
              {user.nickname.slice(0, 1).toUpperCase()}
            </div>
            <span className="text-[11px] font-bold flex items-center gap-1" style={{ color: user.is_admin ? '#FFC93C' : '#1B2541' }}>
              {user.nickname}
              {user.is_admin && <ShieldCheck className="w-3 h-3" />}
            </span>
          </div>

          {/* 관리자만 보이는 관리 패널 진입 버튼 */}
          {onAdmin && page !== 'admin' && (
            <button onClick={onAdmin} title="관리자 패널"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition"
              style={{ background: '#1B2541', color: '#FFC93C' }}>
              <Settings className="w-4 h-4" />
            </button>
          )}

          {page !== 'home' && (
            <button onClick={onHome} className="hidden sm:inline-block text-sm px-3 py-1.5 rounded-full hover:bg-white transition" style={{ color: '#6B7489' }}>
              홈으로
            </button>
          )}
          <button onClick={onLogout} title="로그아웃"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-white transition"
            style={{ color: '#6B7489' }}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-auto py-8 text-center" style={{ background: '#1B2541', color: '#FFFBF0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/saerom-logo.png" alt="새롬고" className="w-7 h-7 opacity-90" />
          <span className="font-display text-base">새롬고등학교 교육과정 박람회</span>
        </div>
        <p className="text-xs opacity-70">© 2026 새롬고등학교 교육과정부 (김대건) · All rights reserved.</p>
      </div>
    </footer>
  );
}

function BackButton({ onBack, label }) {
  return (
    <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm mb-6 hover:gap-2.5 transition-all" style={{ color: '#6B7489' }}>
      <ArrowLeft className="w-4 h-4" /> {label || '뒤로'}
    </button>
  );
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [studentId, setStudentId] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [careerPaths, setCareerPaths] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateCareer = (idx, val) => {
    setCareerPaths(prev => prev.map((p, i) => i === idx ? val : p));
  };
  const addCareer = () => {
    if (careerPaths.length >= 5) return;
    setCareerPaths(prev => [...prev, '']);
  };
  const removeCareer = (idx) => {
    setCareerPaths(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx));
  };

  const handleLogin = async () => {
    setError('');
    if (!studentId.trim()) return setError('학번을 입력해주세요.');
    if (!/^\d{4}$/.test(password)) return setError('비밀번호는 숫자 4자리예요.');
    if (!isSupabaseConfigured) return setError('서버 연결 오류. 새로고침 후 다시 시도해주세요.');

    setLoading(true);
    try {
      const hash = await hashPassword(password);
      const { data, error: e } = await supabase
        .from('students').select('*')
        .eq('student_id', studentId.trim())
        .maybeSingle();
      if (e) throw e;
      if (!data) {
        setError('등록되지 않은 학번이에요. 처음이라면 [신규 등록]을 눌러주세요.');
        return;
      }
      if (data.password_hash !== hash) {
        setError('비밀번호가 일치하지 않아요.');
        return;
      }
      supabase.from('students').update({ last_login_at: new Date().toISOString() })
        .eq('student_id', studentId.trim()).then(() => {});

      onLogin({
        student_id: data.student_id,
        nickname: data.nickname,
        career_paths: data.career_paths || [],
        is_admin: data.is_admin || false,
      });
    } catch (err) {
      setError('로그인 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setError('');
    const sid = studentId.trim();
    const nick = nickname.trim();
    const careers = careerPaths.map(c => c.trim()).filter(Boolean);

    if (!/^\d+$/.test(sid)) return setError('학번은 숫자로 입력해주세요.');
    if (sid.length < 4 || sid.length > 6) return setError('학번을 다시 확인해주세요. (4~6자리)');
    if (!nick) return setError('닉네임을 입력해주세요.');
    if (nick.length > 20) return setError('닉네임은 20자 이내로 해주세요.');
    if (!/^\d{4}$/.test(password)) return setError('비밀번호는 숫자 4자리로 만들어주세요.');
    if (careers.length === 0) return setError('희망 진로/학과를 1개 이상 입력해주세요.');
    if (!isSupabaseConfigured) return setError('서버 연결 오류. 새로고침 후 다시 시도해주세요.');

    setLoading(true);
    try {
      const { data: existing } = await supabase.from('students')
        .select('student_id').eq('student_id', sid).maybeSingle();
      if (existing) {
        setError('이미 등록된 학번이에요. [기존 사용자]로 로그인해주세요.');
        return;
      }
      const { data: nickExists } = await supabase.from('students')
        .select('student_id').eq('nickname', nick).maybeSingle();
      if (nickExists) {
        setError('이미 사용 중인 닉네임이에요. 다른 닉네임을 정해주세요.');
        return;
      }

      const hash = await hashPassword(password);
      const { error: insErr } = await supabase.from('students').insert({
        student_id: sid,
        nickname: nick,
        password_hash: hash,
        career_paths: careers,
      });
      if (insErr) throw insErr;

      onLogin({ student_id: sid, nickname: nick, career_paths: careers, is_admin: false });
    } catch (err) {
      setError('등록 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(135deg, #FFFBF0 0%, #FFF3E0 100%)'
    }}>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md fade-in">
          <style>{`
            .fade-in { animation: fadeIn 0.5s ease-out both; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>

          <div className="text-center mb-7">
            <img src="/saerom-logo.png" alt="새롬고" className="w-24 h-24 mx-auto mb-4 drop-shadow-md" />
            <h1 className="font-display text-3xl mb-1" style={{ color: '#1B2541' }}>
              새롬고 교육과정 박람회
            </h1>
            <p className="text-sm" style={{ color: '#6B7489' }}>입장하려면 학번으로 인증해주세요</p>
          </div>

          <div className="rounded-3xl p-6 sm:p-7 shadow-lg" style={{ background: 'white', border: '1.5px solid #F0E6D2' }}>
            <div className="flex gap-2 p-1 rounded-full mb-6" style={{ background: '#FFFBF0' }}>
              <button onClick={() => { setMode('login'); setError(''); }}
                className="flex-1 py-2 rounded-full text-sm font-bold transition"
                style={{
                  background: mode === 'login' ? '#FF7A59' : 'transparent',
                  color: mode === 'login' ? 'white' : '#6B7489',
                }}>
                기존 사용자
              </button>
              <button onClick={() => { setMode('signup'); setError(''); }}
                className="flex-1 py-2 rounded-full text-sm font-bold transition"
                style={{
                  background: mode === 'signup' ? '#2B7FFF' : 'transparent',
                  color: mode === 'signup' ? 'white' : '#6B7489',
                }}>
                신규 등록
              </button>
            </div>

            <div className="space-y-3.5">
              <Field icon={Hash} label="학번" hint="예: 20301">
                <input type="tel" inputMode="numeric" value={studentId}
                  onChange={e => setStudentId(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={6} placeholder="학번 4~6자리"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2"
                  style={{ background: '#FFFBF0', border: '1.5px solid #EADFC7' }} />
              </Field>

              {mode === 'signup' && (
                <>
                  <Field icon={User} label="닉네임" hint="커뮤니티에서 표시될 이름 (20자 이내)">
                    <input type="text" value={nickname} onChange={e => setNickname(e.target.value)}
                      maxLength={20} placeholder="닉네임"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2"
                      style={{ background: '#FFFBF0', border: '1.5px solid #EADFC7' }} />
                  </Field>

                  <Field icon={Briefcase} label="희망 진로/학과" hint="여러 개 가능 (최대 5개)">
                    <div className="space-y-2">
                      {careerPaths.map((c, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={c}
                            onChange={e => updateCareer(i, e.target.value)}
                            maxLength={30}
                            placeholder={i === 0 ? '예: 의학' : '예: 컴퓨터공학'}
                            className="flex-1 px-3 py-2 rounded-xl text-sm outline-none focus:ring-2"
                            style={{ background: '#FFFBF0', border: '1.5px solid #EADFC7' }} />
                          {careerPaths.length > 1 && (
                            <button type="button" onClick={() => removeCareer(i)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
                              style={{ background: '#FFE8E0', color: '#FF5B8A' }}>
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {careerPaths.length < 5 && (
                        <button type="button" onClick={addCareer}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
                          style={{ background: '#E0EDFF', color: '#2B7FFF' }}>
                          <Plus className="w-3.5 h-3.5" /> 추가
                        </button>
                      )}
                    </div>
                  </Field>
                </>
              )}

              <Field icon={Lock} label="비밀번호" hint={mode === 'signup' ? '숫자 4자리로 직접 만들어주세요' : '입장할 때 사용하는 4자리 숫자'}>
                <input type="password" inputMode="numeric"
                  value={password}
                  onChange={e => setPassword(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={4} placeholder="0000"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 tracking-[0.5em] text-center"
                  style={{ background: '#FFFBF0', border: '1.5px solid #EADFC7' }} />
              </Field>

              {error && (
                <div className="p-3 rounded-xl text-sm flex items-start gap-2"
                  style={{ background: '#FFE8E0', color: '#C73E2A' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button onClick={mode === 'login' ? handleLogin : handleSignup} disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{
                  background: mode === 'login' ? 'linear-gradient(135deg, #FF7A59, #FF5B8A)' : 'linear-gradient(135deg, #2B7FFF, #6BB8FF)',
                  color: 'white',
                  opacity: loading ? 0.6 : 1,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                }}>
                {loading ? '처리 중...' : (
                  <>
                    {mode === 'login' ? <LogIn className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    {mode === 'login' ? '입장하기' : '등록하고 입장하기'}
                  </>
                )}
              </button>

              {mode === 'login' && (
                <p className="text-xs text-center pt-1" style={{ color: '#8893A8' }}>
                  처음 방문이라면 위에서 <b style={{ color: '#2B7FFF' }}>신규 등록</b>을 선택해주세요.
                </p>
              )}
              {mode === 'signup' && (
                <>
                  <div className="p-3 rounded-xl text-xs leading-relaxed"
                    style={{ background: '#FFF3E0', border: '1.5px solid #FFC93C', color: '#8B6814' }}>
                    <div className="flex items-start gap-1.5">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold mb-1">박람회 이용 안내</p>
                        <p>커뮤니티에는 <b>박람회·진로·과목 선택과 무관한 글</b>이나 <b>학교폭력으로 보일 수 있는 글</b>은 절대 작성하지 않습니다. 위반 시 글이 삭제되고 학생부에 통보될 수 있습니다.</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-center pt-1" style={{ color: '#8893A8' }}>
                    비밀번호는 잊어버리지 않게 꼭 기억해주세요!
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ icon: Icon, label, hint, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#1B2541' }}>
        <Icon className="w-3.5 h-3.5" style={{ color: '#FF7A59' }} />
        {label}
        {hint && <span className="font-normal text-[11px]" style={{ color: '#8893A8' }}>· {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Home({ onNavigate, user }) {
  const cards = [
    { key: 'simulation', icon: BookOpen, color: '#FF7A59', bg: '#FFE8E0', title: '과목 선택 시뮬레이션', desc: '학년별 편성표 기준으로\n실제 선택 묶음을 미리 체험해요.', cta: '지금 체험하기' },
    { key: 'programs', icon: Sparkles, color: '#2B7FFF', bg: '#E0EDFF', title: '학교 특색 프로그램', desc: '수학과학중점·디지털 혁신 등\n우리 학교 특색 한눈에.', cta: '프로그램 보기' },
    { key: 'fair', icon: Trophy, color: '#3BC4A0', bg: '#DDF5EA', title: '박람회 미션 & 커뮤니티', desc: '미션 달성하고 포인트 모으기,\n후기도 함께 공유.', cta: '미션 시작하기' },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 pt-10 pb-8">
      <section className="relative mb-12">
        <div className="absolute -top-4 left-8 w-16 h-16 rounded-full opacity-60" style={{ background: '#FFC93C' }} />
        <div className="absolute top-20 right-10 w-24 h-24 rounded-full opacity-40" style={{ background: '#3BC4A0' }} />
        <div className="absolute top-8 right-40 w-10 h-10 rounded-full opacity-50" style={{ background: '#FF5B8A' }} />
        <div className="relative">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#1B2541', color: '#FFC93C' }}>
            2026 새롬고 교육과정 박람회
          </span>
          <h1 className="font-display text-4xl md:text-6xl leading-tight mb-3">
            <span style={{ color: '#FF7A59' }}>{user.nickname}</span>님,<br/>
            나만의 고등학교,<br className="md:hidden" />
            교육과정을 설계해 볼까요?
          </h1>
          <p className="text-base md:text-lg max-w-xl" style={{ color: '#4A5568' }}>
            선택과목이 고민이라면, 특색 프로그램이 궁금하다면,<br />
            박람회 미션을 놓치고 싶지 않다면 — 여기서 시작하세요.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <button key={c.key} onClick={() => onNavigate(c.key)}
              className="text-left p-7 rounded-3xl transition-all hover:-translate-y-1 wiggle"
              style={{ background: c.bg, border: `2px solid ${c.color}22`, animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: c.color }}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-2xl mb-2">{c.title}</h3>
              <p className="text-sm whitespace-pre-line mb-6" style={{ color: '#4A5568' }}>{c.desc}</p>
              <span className="inline-flex items-center gap-1 font-bold text-sm" style={{ color: c.color }}>
                {c.cta} <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          );
        })}
      </section>

      <section className="mt-16 p-6 rounded-2xl" style={{ background: '#1B2541', color: '#FFFBF0' }}>
        <div className="grid md:grid-cols-2 gap-5 mb-4">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#FFC93C' }} />
            <div>
              <p className="text-xs opacity-70 mb-1">박람회 일정</p>
              <p className="font-display text-lg leading-snug">2026. 7. 3 (금)<br/>11:30 – 15:30</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#FFC93C' }} />
            <div>
              <p className="text-xs opacity-70 mb-1">박람회 장소</p>
              <p className="font-display text-lg leading-snug">1·2학년 학급 교실<br/>3층 체육관 · 1층 로비</p>
            </div>
          </div>
        </div>
        <div className="text-sm opacity-80 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          박람회 종료 후에도 이 사이트는 <b style={{ color: '#FFC93C' }}>상시 운영</b>됩니다.
        </div>
      </section>
    </main>
  );
}

function Simulation({ onBack, user }) {
  const [cohort, setCohort] = useState(null);
  const [selected, setSelected] = useState({});
  const [justCompleted, setJustCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false); // 결과 화면 표시 여부

  useEffect(() => {
    const s = ls.get('sim_state');
    if (s) {
      if (s.cohort) setCohort(s.cohort);
      if (s.selected) {
        const restored = {};
        Object.entries(s.selected).forEach(([k, v]) => { restored[k] = new Set(v); });
        setSelected(restored);
      }
    }
  }, []);

  useEffect(() => {
    if (!cohort) return;
    ls.set('sim_state', { cohort, selected: Object.fromEntries(Object.entries(selected).map(([k, v]) => [k, [...v]])) });
  }, [cohort, selected]);

  const visibleGroups = useMemo(() => {
    if (!cohort) return [];
    return CHOICE_GROUPS.filter(g => cohort === 'g1' || g.grade === 3);
  }, [cohort]);

  // 시뮬레이션 완주 자동 적립 (1회만)
  useEffect(() => {
    if (!user || !cohort || !isSupabaseConfigured || !visibleGroups.length) return;
    const allCompleted = visibleGroups.every(g => (selected[g.id]?.size || 0) === g.nChoose);
    if (!allCompleted) return;

    const cacheKey = `sim_reward_${user.student_id}`;
    if (ls.get(cacheKey)) return;

    (async () => {
      const { data: existing } = await supabase
        .from('mission_rewards')
        .select('id')
        .eq('student_id', user.student_id)
        .eq('reward_type', 'simulation')
        .maybeSingle();
      if (existing) {
        ls.set(cacheKey, true);
        return;
      }
      const { error } = await supabase
        .from('mission_rewards')
        .insert({ student_id: user.student_id, reward_type: 'simulation', points: 10 });
      if (!error) {
        ls.set(cacheKey, true);
        setJustCompleted(true);
        setTimeout(() => setJustCompleted(false), 5000);
      }
    })();
  }, [selected, visibleGroups, user, cohort]);

  const toggle = (groupId, name, group) => {
    setSelected(prev => {
      const cur = new Set(prev[groupId] || []);
      if (cur.has(name)) cur.delete(name);
      else {
        if (cur.size >= group.nChoose) return prev;
        cur.add(name);
      }
      return { ...prev, [groupId]: cur };
    });
  };

  const reset = () => setSelected({});

  if (!cohort) {
    return (
      <main className="max-w-4xl mx-auto px-6 pt-8 pb-8">
        <BackButton onBack={onBack} />
        <div className="mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#FFE8E0', color: '#FF7A59' }}>STEP 1</span>
          <h2 className="font-display text-4xl mb-3">과목 선택 시뮬레이션</h2>
          <p style={{ color: '#4A5568' }}>먼저 학년을 알려주세요. 학년에 따라 시뮬레이션할 과목 범위가 달라져요.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <CohortCard onClick={() => setCohort('g1')} color="#FF7A59" bg="#FFE8E0"
            title="현재 고1" subtitle="2026학년도 입학생"
            desc="고2·고3 2년간 들을 선택과목을 모두 시뮬레이션합니다."
            groups={CHOICE_GROUPS.length} />
          <CohortCard onClick={() => setCohort('g2')} color="#2B7FFF" bg="#E0EDFF"
            title="현재 고2" subtitle="2025학년도 입학생"
            desc="내년 고3 때 들을 선택과목을 시뮬레이션합니다."
            groups={CHOICE_GROUPS.filter(g => g.grade === 3).length} />
        </div>

        <p className="text-xs mt-8 p-4 rounded-xl flex items-start gap-2" style={{ background: '#FFF3E0', color: '#B8852F' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>본 시뮬레이션은 새롬고등학교 수학과학중점과정 편성표 기준입니다. 공통과목과 학교지정 과목은 자동 이수되므로 시뮬레이션 대상에서 제외됩니다.</span>
        </p>
      </main>
    );
  }

  // 결과 화면 분기
  if (showResult) {
    return (
      <ResultScreen
        cohort={cohort}
        groups={visibleGroups}
        selected={selected}
        user={user}
        onEdit={() => setShowResult(false)}
        onBack={onBack}
      />
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 pt-8 pb-8">
      <BackButton onBack={onBack} />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#FFE8E0', color: '#FF7A59' }}>STEP 1</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: cohort === 'g1' ? '#FFE8E0' : '#E0EDFF', color: cohort === 'g1' ? '#FF7A59' : '#2B7FFF' }}>
              {cohort === 'g1' ? '현재 고1 · 2026학년도 입학생' : '현재 고2 · 2025학년도 입학생'}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl">과목 선택 시뮬레이션</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCohort(null)} className="text-sm px-3 py-2 rounded-full" style={{ background: 'white', border: '1.5px solid #EADFC7', color: '#6B7489' }}>
            학년 다시 선택
          </button>
          <button onClick={reset} className="text-sm px-3 py-2 rounded-full inline-flex items-center gap-1" style={{ background: 'white', border: '1.5px solid #EADFC7', color: '#6B7489' }}>
            <RefreshCw className="w-3.5 h-3.5" /> 초기화
          </button>
        </div>
      </div>

      {justCompleted && (
        <div className="mb-4 p-4 rounded-2xl flex items-center gap-3 fade-in"
          style={{ background: 'linear-gradient(135deg, #DDF5EA, #FFFBF0)', border: '2px solid #3BC4A0' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#3BC4A0' }}>
            <Award className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-display text-base">🎉 시뮬레이션 완주 +10P 적립!</p>
            <p className="text-xs" style={{ color: '#4A5568' }}>박람회 미션 화면에서 내 점수를 확인해보세요.</p>
          </div>
        </div>
      )}

      <ProgressSummary groups={visibleGroups} selected={selected} />

      {/* 평가방식 범례 */}
      <EvaluationLegend />

      <div className="mt-8 space-y-10">
        {[2, 3].filter(g => cohort === 'g1' || g === 3).map(grade => (
          <GradeSection key={grade} grade={grade}
            groups={visibleGroups.filter(g => g.grade === grade)}
            selected={selected} onToggle={toggle} />
        ))}
      </div>

      {/* 선택 완료 버튼 */}
      <CompleteButton groups={visibleGroups} selected={selected} onClick={() => setShowResult(true)} />
    </main>
  );
}

function CohortCard({ onClick, color, bg, title, subtitle, desc, groups }) {
  return (
    <button onClick={onClick} className="text-left p-7 rounded-3xl transition-all hover:-translate-y-1 wiggle"
      style={{ background: bg, border: `2px solid ${color}22` }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: color }}>
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-display text-2xl">{title}</h3>
          <p className="text-xs" style={{ color }}>{subtitle}</p>
        </div>
      </div>
      <p className="text-sm mb-4" style={{ color: '#4A5568' }}>{desc}</p>
      <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color }}>
        선택 묶음 {groups}개 <ChevronRight className="w-4 h-4" />
      </span>
    </button>
  );
}

function ProgressSummary({ groups, selected }) {
  const completed = groups.filter(g => (selected[g.id]?.size || 0) === g.nChoose).length;
  const totalCredit = groups.reduce((sum, g) => sum + ((selected[g.id]?.size || 0) * g.perCredit), 0);
  const maxCredit = groups.reduce((sum, g) => sum + (g.nChoose * g.perCredit), 0);
  const pct = groups.length ? (completed / groups.length) * 100 : 0;
  const isDone = completed === groups.length && groups.length > 0;

  return (
    <div className="p-5 rounded-2xl" style={{ background: '#1B2541', color: '#FFFBF0' }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <Target className="w-7 h-7" style={{ color: '#FFC93C' }} />
          <div>
            <p className="text-xs opacity-70">진행 상황</p>
            <p className="font-display text-lg">묶음 {completed}/{groups.length} 완료 · {totalCredit}/{maxCredit} 학점</p>
          </div>
        </div>
        {isDone && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold pulse-ring" style={{ background: '#3BC4A0', color: 'white' }}>
            <Check className="w-3.5 h-3.5" /> 시뮬레이션 완료!
          </span>
        )}
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
        <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: isDone ? '#3BC4A0' : '#FFC93C' }} />
      </div>
    </div>
  );
}

function GradeSection({ grade, groups, selected, onToggle }) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-4">
        <h3 className="font-display text-2xl">{grade}학년</h3>
        <span className="text-sm" style={{ color: '#8893A8' }}>
          선택 묶음 {groups.length}개 · 총 {groups.reduce((s, g) => s + g.nChoose * g.perCredit, 0)}학점
        </span>
      </div>
      <div className="space-y-6">
        {[1, 2].map(sem => {
          const semGroups = groups.filter(g => g.semester === sem);
          if (!semGroups.length) return null;
          return (
            <div key={sem}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ background: '#FF7A59' }} />
                <h4 className="font-bold" style={{ color: '#4A5568' }}>{sem}학기</h4>
              </div>
              <div className="grid gap-4">
                {semGroups.map(g => <ChoiceGroupCard key={g.id} group={g} selected={selected[g.id] || new Set()} onToggle={onToggle} />)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ChoiceGroupCard({ group, selected, onToggle }) {
  const [pdfSubject, setPdfSubject] = useState(null);
  const count = selected.size;
  const isFull = count === group.nChoose;
  const maxCredit = group.nChoose * group.perCredit;
  const totalCredit = count * group.perCredit;

  return (
    <div className="p-5 rounded-2xl" style={{ background: 'white', border: `1.5px solid ${isFull ? '#3BC4A0' : '#F0E6D2'}`, transition: 'border-color 0.3s' }}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg">{group.nChoose}과목 선택</span>
          <span className="text-sm" style={{ color: '#8893A8' }}>(각 {group.perCredit}학점 · 총 {maxCredit}학점)</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isFull && <Check className="w-4 h-4" style={{ color: '#3BC4A0' }} />}
          <span className="text-sm font-bold" style={{ color: isFull ? '#3BC4A0' : '#6B7489' }}>
            {count}/{group.nChoose} 선택 · {totalCredit}학점
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {group.subjects.map(s => {
          const on = selected.has(s.name);
          const disabled = !on && isFull;
          const groupColor = GROUP_COLORS[s.group] || '#8893A8';
          const typeColor = TYPE_COLORS[s.type];
          const hasPdf = Boolean(SUBJECT_PDFS[s.name]);
          const evalInfo = getEvaluationInfo(s);

          return (
            <div key={s.name} className="inline-flex items-stretch rounded-xl overflow-hidden"
              style={{ border: `1.5px solid ${on ? groupColor : '#EADFC7'}` }}>
              <button onClick={() => onToggle(group.id, s.name, group)} disabled={disabled}
                className="px-3 py-2 text-sm transition-all"
                style={{
                  background: on ? groupColor : disabled ? '#F5F0E4' : 'white',
                  color: on ? 'white' : disabled ? '#B8B0A0' : '#1B2541',
                  fontWeight: on ? 700 : 400,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.6 : 1,
                }}>
                <span className="inline-flex items-center gap-1.5">
                  {on && <Check className="w-3.5 h-3.5" />}
                  {s.name}
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-normal" style={{
                    background: on ? 'rgba(255,255,255,0.22)' : typeColor.bg,
                    color: on ? 'white' : typeColor.fg,
                  }}>
                    {s.type.replace('선택', '')}
                  </span>
                  {/* 평가방식 배지 */}
                  <EvalBadge evalInfo={evalInfo} on={on} />
                  {s.math && <span className="text-[10px]" title="수학중점">🔢</span>}
                  {s.sci && <span className="text-[10px]" title="과학중점">🔬</span>}
                </span>
              </button>
              {hasPdf && (
                <button onClick={() => setPdfSubject(s.name)}
                  title={`${s.name} 안내자료 보기`}
                  className="px-2 transition-all flex items-center justify-center"
                  style={{
                    background: on ? 'rgba(255,255,255,0.18)' : '#FFF8E8',
                    color: on ? 'white' : '#B8852F',
                    borderLeft: `1px solid ${on ? 'rgba(255,255,255,0.3)' : '#EADFC7'}`,
                  }}>
                  <FileText className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {pdfSubject && <PdfModal subject={pdfSubject} onClose={() => setPdfSubject(null)} />}
    </div>
  );
}

// ============ 평가방식 범례 (시뮬레이션 화면 상단) ============
function EvaluationLegend() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mt-4 rounded-2xl overflow-hidden"
      style={{ background: 'white', border: '1.5px solid #EADFC7' }}>
      <button onClick={() => setExpanded(e => !e)}
        className="w-full px-4 py-3 flex items-center justify-between gap-2 text-left">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: '#FFF3E0' }}>
            <BarChart3 className="w-4 h-4" style={{ color: '#F57C00' }} />
          </div>
          <span className="font-display text-sm">⚠ 과목별 성적 처리 방식 안내 (꼭 확인)</span>
        </div>
        <ChevronRight className="w-4 h-4 transition-transform flex-shrink-0"
          style={{ color: '#8893A8', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 text-xs" style={{ color: '#4A5568' }}>
          <p className="leading-relaxed">
            과목 옆 배지로 성적 처리 방식을 표시합니다. <b>대학 입시에 영향을 주는 중요한 정보</b>이니 꼭 확인하세요.
          </p>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 mt-0.5"
                style={{ background: '#F0E6D2', color: '#6B7489' }}>5등급</span>
              <p>국어·수학·영어·사회·과학 등 대부분의 보통교과 과목. 석차등급 1~5등급이 산출됩니다.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 mt-0.5 inline-flex items-center gap-0.5"
                style={{ background: '#F0E6D2', color: '#6B7489' }}>
                <span style={{ color: '#F57C00' }}>★</span>5등급
              </span>
              <div>
                <p className="font-bold mb-1" style={{ color: '#1B2541' }}>특수목적고 선택과목 (표6)</p>
                <p className="leading-relaxed">새롬고에서 개설되는 특수 목적 고등학교 선택 과목으로, <b>5등급 석차등급이 산출됩니다</b>. (체육·예술 계열이라도 표6 과목은 일반 체육·예술과 달리 등급이 나옵니다.)</p>
                <p className="mt-1.5 leading-relaxed" style={{ color: '#6B7489' }}>
                  해당 과목: 물리학 실험 · 화학 실험 · 생명과학 실험 · 지구과학 실험 · 고급 대수 · 기초 체육 전공 실기 · 음악과 문화 · 미술과 사회
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 mt-0.5 inline-flex items-center gap-0.5"
                style={{ background: '#FFE4E4', color: '#C53030', border: '1px solid #FCA5A5' }}>⚠ 등급X</span>
              <div>
                <p className="font-bold mb-1" style={{ color: '#C53030' }}>융합선택 중 사회·과학 9과목 (석차등급 산출 안 됨)</p>
                <p className="leading-relaxed">성취도(A~E)는 부여되지만 <b>석차등급은 산출되지 않습니다</b>. 입시 정량 평가에서 불리할 수 있어 신중히 선택하세요.</p>
                <p className="mt-1.5 leading-relaxed" style={{ color: '#6B7489' }}>
                  해당 과목: 여행지리 · 역사로 탐구하는 현대 세계 · 사회문제 탐구 · 금융과 경제생활 · 윤리문제 탐구 · 기후변화와 지속가능한 세계 · 과학의 역사와 문화 · 기후변화와 환경생태 · 융합과학 탐구
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 mt-0.5"
                style={{ background: '#F3E5F5', color: '#7B1FA2' }}>3단계</span>
              <p>체육·예술 교과(군) (표6 과목 제외). 성취도 A·B·C 3단계로 평가되며 석차등급이 없습니다.</p>
            </div>
          </div>

          <p className="text-[11px] italic pt-2 border-t" style={{ color: '#8893A8', borderColor: '#F0E6D2' }}>
            ※ 출처: 2022 개정 교육과정 학교생활기록부 기재 규정 / 2025학년도 입학생을 위한 안내서
          </p>
        </div>
      )}
    </div>
  );
}

// ============ 평가방식 배지 ============
function EvalBadge({ evalInfo, on }) {
  // 5등급 → 회색 배지 (정상)
  // 표6 과목 → 회색 배지에 ★ 표시 (특수목적고 선택과목)
  // 등급X (융합 9과목) → 빨강 강조 배지
  // 3단계 (체육·예술) → 보라 배지
  if (evalInfo.hasRank) {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold inline-flex items-center gap-0.5"
        title={evalInfo.detail}
        style={{
          background: on ? 'rgba(255,255,255,0.22)' : '#F0E6D2',
          color: on ? 'white' : '#6B7489',
        }}>
        {evalInfo.isPyo6 && <span style={{ color: on ? '#FFE082' : '#F57C00' }}>★</span>}
        {evalInfo.label}
      </span>
    );
  }
  if (evalInfo.label === '등급X') {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold inline-flex items-center gap-0.5"
        title={evalInfo.detail}
        style={{
          background: on ? 'rgba(255,255,255,0.25)' : '#FFE4E4',
          color: on ? 'white' : '#C53030',
          border: on ? '1px solid rgba(255,255,255,0.4)' : '1px solid #FCA5A5',
        }}>
        ⚠ 등급X
      </span>
    );
  }
  // 3단계 (체육·예술)
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
      title={evalInfo.detail}
      style={{
        background: on ? 'rgba(255,255,255,0.22)' : '#F3E5F5',
        color: on ? 'white' : '#7B1FA2',
      }}>
      {evalInfo.label}
    </span>
  );
}

function PdfModal({ subject, onClose }) {
  const url = getSubjectPdfUrl(subject);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!url) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(27,37,65,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: 'white' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ background: '#FFFBF0', borderBottom: '1.5px solid #F0E6D2' }}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#FFF3E0' }}>
              <FileText className="w-5 h-5" style={{ color: '#F57C00' }} />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-lg leading-tight truncate">{subject}</h3>
              <p className="text-xs" style={{ color: '#6B7489' }}>2022 개정 교육과정 과목 안내서</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition hover:scale-105"
              style={{ background: '#FF7A59', color: 'white' }}>
              새 창에서 열기
            </a>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center transition hover:bg-gray-100"
              style={{ color: '#6B7489' }} aria-label="닫기">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-gray-100 overflow-hidden">
          <iframe src={url} title={`${subject} 안내자료`}
            className="w-full h-full" style={{ border: 'none' }} />
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============ 선택 완료 버튼 ============
function CompleteButton({ groups, selected, onClick }) {
  const totalGroups = groups.length;
  const completedCount = groups.filter(g => (selected[g.id]?.size || 0) === g.nChoose).length;
  const isReady = completedCount === totalGroups && totalGroups > 0;
  const remaining = totalGroups - completedCount;

  return (
    <div className="mt-10 sticky bottom-4 z-30">
      <button onClick={isReady ? onClick : undefined}
        disabled={!isReady}
        className="w-full p-5 rounded-3xl flex items-center justify-center gap-3 transition-all"
        style={{
          background: isReady
            ? 'linear-gradient(135deg, #FF7A59, #FF5B8A)'
            : '#F5F0E4',
          color: isReady ? 'white' : '#B8B0A0',
          fontWeight: 700,
          cursor: isReady ? 'pointer' : 'not-allowed',
          boxShadow: isReady ? '0 8px 24px rgba(255,122,89,0.35)' : 'none',
          transform: isReady ? 'translateY(0)' : 'none',
        }}>
        <CheckCircle2 className="w-6 h-6" />
        <span className="font-display text-lg">
          {isReady
            ? '선택 완료! 내 교육과정 보기'
            : `${remaining}개 묶음을 더 채워주세요 (${completedCount}/${totalGroups})`
          }
        </span>
        {isReady && <ChevronRight className="w-5 h-5" />}
      </button>
    </div>
  );
}

// ============ 결과 화면 ============
function ResultScreen({ cohort, groups, selected, user, onEdit, onBack }) {
  const captureRef = useRef(null);
  const [saving, setSaving] = useState(false);

  // 선택된 과목 정보 정리
  const selectedDetails = useMemo(() => {
    const result = [];
    groups.forEach(g => {
      const picks = [...(selected[g.id] || [])];
      picks.forEach(name => {
        const subject = g.subjects.find(s => s.name === name);
        if (subject) {
          result.push({
            ...subject,
            grade: g.grade,
            semester: g.semester,
            credit: g.perCredit,
          });
        }
      });
    });
    return result;
  }, [groups, selected]);

  // 학년/학기별 그룹화
  const byGradeSemester = useMemo(() => {
    const map = {};
    selectedDetails.forEach(s => {
      const key = `${s.grade}-${s.semester}`;
      if (!map[key]) map[key] = { grade: s.grade, semester: s.semester, subjects: [], totalCredit: 0 };
      map[key].subjects.push(s);
      map[key].totalCredit += s.credit;
    });
    return Object.values(map).sort((a, b) =>
      a.grade !== b.grade ? a.grade - b.grade : a.semester - b.semester
    );
  }, [selectedDetails]);

  // 교과군별 통계
  const byGroup = useMemo(() => {
    const map = {};
    selectedDetails.forEach(s => {
      if (!map[s.group]) map[s.group] = { name: s.group, count: 0, credit: 0 };
      map[s.group].count += 1;
      map[s.group].credit += s.credit;
    });
    return Object.values(map).sort((a, b) => b.credit - a.credit);
  }, [selectedDetails]);

  // 유형별 통계
  const byType = useMemo(() => {
    const map = { '일반선택': 0, '진로선택': 0, '융합선택': 0 };
    selectedDetails.forEach(s => {
      if (map[s.type] !== undefined) map[s.type] += 1;
    });
    return map;
  }, [selectedDetails]);

  // 평가방식별 분류 (등급 산출 안 되는 과목 = 입시 정량평가에 영향 없는 과목)
  const noRankSubjects = useMemo(() =>
    selectedDetails.filter(s => !getEvaluationInfo(s).hasRank),
  [selectedDetails]);

  const totalCredit = selectedDetails.reduce((s, d) => s + d.credit, 0);
  const totalCount = selectedDetails.length;

  // 이미지로 저장
  const saveAsImage = async () => {
    if (!captureRef.current) return;
    setSaving(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#FFFBF0',
      });
      const link = document.createElement('a');
      link.download = `새롬고_교육과정_${user?.nickname || '나의설계'}_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('이미지 저장 실패:', err);
      alert('이미지 저장에 실패했어요. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 pt-8 pb-8">
      <BackButton onBack={onBack} />

      {/* 상단 액션 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#DDF5EA', color: '#3BC4A0' }}>
            <CheckCircle2 className="w-3 h-3 inline -mt-0.5 mr-1" />
            완료
          </span>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: cohort === 'g1' ? '#FFE8E0' : '#E0EDFF', color: cohort === 'g1' ? '#FF7A59' : '#2B7FFF' }}>
            {cohort === 'g1' ? '현재 고1 · 2026학년도 입학생' : '현재 고2 · 2025학년도 입학생'}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit}
            className="text-sm px-3 py-2 rounded-full inline-flex items-center gap-1.5"
            style={{ background: 'white', border: '1.5px solid #EADFC7', color: '#6B7489' }}>
            <Edit3 className="w-3.5 h-3.5" /> 다시 수정
          </button>
          <button onClick={saveAsImage} disabled={saving}
            className="text-sm px-3 py-2 rounded-full inline-flex items-center gap-1.5 transition"
            style={{
              background: '#FF7A59', color: 'white', fontWeight: 700,
              opacity: saving ? 0.6 : 1, cursor: saving ? 'wait' : 'pointer',
            }}>
            <Download className="w-3.5 h-3.5" /> {saving ? '저장 중...' : '이미지로 저장'}
          </button>
        </div>
      </div>

      {/* 캡처 영역 시작 */}
      <div ref={captureRef} className="rounded-3xl p-6 md:p-8" style={{ background: '#FFFBF0' }}>
        {/* 헤더 */}
        <div className="text-center mb-8 pb-6 border-b" style={{ borderColor: '#EADFC7' }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/saerom-logo.png" alt="새롬고" className="w-10 h-10" />
            <span className="font-display text-base" style={{ color: '#6B7489' }}>새롬고등학교 교육과정 박람회</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl mb-2">
            <span style={{ color: '#FF7A59' }}>{user?.nickname || '내'}</span>가 설계한 교육과정
          </h2>
          <p className="text-sm" style={{ color: '#6B7489' }}>
            총 <b style={{ color: '#FF7A59' }}>{totalCount}과목</b> · <b style={{ color: '#FF7A59' }}>{totalCredit}학점</b>
            {user?.student_id && <> · 학번 {user.student_id}</>}
          </p>
        </div>

        {/* 통계 카드 3개 */}
        <div className="grid md:grid-cols-3 gap-3 mb-8">
          <div className="p-4 rounded-2xl text-center" style={{ background: '#FFE8E0' }}>
            <p className="text-xs mb-1" style={{ color: '#B8552F' }}>총 이수 학점</p>
            <p className="font-display text-3xl" style={{ color: '#FF7A59' }}>{totalCredit}<span className="text-base">학점</span></p>
          </div>
          <div className="p-4 rounded-2xl text-center" style={{ background: '#E0EDFF' }}>
            <p className="text-xs mb-1" style={{ color: '#1B5FA8' }}>선택 과목 수</p>
            <p className="font-display text-3xl" style={{ color: '#2B7FFF' }}>{totalCount}<span className="text-base">과목</span></p>
          </div>
          <div className="p-4 rounded-2xl text-center" style={{ background: '#DDF5EA' }}>
            <p className="text-xs mb-1" style={{ color: '#1F8868' }}>주요 교과군</p>
            <p className="font-display text-2xl" style={{ color: '#3BC4A0' }}>{byGroup[0]?.name || '-'}</p>
          </div>
        </div>

        {/* 학년/학기별 정리 */}
        <div className="space-y-6 mb-8">
          {byGradeSemester.map(gs => (
            <div key={`${gs.grade}-${gs.semester}`}>
              <div className="flex items-baseline gap-3 mb-3">
                <h3 className="font-display text-xl">{gs.grade}학년 {gs.semester}학기</h3>
                <span className="text-sm" style={{ color: '#8893A8' }}>
                  {gs.subjects.length}과목 · {gs.totalCredit}학점
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {gs.subjects.map((s, i) => {
                  const groupColor = GROUP_COLORS[s.group] || '#8893A8';
                  const typeColor = TYPE_COLORS[s.type];
                  const evalInfo = getEvaluationInfo(s);
                  return (
                    <div key={`${s.name}-${i}`}
                      className="p-3 rounded-xl flex items-center gap-3"
                      style={{ background: 'white', border: '1.5px solid #F0E6D2' }}>
                      <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: groupColor }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className="font-bold text-sm">{s.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                            background: typeColor.bg, color: typeColor.fg,
                          }}>
                            {s.type.replace('선택', '')}
                          </span>
                          <EvalBadge evalInfo={evalInfo} on={false} />
                          {s.math && <span className="text-[10px]" title="수학중점">🔢</span>}
                          {s.sci && <span className="text-[10px]" title="과학중점">🔬</span>}
                        </div>
                        <p className="text-xs" style={{ color: '#8893A8' }}>
                          {s.group} · {s.credit}학점
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 교과군별 분포 */}
        <div className="mb-8">
          <h3 className="font-display text-xl mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" style={{ color: '#FF7A59' }} />
            교과군별 분포
          </h3>
          <div className="space-y-2">
            {byGroup.map(g => {
              const groupColor = GROUP_COLORS[g.name] || '#8893A8';
              const pct = (g.credit / totalCredit) * 100;
              return (
                <div key={g.name} className="flex items-center gap-3">
                  <span className="text-sm font-bold w-32 flex-shrink-0" style={{ color: '#1B2541' }}>{g.name}</span>
                  <div className="flex-1 h-7 rounded-full overflow-hidden flex items-center"
                    style={{ background: '#FFFBF0', border: '1px solid #EADFC7' }}>
                    <div className="h-full flex items-center px-2 transition-all duration-500"
                      style={{ width: `${Math.max(pct, 8)}%`, background: groupColor, color: 'white' }}>
                      <span className="text-xs font-bold whitespace-nowrap">{g.count}과목 · {g.credit}학점</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 유형별 작은 통계 */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {Object.entries(byType).map(([type, count]) => {
              const tc = TYPE_COLORS[type];
              return (
                <div key={type} className="p-3 rounded-xl text-center"
                  style={{ background: tc.bg }}>
                  <p className="text-[10px]" style={{ color: tc.fg }}>{type}</p>
                  <p className="font-display text-xl" style={{ color: tc.fg }}>{count}<span className="text-xs">과목</span></p>
                </div>
              );
            })}
          </div>

          {/* 등급 산출 안 되는 과목 알림 */}
          {noRankSubjects.length > 0 && (
            <div className="mt-3 p-4 rounded-xl"
              style={{ background: '#FFE4E4', border: '1.5px solid #FCA5A5' }}>
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C53030' }} />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm mb-1" style={{ color: '#C53030' }}>
                    석차등급이 산출되지 않는 과목 {noRankSubjects.length}개를 선택했어요
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#A82F2F' }}>
                    아래 과목들은 성취도(A~E 또는 A~C)만 부여되고 <b>석차등급은 산출되지 않습니다</b>. 입시 정량 평가에서 영향이 있을 수 있어요.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {noRankSubjects.map((s, i) => {
                  const ev = getEvaluationInfo(s);
                  return (
                    <span key={`${s.name}-${i}`} className="text-[11px] px-2 py-1 rounded-full inline-flex items-center gap-1"
                      style={{ background: 'white', color: '#C53030', border: '1px solid #FCA5A5' }}>
                      {s.name}
                      <span className="text-[9px] opacity-70">· {ev.label === '등급X' ? '등급X' : '3단계'}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* AI 피드백 영역 */}
        <div className="p-5 md:p-6 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #FFF8E8, #FFE8E0)', border: '1.5px solid #FFC93C' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF7A59, #FFC93C)' }}>
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg leading-tight">AI 진로 코칭</h3>
              <p className="text-[11px]" style={{ color: '#8B6814' }}>내가 설계한 교육과정에 대한 AI의 한 줄 평가</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white" style={{ border: '1px dashed #EADFC7' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#1B2541' }}>
              <span className="font-bold" style={{ color: '#FF7A59' }}>내가 설계한 교육과정은...</span>
            </p>
            <p className="text-sm mt-3" style={{ color: '#8893A8', fontStyle: 'italic' }}>
              ✨ 곧 AI 분석이 제공될 예정입니다. 박람회 본 행사에서 만나보세요!
            </p>
          </div>
        </div>

        {/* 푸터 (시뮬레이션 안내 강조) */}
        <div className="mt-8 p-4 rounded-2xl flex items-start gap-3"
          style={{ background: '#FFF3E0', border: '1.5px solid #FFC93C' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F57C00' }} />
          <p className="text-sm font-bold leading-relaxed" style={{ color: '#8B6814' }}>
            ※ 이 결과는 <span style={{ color: '#C53030' }}>시뮬레이션</span>이며,<br className="sm:hidden" />
            실제 과목 선택 시 변경될 수 있습니다.
          </p>
        </div>
      </div>
      {/* 캡처 영역 끝 */}

      {/* 하단 액션 (캡처 영역 밖) */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        <button onClick={onEdit}
          className="text-sm px-4 py-2.5 rounded-full inline-flex items-center gap-1.5"
          style={{ background: 'white', border: '1.5px solid #EADFC7', color: '#6B7489' }}>
          <Edit3 className="w-4 h-4" /> 다시 수정하기
        </button>
        <button onClick={saveAsImage} disabled={saving}
          className="text-sm px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 transition"
          style={{
            background: 'linear-gradient(135deg, #FF7A59, #FF5B8A)',
            color: 'white', fontWeight: 700,
            boxShadow: saving ? 'none' : '0 4px 12px rgba(255,122,89,0.3)',
            opacity: saving ? 0.6 : 1, cursor: saving ? 'wait' : 'pointer',
          }}>
          <Download className="w-4 h-4" /> {saving ? '저장 중...' : '이미지로 저장'}
        </button>
      </div>
    </main>
  );
}

// ============ 관리자 패널 ============
function AdminPanel({ onBack, user }) {
  const [tab, setTab] = useState('students');

  return (
    <main className="max-w-5xl mx-auto px-6 pt-8 pb-8">
      <BackButton onBack={onBack} />
      <div className="mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
          style={{ background: '#1B2541', color: '#FFC93C' }}>
          <ShieldCheck className="w-3 h-3 inline -mt-0.5 mr-1" />
          ADMIN
        </span>
        <h2 className="font-display text-4xl mb-3">관리자 패널</h2>
        <p style={{ color: '#4A5568' }}>{user.nickname} 선생님, 환영합니다.</p>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { k: 'students', label: '학생 관리', icon: Users },
          { k: 'booths', label: '부스 관리', icon: QrCode },
          { k: 'stats', label: '통계', icon: BarChart },
        ].map(t => {
          const Icon = t.icon;
          const on = tab === t.k;
          return (
            <button key={t.k} onClick={() => setTab(t.k)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-bold transition whitespace-nowrap"
              style={{ background: on ? '#1B2541' : '#FFFBF0', color: on ? '#FFC93C' : '#6B7489', border: '1.5px solid #EADFC7' }}>
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'students' && <AdminStudents adminUser={user} />}
      {tab === 'booths' && <AdminBooths />}
      {tab === 'stats' && <AdminStats />}
    </main>
  );
}

// ============ 학생 관리 ============
function AdminStudents({ adminUser }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [resetTarget, setResetTarget] = useState(null); // 비밀번호 초기화 대상
  const [resetDone, setResetDone] = useState(null); // 초기화 완료 표시 (임시 비밀번호 노출용)

  const loadStudents = async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.from('students')
      .select('student_id, nickname, career_paths, is_admin, created_at, last_login_at')
      .order('created_at', { ascending: false });
    if (data) setStudents(data);
    setLoading(false);
  };

  useEffect(() => { loadStudents(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(s =>
      (s.student_id || '').toLowerCase().includes(q) ||
      (s.nickname || '').toLowerCase().includes(q)
    );
  }, [students, query]);

  // 비밀번호 초기화: 임시 4자리 숫자 생성 → 해시 → DB 저장
  const performReset = async (student) => {
    // 4자리 임시 비밀번호 생성 (1000~9999)
    const tempPwd = String(Math.floor(1000 + Math.random() * 9000));
    const hash = await hashPassword(tempPwd);
    const { error } = await supabase.from('students')
      .update({ password_hash: hash })
      .eq('student_id', student.student_id);
    if (error) {
      alert('초기화에 실패했어요. 다시 시도해주세요.');
      return;
    }
    setResetDone({ student_id: student.student_id, nickname: student.nickname, tempPwd });
    setResetTarget(null);
  };

  return (
    <div>
      {/* 초기화 완료 알림 (임시 비밀번호 표시) */}
      {resetDone && (
        <div className="mb-4 p-4 rounded-2xl"
          style={{ background: '#DDF5EA', border: '2px solid #3BC4A0' }}>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#3BC4A0' }} />
            <div className="flex-1 min-w-0">
              <p className="font-display text-base mb-1">비밀번호 초기화 완료</p>
              <p className="text-sm mb-3" style={{ color: '#1F8868' }}>
                <b>{resetDone.nickname}</b> ({resetDone.student_id})의 임시 비밀번호:
              </p>
              <div className="p-3 rounded-xl bg-white text-center mb-2" style={{ border: '1.5px solid #3BC4A0' }}>
                <span className="font-display text-3xl tracking-[0.3em]" style={{ color: '#1B2541' }}>{resetDone.tempPwd}</span>
              </div>
              <p className="text-xs" style={{ color: '#1F8868' }}>
                💡 이 비밀번호를 학생에게 직접 전달하세요. 학생이 로그인 후 새 비밀번호로 변경하도록 안내해주세요. (현재는 변경 기능이 없어 한 번 더 초기화 필요)
              </p>
            </div>
            <button onClick={() => setResetDone(null)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white"
              style={{ color: '#1F8868' }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 초기화 확인 모달 */}
      {resetTarget && (
        <ConfirmModal
          title="비밀번호 초기화"
          message={`'${resetTarget.nickname}' (${resetTarget.student_id}) 학생의 비밀번호를 임시 4자리로 초기화할까요?\n\n초기화 후 임시 비밀번호가 화면에 표시되니, 학생에게 직접 전달해주세요.`}
          confirmLabel="초기화"
          confirmColor="#FF7A59"
          onConfirm={() => performReset(resetTarget)}
          onCancel={() => setResetTarget(null)}
        />
      )}

      {/* 검색 */}
      <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-full"
        style={{ background: 'white', border: '1.5px solid #EADFC7' }}>
        <Search className="w-4 h-4" style={{ color: '#8893A8' }} />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="학번 또는 닉네임으로 검색"
          className="flex-1 text-sm outline-none bg-transparent" />
        {query && (
          <button onClick={() => setQuery('')} className="w-5 h-5 rounded-full hover:bg-gray-100 flex items-center justify-center" style={{ color: '#8893A8' }}>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button onClick={loadStudents} title="새로고침"
          className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center" style={{ color: '#8893A8' }}>
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs mb-3" style={{ color: '#8893A8' }}>
        가입한 학생 {students.length}명 {query && `· 검색 결과 ${filtered.length}명`}
      </p>

      {loading ? (
        <div className="p-8 text-center text-sm" style={{ color: '#8893A8' }}>불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center rounded-2xl" style={{ background: '#FFFBF0', border: '1.5px dashed #EADFC7' }}>
          <Users className="w-7 h-7 mx-auto mb-2" style={{ color: '#EADFC7' }} />
          <p className="text-sm" style={{ color: '#8893A8' }}>{query ? '일치하는 학생이 없어요.' : '아직 가입한 학생이 없어요.'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(s => (
            <StudentRow key={s.student_id} student={s}
              isMe={s.student_id === adminUser.student_id}
              onResetPassword={() => setResetTarget(s)} />
          ))}
        </div>
      )}
    </div>
  );
}

function StudentRow({ student: s, isMe, onResetPassword }) {
  const created = new Date(s.created_at);
  const lastLogin = s.last_login_at ? new Date(s.last_login_at) : null;
  const careers = (s.career_paths || []).filter(Boolean);

  return (
    <div className="p-4 rounded-2xl flex items-center gap-3"
      style={{
        background: s.is_admin ? '#FFF3E0' : 'white',
        border: `1.5px solid ${s.is_admin ? '#FFC93C' : '#F0E6D2'}`
      }}>
      <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
        style={{ background: avatarColor(s.nickname) }}>
        {s.nickname.slice(0, 1).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <span className="font-bold text-sm">{s.nickname}</span>
          <span className="text-[11px] px-1.5 rounded-full" style={{ background: '#FFFBF0', color: '#8893A8', border: '1px solid #EADFC7' }}>
            {s.student_id}
          </span>
          {s.is_admin && (
            <span className="text-[10px] px-1.5 rounded-full font-bold inline-flex items-center gap-0.5"
              style={{ background: '#1B2541', color: '#FFC93C' }}>
              <ShieldCheck className="w-2.5 h-2.5" /> 관리자
            </span>
          )}
          {isMe && <span className="text-[10px] px-1.5 rounded-full font-bold" style={{ background: '#FFC93C', color: '#1B2541' }}>나</span>}
        </div>
        {careers.length > 0 && (
          <p className="text-xs mb-0.5" style={{ color: '#6B7489' }}>희망 진로: {careers.join(', ')}</p>
        )}
        <p className="text-[11px]" style={{ color: '#8893A8' }}>
          가입 {formatTime(created.getTime())}
          {lastLogin && ` · 최근 ${formatTime(lastLogin.getTime())}`}
        </p>
      </div>
      {!isMe && !s.is_admin && (
        <button onClick={onResetPassword}
          className="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1 transition hover:scale-105 flex-shrink-0"
          style={{ background: '#FF7A59', color: 'white', fontWeight: 700 }}>
          <KeyRound className="w-3 h-3" /> 비밀번호 초기화
        </button>
      )}
    </div>
  );
}

// ============ 부스 관리 ============
function AdminBooths() {
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const loadBooths = async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.from('booths')
      .select('*').order('category').order('name');
    if (data) setBooths(data);
    setLoading(false);
  };

  useEffect(() => { loadBooths(); }, []);

  const subjectBooths = booths.filter(b => b.category === 'subject');
  const seniorBooths = booths.filter(b => b.category === 'senior');

  const toggleActive = async (booth) => {
    await supabase.from('booths').update({ is_active: !booth.is_active }).eq('code', booth.code);
    loadBooths();
  };

  return (
    <div>
      {showAdd && (
        <BoothForm
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); loadBooths(); }}
        />
      )}
      {editTarget && (
        <BoothForm booth={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => { setEditTarget(null); loadBooths(); }}
        />
      )}

      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <p className="text-xs" style={{ color: '#8893A8' }}>
          전체 {booths.length}개 · 활성 {booths.filter(b => b.is_active).length}개
        </p>
        <div className="flex gap-2">
          <button onClick={loadBooths} title="새로고침"
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'white', border: '1.5px solid #EADFC7', color: '#6B7489' }}>
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowAdd(true)}
            className="text-sm px-3 py-2 rounded-full inline-flex items-center gap-1.5 transition hover:scale-105"
            style={{ background: '#FF7A59', color: 'white', fontWeight: 700 }}>
            <Plus className="w-3.5 h-3.5" /> 부스 추가
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm" style={{ color: '#8893A8' }}>불러오는 중...</div>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="font-display text-base mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" style={{ color: '#FF7A59' }} />
              과목별 부스 ({subjectBooths.length}개)
            </h4>
            <div className="space-y-2">
              {subjectBooths.length === 0 ? (
                <p className="text-xs italic px-3" style={{ color: '#8893A8' }}>등록된 부스가 없어요.</p>
              ) : subjectBooths.map(b => (
                <BoothRow key={b.code} booth={b}
                  onEdit={() => setEditTarget(b)}
                  onToggle={() => toggleActive(b)} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-base mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: '#2B7FFF' }} />
              선배 부스 ({seniorBooths.length}개)
            </h4>
            <div className="space-y-2">
              {seniorBooths.length === 0 ? (
                <p className="text-xs italic px-3" style={{ color: '#8893A8' }}>등록된 부스가 없어요.</p>
              ) : seniorBooths.map(b => (
                <BoothRow key={b.code} booth={b}
                  onEdit={() => setEditTarget(b)}
                  onToggle={() => toggleActive(b)} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 rounded-xl text-xs"
        style={{ background: '#FFF3E0', color: '#8B6814', border: '1px solid #FFC93C' }}>
        <p className="font-bold mb-1">💡 부스 관리 안내</p>
        <p className="leading-relaxed">
          · 부스 <b>코드는 한 번 만들면 변경 불가</b>합니다 (학생 방문 기록 보호).<br/>
          · 부스 이름·활성화 여부만 변경 가능.<br/>
          · 부스 비활성화 시 학생 미션 화면에서 사라지고 QR 적립도 막힙니다.<br/>
          · 새 부스를 추가하면 <b>새 QR을 인쇄해서 부착</b>해야 학생들이 이용할 수 있어요.
        </p>
      </div>
    </div>
  );
}

function BoothRow({ booth: b, onEdit, onToggle }) {
  return (
    <div className="p-3 rounded-xl flex items-center gap-3"
      style={{
        background: b.is_active ? 'white' : '#FAFAF5',
        border: `1.5px solid ${b.is_active ? '#F0E6D2' : '#EADFC7'}`,
        opacity: b.is_active ? 1 : 0.7,
      }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <span className="font-bold text-sm">{b.name}</span>
          {!b.is_active && (
            <span className="text-[10px] px-1.5 rounded-full font-bold" style={{ background: '#F0E6D2', color: '#8893A8' }}>
              비활성
            </span>
          )}
        </div>
        <p className="text-[11px] font-mono" style={{ color: '#8893A8' }}>코드: {b.code} · {b.points}P</p>
      </div>
      <button onClick={onToggle} title={b.is_active ? '비활성화' : '활성화'}
        className="w-9 h-9 rounded-full flex items-center justify-center transition hover:bg-gray-100">
        {b.is_active
          ? <ToggleRight className="w-5 h-5" style={{ color: '#3BC4A0' }} />
          : <ToggleLeft className="w-5 h-5" style={{ color: '#8893A8' }} />}
      </button>
      <button onClick={onEdit} title="수정"
        className="w-9 h-9 rounded-full flex items-center justify-center transition hover:bg-gray-100"
        style={{ color: '#6B7489' }}>
        <Edit3 className="w-4 h-4" />
      </button>
    </div>
  );
}

function BoothForm({ booth, onClose, onSaved }) {
  const isEdit = Boolean(booth);
  const [code, setCode] = useState(booth?.code || '');
  const [name, setName] = useState(booth?.name || '');
  const [category, setCategory] = useState(booth?.category || 'subject');
  const [points, setPoints] = useState(booth?.points || 10);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError('');
    const trimmedCode = code.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) return setError('부스 이름을 입력해주세요.');

    if (isEdit) {
      // 수정: 이름·활성화·포인트만 변경 가능 (코드 변경 불가)
      setSaving(true);
      const { error: e } = await supabase.from('booths')
        .update({ name: trimmedName, points: parseInt(points, 10) || 10 })
        .eq('code', booth.code);
      setSaving(false);
      if (e) return setError('수정 중 오류가 발생했어요.');
      onSaved();
    } else {
      // 추가: 코드 검증 + 중복 확인
      if (!/^[a-z0-9-]+$/.test(trimmedCode)) {
        return setError('코드는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있어요.');
      }
      if (trimmedCode.length < 3) return setError('코드는 3자 이상이어야 해요.');

      setSaving(true);
      // 중복 확인
      const { data: existing } = await supabase.from('booths')
        .select('code').eq('code', trimmedCode).maybeSingle();
      if (existing) {
        setSaving(false);
        return setError('이미 사용 중인 코드예요. 다른 코드를 입력해주세요.');
      }
      const { error: e } = await supabase.from('booths').insert({
        code: trimmedCode,
        name: trimmedName,
        category,
        points: parseInt(points, 10) || 10,
        is_active: true,
      });
      setSaving(false);
      if (e) return setError('추가 중 오류가 발생했어요.');
      onSaved();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(27,37,65,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden" style={{ background: 'white' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3"
          style={{ background: '#FFFBF0', borderBottom: '1.5px solid #F0E6D2' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#FFF3E0' }}>
              <QrCode className="w-5 h-5" style={{ color: '#FF7A59' }} />
            </div>
            <h3 className="font-display text-lg">{isEdit ? '부스 수정' : '부스 추가'}</h3>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
            style={{ color: '#6B7489' }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: '#1B2541' }}>
              부스 코드 (QR 텍스트) <span style={{ color: '#FF7A59' }}>*</span>
            </label>
            <input value={code} onChange={e => setCode(e.target.value)} disabled={isEdit}
              placeholder="예: subject-philosophy"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 font-mono"
              style={{
                background: isEdit ? '#FAFAF5' : 'white',
                border: '1.5px solid #EADFC7',
                color: isEdit ? '#8893A8' : '#1B2541',
              }} />
            <p className="text-[10px] mt-1" style={{ color: '#8893A8' }}>
              {isEdit ? '코드는 변경할 수 없어요.' : '영문 소문자, 숫자, 하이픈만. QR 코드에 들어갈 텍스트입니다.'}
            </p>
          </div>
          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: '#1B2541' }}>
              부스 이름 <span style={{ color: '#FF7A59' }}>*</span>
            </label>
            <input value={name} onChange={e => setName(e.target.value)} maxLength={40}
              placeholder="예: 철학 부스"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2"
              style={{ background: 'white', border: '1.5px solid #EADFC7' }} />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: '#1B2541' }}>
              부스 종류 {isEdit && <span className="text-[10px] font-normal" style={{ color: '#8893A8' }}>(변경 불가)</span>}
            </label>
            <div className="flex gap-2">
              {[
                { v: 'subject', label: '과목별 부스', color: '#FF7A59' },
                { v: 'senior', label: '선배 부스', color: '#2B7FFF' },
              ].map(opt => (
                <button key={opt.v} onClick={() => !isEdit && setCategory(opt.v)} disabled={isEdit}
                  className="flex-1 py-2 rounded-lg text-sm font-bold transition"
                  style={{
                    background: category === opt.v ? opt.color : 'white',
                    color: category === opt.v ? 'white' : '#6B7489',
                    border: `1.5px solid ${category === opt.v ? opt.color : '#EADFC7'}`,
                    cursor: isEdit ? 'not-allowed' : 'pointer',
                    opacity: isEdit && category !== opt.v ? 0.4 : 1,
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: '#1B2541' }}>
              방문 시 적립 포인트
            </label>
            <input type="number" value={points} onChange={e => setPoints(e.target.value)} min="1" max="100"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2"
              style={{ background: 'white', border: '1.5px solid #EADFC7' }} />
            <p className="text-[10px] mt-1" style={{ color: '#8893A8' }}>일반적으로 10P를 권장해요.</p>
          </div>
          {error && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: '#FFE4E4', color: '#A82F2F' }}>
              {error}
            </p>
          )}
          <div className="flex gap-2 pt-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-full text-sm"
              style={{ background: 'white', border: '1.5px solid #EADFC7', color: '#6B7489' }}>
              취소
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-full text-sm font-bold transition"
              style={{
                background: '#FF7A59', color: 'white',
                opacity: saving ? 0.6 : 1, cursor: saving ? 'wait' : 'pointer',
              }}>
              {saving ? '저장 중...' : isEdit ? '저장' : '추가'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============ 통계 ============
function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);

    const [{ data: students }, { data: posts }, { data: comments },
      { data: visits }, { data: rewards }, { data: booths }] = await Promise.all([
      supabase.from('students').select('student_id, is_admin, created_at'),
      supabase.from('posts').select('id, deleted_at, created_at'),
      supabase.from('post_comments').select('id, deleted_at, created_at'),
      supabase.from('booth_visits').select('student_id, booth_code, points'),
      supabase.from('mission_rewards').select('student_id, reward_type, points'),
      supabase.from('booths').select('code, is_active'),
    ]);

    // 학생별 점수 집계
    const scoreMap = {};
    (visits || []).forEach(v => { scoreMap[v.student_id] = (scoreMap[v.student_id] || 0) + (v.points || 0); });
    (rewards || []).forEach(r => { scoreMap[r.student_id] = (scoreMap[r.student_id] || 0) + (r.points || 0); });
    const scoreList = Object.values(scoreMap);

    // 미션별 완료자
    const simulationCompleted = new Set((rewards || []).filter(r => r.reward_type === 'simulation').map(r => r.student_id)).size;
    const postRewardCount = (rewards || []).filter(r => r.reward_type === 'post').length;
    const visitedStudents = new Set((visits || []).map(v => v.student_id)).size;

    setStats({
      totalStudents: (students || []).filter(s => !s.is_admin).length,
      totalAdmins: (students || []).filter(s => s.is_admin).length,
      totalPosts: (posts || []).filter(p => !p.deleted_at).length,
      deletedPosts: (posts || []).filter(p => p.deleted_at).length,
      totalComments: (comments || []).filter(c => !c.deleted_at).length,
      totalBooths: (booths || []).length,
      activeBooths: (booths || []).filter(b => b.is_active).length,
      simulationCompleted,
      postRewardCount,
      visitedStudents,
      totalVisits: (visits || []).length,
      avgPoints: scoreList.length > 0 ? Math.round(scoreList.reduce((s, p) => s + p, 0) / scoreList.length) : 0,
      maxPoints: scoreList.length > 0 ? Math.max(...scoreList) : 0,
      participantCount: scoreList.length,
    });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading || !stats) {
    return <div className="p-8 text-center text-sm" style={{ color: '#8893A8' }}>불러오는 중...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg">박람회 통계</h3>
        <button onClick={load} title="새로고침"
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'white', border: '1.5px solid #EADFC7', color: '#6B7489' }}>
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 가입자 */}
      <StatGroup title="가입 현황" icon={Users} color="#FF7A59" bg="#FFE8E0">
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="가입 학생" value={stats.totalStudents} unit="명" big />
          <StatBox label="관리자" value={stats.totalAdmins} unit="명" />
        </div>
      </StatGroup>

      {/* 미션 참여 */}
      <StatGroup title="미션 참여" icon={Trophy} color="#FFC93C" bg="#FFF3E0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatBox label="시뮬레이션 완주" value={stats.simulationCompleted} unit="명" />
          <StatBox label="글 적립 학생" value={new Set([]).size} unit="명" hidden />
          <StatBox label="부스 방문 학생" value={stats.visitedStudents} unit="명" />
          <StatBox label="총 부스 방문" value={stats.totalVisits} unit="회" />
          <StatBox label="50자+ 글 적립" value={stats.postRewardCount} unit="건" />
        </div>
      </StatGroup>

      {/* 점수 분포 */}
      <StatGroup title="점수 분포" icon={Award} color="#3BC4A0" bg="#DDF5EA">
        <div className="grid grid-cols-3 gap-2">
          <StatBox label="참여자 수" value={stats.participantCount} unit="명" />
          <StatBox label="평균 점수" value={stats.avgPoints} unit="P" big />
          <StatBox label="최고 점수" value={stats.maxPoints} unit="P" />
        </div>
      </StatGroup>

      {/* 커뮤니티 */}
      <StatGroup title="커뮤니티 활동" icon={MessageSquare} color="#2B7FFF" bg="#E0EDFF">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <StatBox label="살아있는 글" value={stats.totalPosts} unit="건" />
          <StatBox label="살아있는 댓글" value={stats.totalComments} unit="건" />
          <StatBox label="삭제된 글" value={stats.deletedPosts} unit="건" />
        </div>
      </StatGroup>

      {/* 부스 */}
      <StatGroup title="부스 운영" icon={QrCode} color="#A56BFF" bg="#F0E6FF">
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="전체 부스" value={stats.totalBooths} unit="개" />
          <StatBox label="활성 부스" value={stats.activeBooths} unit="개" />
        </div>
      </StatGroup>
    </div>
  );
}

function StatGroup({ title, icon: Icon, color, bg, children }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'white', border: '1.5px solid #F0E6D2' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h4 className="font-display text-base">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function StatBox({ label, value, unit, big, hidden }) {
  if (hidden) return null;
  return (
    <div className="p-3 rounded-xl text-center" style={{ background: '#FFFBF0' }}>
      <p className="text-[10px] mb-0.5" style={{ color: '#8893A8' }}>{label}</p>
      <p className="font-display flex items-baseline justify-center gap-0.5" style={{ color: '#1B2541' }}>
        <span className={big ? 'text-3xl' : 'text-2xl'}>{value}</span>
        <span className="text-xs" style={{ color: '#8893A8' }}>{unit}</span>
      </p>
    </div>
  );
}

// ============ 확인 모달 (재사용) ============
function ConfirmModal({ title, message, confirmLabel, confirmColor = '#FF7A59', onConfirm, onCancel }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(27,37,65,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}>
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: 'white' }}
        onClick={e => e.stopPropagation()}>
        <div className="p-5">
          <h3 className="font-display text-lg mb-2">{title}</h3>
          <p className="text-sm whitespace-pre-wrap mb-4" style={{ color: '#4A5568' }}>{message}</p>
          <div className="flex gap-2">
            <button onClick={onCancel}
              className="flex-1 py-2.5 rounded-full text-sm"
              style={{ background: 'white', border: '1.5px solid #EADFC7', color: '#6B7489' }}>
              취소
            </button>
            <button onClick={onConfirm}
              className="flex-1 py-2.5 rounded-full text-sm font-bold"
              style={{ background: confirmColor, color: 'white' }}>
              {confirmLabel || '확인'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Programs({ onBack }) {
  return (
    <main className="max-w-6xl mx-auto px-6 pt-8 pb-8">
      <BackButton onBack={onBack} />
      <div className="mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#E0EDFF', color: '#2B7FFF' }}>STEP 2</span>
        <h2 className="font-display text-4xl mb-3">학교 특색 프로그램</h2>
        <p style={{ color: '#4A5568' }}>
          새롬고가 특별히 공들여 운영하는 프로그램들이에요. 관심 있는 분야를 미리 체크하고 적극 참여해 보세요.
        </p>
      </div>

      {/* 안내 박스 */}
      <div className="mb-8 p-4 rounded-2xl flex items-start gap-3"
        style={{ background: '#FFF8E8', border: '1.5px solid #FFC93C' }}>
        <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: '#FFC93C' }}>
          <Lightbulb className="w-5 h-5" style={{ color: '#1B2541' }} />
        </div>
        <div className="text-sm" style={{ color: '#8B6814' }}>
          <p className="font-bold mb-1">프로그램 미리 체크하기</p>
          <p className="leading-relaxed">언제, 어떤 프로그램에 참여할지 미리 체크해 두면 학교생활을 더 알차고 주도적으로 만들 수 있어요. 자세한 운영 계획은 추후 학교 안내를 확인해주세요.</p>
        </div>
      </div>

      {/* 카테고리별 섹션 */}
      <div className="space-y-10 mb-12">
        {PROGRAM_CATEGORIES.map(cat => {
          const items = PROGRAMS.filter(p => p.category === cat.key);
          if (items.length === 0) return null;
          const CatIcon = cat.icon;
          return (
            <section key={cat.key}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: cat.bg }}>
                  <CatIcon className="w-5 h-5" style={{ color: cat.color }} />
                </div>
                <div>
                  <h3 className="font-display text-2xl">{cat.label}</h3>
                  <p className="text-xs" style={{ color: '#8893A8' }}>{items.length}개 프로그램</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {items.map((p, i) => (
                  <ProgramCard key={p.title} program={p} catColor={cat.color} catBg={cat.bg} idx={i} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* 월별 운영 타임라인 */}
      <ProgramTimeline />

      {/* 푸터 안내 */}
      <p className="mt-8 text-xs text-center" style={{ color: '#8893A8' }}>
        ※ 학교 상황에 따라 세부 일정은 변경될 수 있습니다.<br/>
        출처: 2026학년도 제2호 교육과정 톺아보기 (2026.4.5 발행)
      </p>
    </main>
  );
}

function ProgramCard({ program: p, catColor, catBg, idx }) {
  const Icon = p.icon;
  return (
    <div className="p-5 rounded-2xl bg-white hover:-translate-y-0.5 transition-transform"
      style={{ border: '1.5px solid #F0E6D2', animation: `fadeIn 0.4s ease-out ${idx * 0.05}s both` }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: catBg }}>
          <Icon className="w-5 h-5" style={{ color: catColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display text-lg leading-tight mb-1.5">{p.title}</h4>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
              style={{ background: catBg, color: catColor }}>
              <Clock className="w-2.5 h-2.5" /> {p.period}
            </span>
            {p.target && (
              <span className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ background: '#FFFBF0', color: '#6B7489', border: '1px solid #EADFC7' }}>
                {p.target}
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed mb-3" style={{ color: '#4A5568' }}>{p.desc}</p>
      {p.note && (
        <p className="text-xs italic mb-3 px-3 py-1.5 rounded-lg"
          style={{ background: '#FFFBF0', color: '#8B6814', borderLeft: `3px solid ${catColor}` }}>
          💡 {p.note}
        </p>
      )}
      {p.tags && (
        <div className="flex gap-1 flex-wrap">
          {p.tags.map(t => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ background: '#FFFBF0', color: '#6B7489' }}>#{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// 월별 운영 타임라인 표
function ProgramTimeline() {
  const months = [3,4,5,6,7,8,9,10,11,12];

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: '#FFF3E0' }}>
          <Clock className="w-5 h-5" style={{ color: '#F57C00' }} />
        </div>
        <div>
          <h3 className="font-display text-2xl">월별 운영 타임라인</h3>
          <p className="text-xs" style={{ color: '#8893A8' }}>한눈에 보는 연간 프로그램 일정</p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1.5px solid #F0E6D2' }}>
        {/* 가로 스크롤 컨테이너 */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs timeline-table" style={{ minWidth: '720px', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#FFFBF0' }}>
                <th className="timeline-name-col text-left px-2 sm:px-3 py-2 font-display font-bold sticky left-0"
                  style={{ background: '#FFFBF0', color: '#1B2541', borderBottom: '1.5px solid #EADFC7' }}>
                  프로그램
                </th>
                {months.map(m => (
                  <th key={m} className="px-1 py-2 text-center font-bold"
                    style={{ color: '#6B7489', borderBottom: '1.5px solid #EADFC7', minWidth: '52px' }}>
                    {m}월
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROGRAM_CATEGORIES.map(cat => {
                const items = PROGRAMS.filter(p => p.category === cat.key);
                return (
                  <React.Fragment key={cat.key}>
                    <tr>
                      <td colSpan={months.length + 1} className="px-3 py-2 font-bold"
                        style={{ background: cat.bg, color: cat.color, borderBottom: `1px solid ${cat.color}33` }}>
                        <span className="inline-flex items-center gap-1.5">
                          <cat.icon className="w-3.5 h-3.5" />
                          {cat.label}
                        </span>
                      </td>
                    </tr>
                    {items.map(p => (
                      <tr key={p.title} className="hover:bg-gray-50">
                        <td className="timeline-name-col px-2 sm:px-3 py-2 sticky left-0"
                          style={{ background: 'white', borderBottom: '1px solid #F0E6D2', borderRight: '1px solid #F0E6D2' }}>
                          <p className="timeline-name font-bold leading-tight">{p.title}</p>
                          <p className="timeline-target mt-0.5" style={{ color: '#8893A8' }}>{p.target}</p>
                        </td>
                        {months.map(m => {
                          const active = p.months?.includes(m);
                          // 연속된 월인지 판단해서 막대 형태로 표현
                          const prevActive = p.months?.includes(m - 1);
                          const nextActive = p.months?.includes(m + 1);
                          let radius = '0';
                          if (active && !prevActive && !nextActive) radius = '999px';
                          else if (active && !prevActive) radius = '999px 0 0 999px';
                          else if (active && !nextActive) radius = '0 999px 999px 0';
                          return (
                            <td key={m} className="px-0 py-2"
                              style={{ borderBottom: '1px solid #F0E6D2', minWidth: '52px' }}>
                              {active && (
                                <div className="h-5"
                                  style={{ background: cat.color, borderRadius: radius }} />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 타임라인 반응형 스타일 */}
      <style>{`
        /* 모바일: 프로그램명 칸 좁게, 글자 작게, target 숨김 */
        .timeline-name-col {
          width: 130px;
          min-width: 130px;
          max-width: 130px;
        }
        .timeline-name {
          font-size: 11px;
        }
        .timeline-target {
          font-size: 10px;
          display: none;
        }
        /* 데스크탑(640px 이상): 프로그램명 칸 넉넉하게, target 표시 */
        @media (min-width: 640px) {
          .timeline-name-col {
            width: auto;
            min-width: 220px;
            max-width: none;
          }
          .timeline-name {
            font-size: 12px;
          }
          .timeline-target {
            display: block;
          }
        }
      `}</style>

      {/* 모바일 안내 */}
      <p className="mt-2 text-xs text-center md:hidden" style={{ color: '#8893A8' }}>
        ← 좌우로 스크롤해서 모든 월을 확인하세요 →
      </p>
    </section>
  );
}

function Fair({ onBack, user }) {
  const [tab, setTab] = useState('mission');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booths, setBooths] = useState([]);
  const [myVisits, setMyVisits] = useState([]); // 내 부스 방문 기록
  const [myRewards, setMyRewards] = useState([]); // 내 자동 적립 기록
  const [allScores, setAllScores] = useState([]); // 전체 학생 랭킹용
  const [scanning, setScanning] = useState(false); // QR 스캐너 표시 여부
  const [scanResult, setScanResult] = useState(null); // 스캔 결과 토스트

  // 데이터 로드
  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }

    const loadAll = async () => {
      // 게시글
      const { data: postsData } = await supabase
        .from('posts')
        .select('*, likes:post_likes(user_id), comments:post_comments(*)')
        .order('created_at', { ascending: false });
      if (postsData) {
        setPosts(postsData.map(p => ({
          ...p,
          likes: (p.likes || []).map(l => l.user_id),
          comments: (p.comments || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
        })));
      }

      // 부스 목록
      const { data: boothsData } = await supabase
        .from('booths').select('*').eq('is_active', true).order('category').order('name');
      if (boothsData) setBooths(boothsData);

      // 내 부스 방문 기록
      const { data: visitsData } = await supabase
        .from('booth_visits').select('*').eq('student_id', user.student_id);
      if (visitsData) setMyVisits(visitsData);

      // 내 자동 적립 기록
      const { data: rewardsData } = await supabase
        .from('mission_rewards').select('*').eq('student_id', user.student_id);
      if (rewardsData) setMyRewards(rewardsData);

      // 전체 학생 점수 집계 (랭킹용)
      await loadRanking();
      setLoading(false);
    };

    const loadRanking = async () => {
      // 모든 booth_visits + mission_rewards를 가져와서 학번별로 합산
      const [{ data: allVisits }, { data: allRewards }, { data: students }] = await Promise.all([
        supabase.from('booth_visits').select('student_id, points'),
        supabase.from('mission_rewards').select('student_id, points'),
        supabase.from('students').select('student_id, nickname'),
      ]);
      const map = {};
      const studentMap = {};
      (students || []).forEach(s => { studentMap[s.student_id] = s.nickname; });
      (allVisits || []).forEach(v => { map[v.student_id] = (map[v.student_id] || 0) + (v.points || 0); });
      (allRewards || []).forEach(r => { map[r.student_id] = (map[r.student_id] || 0) + (r.points || 0); });
      const ranking = Object.entries(map)
        .map(([sid, pts]) => ({ student_id: sid, nickname: studentMap[sid] || '?', points: pts }))
        .filter(r => r.points > 0)
        .sort((a, b) => b.points - a.points);
      setAllScores(ranking);
    };

    loadAll();

    const channel = supabase.channel('fair-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'booth_visits' }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mission_rewards' }, loadAll)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user.student_id]);

  // QR 스캔 처리
  const handleQrScan = async (decodedText) => {
    if (!decodedText) return;
    const code = String(decodedText).trim().toLowerCase();

    // 부스 검증
    const booth = booths.find(b => b.code === code);
    if (!booth) {
      setScanResult({ kind: 'error', message: '등록되지 않은 QR 코드예요. 부스 운영자에게 문의하세요.' });
      setScanning(false);
      setTimeout(() => setScanResult(null), 4000);
      return;
    }

    // 이미 방문한 부스인지 확인
    const already = myVisits.find(v => v.booth_code === booth.code);
    if (already) {
      setScanResult({ kind: 'warning', message: `${booth.name}은(는) 이미 방문한 부스예요. 다른 부스를 방문해주세요!` });
      setScanning(false);
      setTimeout(() => setScanResult(null), 4000);
      return;
    }

    // 적립 시도
    const { error } = await supabase.from('booth_visits').insert({
      student_id: user.student_id,
      booth_code: booth.code,
      points: booth.points,
    });

    if (error) {
      // 중복 키 에러 - 다른 탭에서 이미 적립된 경우
      if (error.code === '23505') {
        setScanResult({ kind: 'warning', message: `${booth.name}은(는) 이미 방문한 부스예요.` });
      } else {
        setScanResult({ kind: 'error', message: '적립 중 오류가 발생했어요. 다시 시도해주세요.' });
      }
    } else {
      setScanResult({ kind: 'success', message: `🎉 ${booth.name} 방문! +${booth.points}P 적립 완료` });
    }
    setScanning(false);
    setTimeout(() => setScanResult(null), 4000);
  };

  // 게시글 작성: 50자 이상이면 자동 포인트 적립
  const submitPost = async (content) => {
    if (!isSupabaseConfigured) return;
    const { data, error } = await supabase.from('posts')
      .insert({
        nickname: user.nickname,
        student_id: user.student_id,
        content,
      })
      .select().single();

    if (error || !data) return;

    // 50자 이상 + 최대 5회 자동 적립
    const charCount = (content || '').length; // 공백 포함
    if (charCount >= 50) {
      const myPostRewards = myRewards.filter(r => r.reward_type === 'post');
      if (myPostRewards.length < 5) {
        await supabase.from('mission_rewards').insert({
          student_id: user.student_id,
          reward_type: 'post',
          post_id: data.id,
          points: 10,
        });
      }
    }
  };

  const toggleLike = async (postId) => {
    if (!isSupabaseConfigured) return;
    const post = posts.find(p => p.id === postId);
    const hasLiked = post?.likes?.includes(user.student_id);
    if (hasLiked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.student_id);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.student_id });
    }
  };

  const addComment = async (postId, content) => {
    if (!isSupabaseConfigured) return;
    await supabase.from('post_comments').insert({
      post_id: postId,
      nickname: user.nickname,
      student_id: user.student_id,
      content,
    });
  };

  // 게시글 수정
  const editPost = async (postId, newContent) => {
    if (!isSupabaseConfigured) return false;
    const { error } = await supabase.from('posts')
      .update({ content: newContent, updated_at: new Date().toISOString() })
      .eq('id', postId)
      .eq('student_id', user.student_id); // 본인만 수정 가능
    return !error;
  };

  // 게시글 삭제 (soft delete, 본인이거나 관리자만 가능)
  const deletePost = async (postId, isAdminDeletion = false) => {
    if (!isSupabaseConfigured) return false;
    const update = {
      deleted_at: new Date().toISOString(),
      deleted_by: isAdminDeletion ? 'admin' : 'self',
    };
    let q = supabase.from('posts').update(update).eq('id', postId);
    // 관리자 삭제가 아니면 본인 글만 삭제 가능
    if (!isAdminDeletion || !user.is_admin) {
      q = q.eq('student_id', user.student_id);
    }
    const { error } = await q;
    return !error;
  };

  // 댓글 수정
  const editComment = async (commentId, newContent) => {
    if (!isSupabaseConfigured) return false;
    const { error } = await supabase.from('post_comments')
      .update({ content: newContent, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .eq('student_id', user.student_id);
    return !error;
  };

  // 댓글 삭제 (soft delete, 본인이거나 관리자만 가능)
  const deleteComment = async (commentId, isAdminDeletion = false) => {
    if (!isSupabaseConfigured) return false;
    const update = {
      deleted_at: new Date().toISOString(),
      deleted_by: isAdminDeletion ? 'admin' : 'self',
    };
    let q = supabase.from('post_comments').update(update).eq('id', commentId);
    if (!isAdminDeletion || !user.is_admin) {
      q = q.eq('student_id', user.student_id);
    }
    const { error } = await q;
    return !error;
  };

  // 내 점수 계산
  const myPoints = useMemo(() => {
    const visitPts = myVisits.reduce((s, v) => s + (v.points || 0), 0);
    const rewardPts = myRewards.reduce((s, r) => s + (r.points || 0), 0);
    return visitPts + rewardPts;
  }, [myVisits, myRewards]);

  const myRank = useMemo(() => {
    const idx = allScores.findIndex(s => s.student_id === user.student_id);
    return idx >= 0 ? idx + 1 : null;
  }, [allScores, user.student_id]);

  return (
    <main className="max-w-6xl mx-auto px-6 pt-8 pb-8">
      <BackButton onBack={onBack} />
      <div className="mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#DDF5EA', color: '#3BC4A0' }}>STEP 3</span>
        <h2 className="font-display text-4xl mb-3">박람회 미션 & 커뮤니티</h2>
        <p style={{ color: '#4A5568' }}>QR을 스캔하고 글을 남기며 포인트를 모아보세요. 부정 적립이 불가하도록 모든 점수는 자동으로 인증됩니다.</p>
      </div>

      {/* 내 점수 + 내 등수 */}
      <div className="p-5 rounded-2xl mb-6" style={{ background: '#1B2541', color: '#FFFBF0' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <Award className="w-8 h-8" style={{ color: '#FFC93C' }} />
          <div className="flex-1 min-w-[200px]">
            <p className="text-xs opacity-70">내 누적 포인트</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl" style={{ color: '#FFC93C' }}>{myPoints}</span>
              <span className="text-sm opacity-70">P</span>
            </div>
          </div>
          {myRank && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl" style={{ background: 'rgba(255,201,60,0.15)' }}>
              <TrendingUp className="w-5 h-5" style={{ color: '#FFC93C' }} />
              <div>
                <p className="text-[10px] opacity-70 leading-none mb-0.5">현재 등수</p>
                <p className="font-display text-lg leading-none" style={{ color: '#FFC93C' }}>{myRank}위</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-6">
        {[
          { k: 'mission', label: '미션', icon: Trophy },
          { k: 'ranking', label: '미션 실시간 TOP 10', icon: Crown },
          { k: 'community', label: '커뮤니티', icon: MessageSquare },
        ].map(t => {
          const Icon = t.icon;
          const on = tab === t.k;
          return (
            <button key={t.k} onClick={() => setTab(t.k)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-bold transition whitespace-nowrap"
              style={{ background: on ? '#1B2541' : '#FFFBF0', color: on ? '#FFFBF0' : '#6B7489', border: '1.5px solid #EADFC7' }}>
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* 스캔 결과 토스트 */}
      {scanResult && (
        <div className="mb-4 p-4 rounded-2xl flex items-center gap-3 fade-in"
          style={{
            background: scanResult.kind === 'success' ? '#DDF5EA' : scanResult.kind === 'warning' ? '#FFF3E0' : '#FFE4E4',
            border: `2px solid ${scanResult.kind === 'success' ? '#3BC4A0' : scanResult.kind === 'warning' ? '#F57C00' : '#E74C3C'}`,
          }}>
          <span className="font-display text-base">{scanResult.message}</span>
        </div>
      )}

      {tab === 'mission' && <MissionList user={user} booths={booths} myVisits={myVisits} myRewards={myRewards} onScanQr={() => setScanning(true)} />}
      {tab === 'ranking' && <Ranking allScores={allScores} myStudentId={user.student_id} />}
      {tab === 'community' && <Community posts={posts} loading={loading} user={user}
        onSubmit={submitPost} onToggleLike={toggleLike} onAddComment={addComment}
        onEditPost={editPost} onDeletePost={deletePost}
        onEditComment={editComment} onDeleteComment={deleteComment} />}

      {/* QR 스캐너 모달 */}
      {scanning && <QrScannerModal onScan={handleQrScan} onClose={() => setScanning(false)} />}
    </main>
  );
}

function MissionList({ user, booths, myVisits, myRewards, onScanQr }) {
  const subjectBooths = booths.filter(b => b.category === 'subject');
  const seniorBooths = booths.filter(b => b.category === 'senior');
  const visitedSubject = myVisits.filter(v => subjectBooths.some(b => b.code === v.booth_code));
  const visitedSenior = myVisits.filter(v => seniorBooths.some(b => b.code === v.booth_code));
  const simulationDone = myRewards.some(r => r.reward_type === 'simulation');
  const postRewards = myRewards.filter(r => r.reward_type === 'post');

  return (
    <div className="space-y-4">
      {/* QR 스캔 버튼 (항상 상단) */}
      <button onClick={onScanQr}
        className="w-full p-5 rounded-2xl flex items-center gap-4 transition hover:scale-[1.01]"
        style={{
          background: 'linear-gradient(135deg, #FF7A59, #FF5B8A)',
          color: 'white',
          boxShadow: '0 6px 16px rgba(255,122,89,0.3)'
        }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.22)' }}>
          <QrCode className="w-6 h-6" />
        </div>
        <div className="flex-1 text-left">
          <h4 className="font-display text-xl">부스 QR 스캔하기</h4>
          <p className="text-sm opacity-90">과목별 부스 / 선배 부스에서 QR을 비추면 자동 적립</p>
        </div>
        <Camera className="w-5 h-5 opacity-80" />
      </button>

      {/* 미션 1: 과목별 부스 방문 */}
      <MissionCard
        icon={BookOpen} color="#FF7A59" bg="#FFE8E0"
        title="과목별 부스 방문"
        desc="과목 부스에서 QR을 스캔하면 1부스당 10P 적립"
        progress={`${visitedSubject.length} / ${subjectBooths.length || '?'} 부스`}
        points={visitedSubject.reduce((s, v) => s + v.points, 0)}
        details={visitedSubject.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {visitedSubject.map(v => {
              const b = subjectBooths.find(b => b.code === v.booth_code);
              return (
                <span key={v.booth_code} className="text-xs px-2 py-1 rounded-full inline-flex items-center gap-1"
                  style={{ background: '#3BC4A0', color: 'white' }}>
                  <Check className="w-3 h-3" /> {b?.name || v.booth_code}
                </span>
              );
            })}
          </div>
        )}
      />

      {/* 미션 2: 선배와의 만남 */}
      <MissionCard
        icon={Users} color="#2B7FFF" bg="#E0EDFF"
        title="선배와의 만남"
        desc="선배 부스에서 QR을 스캔하면 1부스당 10P 적립"
        progress={`${visitedSenior.length} / ${seniorBooths.length || '?'} 부스`}
        points={visitedSenior.reduce((s, v) => s + v.points, 0)}
        details={visitedSenior.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {visitedSenior.map(v => {
              const b = seniorBooths.find(b => b.code === v.booth_code);
              return (
                <span key={v.booth_code} className="text-xs px-2 py-1 rounded-full inline-flex items-center gap-1"
                  style={{ background: '#3BC4A0', color: 'white' }}>
                  <Check className="w-3 h-3" /> {b?.name || v.booth_code}
                </span>
              );
            })}
          </div>
        )}
      />

      {/* 미션 3: 시뮬레이션 완주 */}
      <MissionCard
        icon={Target} color="#A56BFF" bg="#F0E6FF"
        title="과목 선택 시뮬레이션 완주"
        desc="시뮬레이션을 끝까지 완료하면 자동 적립 (최초 1회 10P)"
        progress={simulationDone ? '✅ 완료' : '미완료'}
        points={simulationDone ? 10 : 0}
        completed={simulationDone}
      />

      {/* 미션 4: 커뮤니티 활동 */}
      <MissionCard
        icon={MessageSquare} color="#3BC4A0" bg="#DDF5EA"
        title="박람회 커뮤니티 활동"
        desc="50자 이상 글을 남기면 글당 10P (최대 5회 50P)"
        progress={`${postRewards.length} / 5 글`}
        points={postRewards.reduce((s, r) => s + r.points, 0)}
        completed={postRewards.length >= 5}
      />

      <div className="p-3 rounded-xl flex items-start gap-2 text-xs"
        style={{ background: '#FFFBF0', color: '#6B7489', border: '1px solid #EADFC7' }}>
        <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          모든 포인트는 부정 적립을 막기 위해 자동·외부 인증 방식으로 적립됩니다.
          QR 스캔은 부스 운영자에게서, 시뮬레이션은 완주 시, 커뮤니티는 50자 이상 작성 시 자동 적립.
        </span>
      </div>
    </div>
  );
}

function MissionCard({ icon: Icon, color, bg, title, desc, progress, points, details, completed }) {
  return (
    <div className="p-5 rounded-2xl"
      style={{
        background: completed ? '#DDF5EA' : 'white',
        border: `1.5px solid ${completed ? '#3BC4A0' : '#F0E6D2'}`
      }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center"
          style={{ background: completed ? '#3BC4A0' : bg }}>
          <Icon className="w-6 h-6" style={{ color: completed ? 'white' : color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
            <h4 className="font-display text-lg">{title}</h4>
            <span className="text-sm font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{ background: points > 0 ? '#FFC93C' : '#FFF0D6', color: points > 0 ? '#1B2541' : '#B8852F' }}>
              +{points}P
            </span>
          </div>
          <p className="text-sm mb-2" style={{ color: '#6B7489' }}>{desc}</p>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full inline-block"
            style={{ background: '#FFFBF0', color: color, border: `1px solid ${color}33` }}>
            {progress}
          </span>
          {details}
        </div>
      </div>
    </div>
  );
}

// 실시간 랭킹 TOP 10
function Ranking({ allScores, myStudentId }) {
  const top10 = allScores.slice(0, 10);
  const myEntry = allScores.find(s => s.student_id === myStudentId);
  const myRank = allScores.findIndex(s => s.student_id === myStudentId);
  const isMeInTop10 = myRank >= 0 && myRank < 10;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5" style={{ color: '#FFC93C' }} />
        <h3 className="font-display text-xl">미션 실시간 TOP 10</h3>
        <span className="text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1"
          style={{ background: '#FFE4E4', color: '#E74C3C' }}>
          <Flame className="w-3 h-3" /> LIVE
        </span>
      </div>

      {top10.length === 0 ? (
        <div className="p-10 text-center rounded-2xl" style={{ background: '#FFFBF0', border: '1.5px dashed #EADFC7' }}>
          <Crown className="w-8 h-8 mx-auto mb-3" style={{ color: '#EADFC7' }} />
          <p className="text-sm" style={{ color: '#8893A8' }}>아직 점수를 적립한 학생이 없어요.</p>
          <p className="text-sm font-bold mt-1" style={{ color: '#FF7A59' }}>1등의 주인공이 되어보세요!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {top10.map((entry, i) => {
            const isMe = entry.student_id === myStudentId;
            return <RankRow key={entry.student_id} rank={i + 1} entry={entry} isMe={isMe} />;
          })}
        </div>
      )}

      {/* 내가 TOP 10에 없으면 별도 표시 */}
      {myEntry && !isMeInTop10 && (
        <>
          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 border-t border-dashed" style={{ borderColor: '#EADFC7' }} />
            <span className="text-xs" style={{ color: '#8893A8' }}>...</span>
            <div className="flex-1 border-t border-dashed" style={{ borderColor: '#EADFC7' }} />
          </div>
          <RankRow rank={myRank + 1} entry={myEntry} isMe={true} />
        </>
      )}
    </div>
  );
}

function RankRow({ rank, entry, isMe }) {
  const medalIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
  return (
    <div className="p-4 rounded-2xl flex items-center gap-3"
      style={{
        background: isMe ? '#FFF3E0' : 'white',
        border: `1.5px solid ${isMe ? '#FFC93C' : '#F0E6D2'}`
      }}>
      <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-display"
        style={{
          background: rank <= 3 ? '#1B2541' : '#FFFBF0',
          color: rank <= 3 ? '#FFC93C' : '#6B7489',
          fontSize: medalIcon ? '20px' : '14px',
        }}>
        {medalIcon || rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-sm">{entry.nickname}</span>
          <span className="text-[11px] px-1.5 rounded-full" style={{ background: '#FFFBF0', color: '#8893A8', border: '1px solid #EADFC7' }}>
            {entry.student_id}
          </span>
          {isMe && <span className="text-[10px] px-1.5 rounded-full font-bold" style={{ background: '#FFC93C', color: '#1B2541' }}>나</span>}
        </div>
      </div>
      <div className="font-display flex items-baseline gap-0.5">
        <span className="text-xl" style={{ color: '#FF7A59' }}>{entry.points}</span>
        <span className="text-xs" style={{ color: '#8893A8' }}>P</span>
      </div>
    </div>
  );
}

// QR 스캐너 모달
function QrScannerModal({ onScan, onClose }) {
  const containerId = 'qr-reader';
  const scannerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let scanner = null;

    (async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!mounted) return;

        scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' }, // 후면 카메라 우선
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (!mounted) return;
            onScan(decodedText);
          },
          () => { /* 스캔 실패 무시 */ }
        );
      } catch (err) {
        console.error('QR 스캐너 시작 실패:', err);
        alert('카메라를 시작할 수 없어요. 권한을 확인하거나 다른 기기에서 시도해주세요.');
        onClose();
      }
    })();

    return () => {
      mounted = false;
      if (scanner) {
        scanner.stop().catch(() => {}).finally(() => {
          try { scanner.clear(); } catch {}
        });
      }
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(27,37,65,0.85)', backdropFilter: 'blur(4px)' }}>
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
        style={{ background: 'white' }}>
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ background: '#FFFBF0', borderBottom: '1.5px solid #F0E6D2' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#FF7A59' }}>
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg leading-tight">부스 QR 스캔</h3>
              <p className="text-xs" style={{ color: '#6B7489' }}>QR 코드를 화면 가운데에 비춰주세요</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
            style={{ color: '#6B7489' }} aria-label="닫기">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div id={containerId} style={{ width: '100%', minHeight: '320px' }} />
        <div className="p-3 text-center text-xs" style={{ background: '#FFFBF0', color: '#6B7489' }}>
          ⓘ 카메라 권한 허용이 필요해요. 학번당 부스당 1회만 적립됩니다.
        </div>
      </div>
    </div>,
    document.body
  );
}

function Community({ posts, loading, user, onSubmit, onToggleLike, onAddComment,
                    onEditPost, onDeletePost, onEditComment, onDeleteComment }) {
  const composerRef = useRef(null);
  const [query, setQuery] = useState('');
  const [showBest, setShowBest] = useState(true);
  const scrollToComposer = () => composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // 베스트 게시글 TOP 10 (좋아요 1개 이상, 삭제되지 않은 글만)
  const bestPosts = useMemo(() => {
    return [...posts]
      .filter(p => !p.deleted_at && (p.likes || []).length > 0)
      .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      .slice(0, 10);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(p => {
      // 삭제된 글은 본문 매칭에서만 제외 (닉네임/학번도 마스킹되어 있으니 어차피 매칭 안 됨)
      const inPost = !p.deleted_at && (
        (p.nickname || '').toLowerCase().includes(q) ||
        (p.student_id || '').toLowerCase().includes(q) ||
        (p.content || '').toLowerCase().includes(q)
      );
      if (inPost) return true;
      // 살아있는 댓글에서만 검색
      const inComments = (p.comments || []).some(c =>
        !c.deleted_at && (
          (c.nickname || '').toLowerCase().includes(q) ||
          (c.student_id || '').toLowerCase().includes(q) ||
          (c.content || '').toLowerCase().includes(q)
        )
      );
      return inComments;
    });
  }, [posts, query]);

  const isSearching = query.trim().length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="font-display text-xl whitespace-nowrap">💬 모두의 이야기</h3>
        <button onClick={scrollToComposer}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition hover:scale-105 flex-shrink-0"
          style={{ background: '#FF7A59', color: 'white' }}>
          <Plus className="w-3.5 h-3.5" /> 글 남기기
        </button>
      </div>

      {/* 베스트 게시글 TOP 10 */}
      {bestPosts.length > 0 && (
        <div className="mb-5 rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FFF8E8, #FFE8E0)', border: '1.5px solid #FFC93C' }}>
          <button onClick={() => setShowBest(s => !s)}
            className="w-full px-4 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5" style={{ color: '#B8852F' }} />
              <span className="font-display text-base">베스트 글 TOP 10</span>
              <span className="text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                style={{ background: '#FFE4E4', color: '#E74C3C' }}>
                <Flame className="w-3 h-3" /> LIVE
              </span>
            </div>
            <ChevronRight className="w-4 h-4 transition-transform"
              style={{ color: '#B8852F', transform: showBest ? 'rotate(90deg)' : 'rotate(0deg)' }} />
          </button>
          {showBest && (
            <div className="px-4 pb-4 space-y-2">
              <p className="text-xs mb-3" style={{ color: '#6B7489' }}>가장 많은 추천을 받은 글이에요. 클릭하면 글로 이동해요.</p>
              {bestPosts.map((p, i) => (
                <BestPostRow key={p.id} rank={i + 1} post={p}
                  onClick={() => {
                    setQuery('');
                    setTimeout(() => {
                      const el = document.getElementById(`post-${p.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 검색바 */}
      <div className="mb-4 relative">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all"
          style={{ background: 'white', border: `1.5px solid ${isSearching ? '#FF7A59' : '#EADFC7'}` }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: isSearching ? '#FF7A59' : '#8893A8' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="닉네임·학번·내용으로 검색"
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: '#1B2541' }}
          />
          {isSearching && (
            <button onClick={() => setQuery('')}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-100 flex-shrink-0"
              style={{ color: '#8893A8' }} aria-label="검색 지우기">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {isSearching && (
          <p className="text-xs mt-2 px-2" style={{ color: '#6B7489' }}>
            "<span className="font-bold" style={{ color: '#FF7A59' }}>{query.trim()}</span>" 검색 결과 {filteredPosts.length}건
          </p>
        )}
      </div>

      <div className="space-y-3 mb-10">
        {loading && <div className="p-8 text-center text-sm" style={{ color: '#8893A8' }}>불러오는 중...</div>}
        {!loading && posts.length === 0 && (
          <div className="p-10 text-center rounded-2xl" style={{ background: '#FFFBF0', border: '1.5px dashed #EADFC7' }}>
            <MessageSquare className="w-8 h-8 mx-auto mb-3" style={{ color: '#EADFC7' }} />
            <p className="text-sm mb-1" style={{ color: '#8893A8' }}>아직 아무도 글을 남기지 않았어요.</p>
            <p className="text-sm font-bold" style={{ color: '#FF7A59' }}>첫 글의 주인공이 되어보세요!</p>
          </div>
        )}
        {!loading && posts.length > 0 && filteredPosts.length === 0 && (
          <div className="p-8 text-center rounded-2xl" style={{ background: '#FFFBF0', border: '1.5px dashed #EADFC7' }}>
            <Search className="w-7 h-7 mx-auto mb-3" style={{ color: '#EADFC7' }} />
            <p className="text-sm" style={{ color: '#8893A8' }}>일치하는 글이나 댓글이 없어요.</p>
          </div>
        )}
        {filteredPosts.map(p => (
          <PostCard key={p.id} post={p} user={user} highlight={query.trim()}
            onToggleLike={onToggleLike} onAddComment={onAddComment}
            onEditPost={onEditPost} onDeletePost={onDeletePost}
            onEditComment={onEditComment} onDeleteComment={onDeleteComment} />
        ))}
      </div>

      <div ref={composerRef}>
        <Composer onSubmit={onSubmit} user={user} />
      </div>
    </div>
  );
}

function avatarColor(name) {
  const palette = ['#FF7A59', '#2B7FFF', '#3BC4A0', '#FFC93C', '#A56BFF', '#FF5B8A', '#E07BC0', '#6BB8FF', '#8FBF3A'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function Avatar({ name, size = 40 }) {
  const color = avatarColor(name || '익명');
  const initial = (name || '?').slice(0, 1).toUpperCase();
  return (
    <div className="flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white font-display"
      style={{ width: size, height: size, background: color, fontSize: size * 0.45 }}>
      {initial}
    </div>
  );
}

function PostCard({ post, user, highlight, onToggleLike, onAddComment,
                   onEditPost, onDeletePost, onEditComment, onDeleteComment }) {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const likes = post.likes || [];
  const comments = post.comments || [];
  const hasLiked = user && likes.includes(user.student_id);
  const time = new Date(post.created_at).getTime();
  const isMine = user && post.student_id === user.student_id;
  const isAdmin = user?.is_admin;
  const canManage = isMine || isAdmin; // 본인이거나 관리자면 수정/삭제 가능
  const isDeleted = Boolean(post.deleted_at);
  const isAdminDeleted = isDeleted && post.deleted_by === 'admin';
  const isEdited = Boolean(post.updated_at) && !isDeleted;

  // 검색 시 댓글에 매칭되는 게 있으면 자동으로 댓글 펼침
  const hasMatchingComment = highlight && comments.some(c =>
    !c.deleted_at && (
      (c.nickname || '').toLowerCase().includes(highlight.toLowerCase()) ||
      (c.student_id || '').toLowerCase().includes(highlight.toLowerCase()) ||
      (c.content || '').toLowerCase().includes(highlight.toLowerCase())
    )
  );
  const showCommentsEffective = showComments || hasMatchingComment;

  const handleEditSave = async () => {
    const trimmed = editContent.trim();
    if (!trimmed || trimmed === post.content || savingEdit) return;
    setSavingEdit(true);
    const ok = await onEditPost(post.id, trimmed.slice(0, 500));
    setSavingEdit(false);
    if (ok) setIsEditing(false);
    else alert('수정에 실패했어요. 다시 시도해주세요.');
  };

  const handleDelete = async () => {
    const isAdminAction = isAdmin && !isMine;
    const message = isAdminAction
      ? `[관리자] 이 글을 삭제할까요?\n작성자: ${post.nickname} (${post.student_id})\n삭제된 글은 "관리자에 의해 삭제됨"으로 표시됩니다.`
      : '이 글을 삭제할까요?\n삭제된 글은 "삭제된 글입니다"로 표시되며, 받은 추천이나 포인트는 유지됩니다.';
    if (!confirm(message)) return;
    const ok = await onDeletePost(post.id, isAdminAction);
    setMenuOpen(false);
    if (!ok) alert('삭제에 실패했어요. 다시 시도해주세요.');
  };

  return (
    <article id={`post-${post.id}`} className="p-4 rounded-2xl transition-colors"
      style={{
        background: isDeleted ? '#FAFAF5' : 'white',
        border: `1.5px solid ${isMine && !isDeleted ? '#FFC93C55' : '#F0E6D2'}`
      }}>
      <div className="flex gap-3">
        <Avatar name={isDeleted ? '?' : post.nickname} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap min-w-0">
              {isDeleted ? (
                <span className="font-bold text-sm" style={{ color: '#8893A8' }}>(삭제됨)</span>
              ) : (
                <>
                  <span className="font-bold text-sm" style={{ color: '#1B2541' }}>
                    <Highlighted text={post.nickname} highlight={highlight} />
                  </span>
                  {post.student_id && (
                    <span className="text-[11px] px-1.5 rounded-full" style={{ background: '#FFFBF0', color: '#8893A8', border: '1px solid #EADFC7' }}>
                      <Highlighted text={post.student_id} highlight={highlight} />
                    </span>
                  )}
                  {isMine && <span className="text-[10px] px-1.5 rounded-full font-bold" style={{ background: '#FFF3E0', color: '#F57C00' }}>나</span>}
                  <span className="text-xs" style={{ color: '#8893A8' }}>· {formatTime(time)}</span>
                  {isEdited && <span className="text-[10px]" style={{ color: '#8893A8' }}>· 수정됨</span>}
                </>
              )}
            </div>

            {/* 본인 글이거나 관리자면 ⋮ 메뉴 표시. 관리자가 남의 글 수정은 불가, 삭제만 가능 */}
            {canManage && !isDeleted && !isEditing && (
              <PostMenu
                onEdit={isMine ? () => { setIsEditing(true); setEditContent(post.content); setMenuOpen(false); } : null}
                onDelete={handleDelete}
                isOpen={menuOpen} onToggle={() => setMenuOpen(o => !o)} />
            )}
          </div>

          {/* 본문 또는 수정 폼 또는 삭제 안내 */}
          {isDeleted ? (
            <p className="text-sm italic mb-3 py-2" style={{ color: '#B0B5C0' }}>
              {isAdminDeleted ? '⚠️ 관리자에 의해 삭제된 글입니다.' : '삭제된 글입니다.'}
            </p>
          ) : isEditing ? (
            <div className="mb-3">
              <textarea value={editContent} onChange={e => setEditContent(e.target.value)} maxLength={500} rows={4}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none focus:ring-2"
                style={{ background: '#FFFBF0', border: '1.5px solid #FF7A59', lineHeight: 1.55 }}
                autoFocus />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs" style={{ color: '#8893A8' }}>{editContent.length} / 500</span>
                <div className="flex gap-2">
                  <button onClick={() => { setIsEditing(false); setEditContent(post.content); }}
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{ background: 'white', border: '1.5px solid #EADFC7', color: '#6B7489' }}>
                    취소
                  </button>
                  <button onClick={handleEditSave}
                    disabled={savingEdit || !editContent.trim() || editContent.trim() === post.content}
                    className="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1 transition"
                    style={{
                      background: '#FF7A59', color: 'white', fontWeight: 700,
                      opacity: (savingEdit || !editContent.trim() || editContent.trim() === post.content) ? 0.5 : 1,
                    }}>
                    <Save className="w-3 h-3" /> {savingEdit ? '저장 중...' : '저장'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[15px] whitespace-pre-wrap break-words mb-3" style={{ color: '#1B2541', lineHeight: 1.55 }}>
              <Highlighted text={post.content} highlight={highlight} />
            </p>
          )}

          {/* 액션 버튼 (삭제/수정 중이 아닐 때만) */}
          {!isDeleted && !isEditing && (
            <div className="flex items-center gap-1 -ml-2">
              <button onClick={() => onToggleLike(post.id)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs transition-all group"
                style={{ color: hasLiked ? '#FF5B8A' : '#8893A8' }}>
                <ThumbsUp className="w-4 h-4 transition-transform group-hover:scale-110"
                  fill={hasLiked ? '#FF5B8A' : 'none'} strokeWidth={hasLiked ? 2.2 : 1.8} />
                <span style={{ fontWeight: hasLiked ? 700 : 400 }}>{likes.length > 0 ? likes.length : ''}</span>
              </button>
              <button onClick={() => setShowComments(s => !s)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs transition-all"
                style={{ color: showCommentsEffective ? '#2B7FFF' : '#8893A8', fontWeight: showCommentsEffective ? 700 : 400 }}>
                <MessageCircle className="w-4 h-4" strokeWidth={showCommentsEffective ? 2.2 : 1.8} />
                <span>{comments.filter(c => !c.deleted_at).length > 0 ? comments.filter(c => !c.deleted_at).length : ''}</span>
              </button>
            </div>
          )}

          {/* 삭제된 글에서도 댓글 토글 가능 (다른 사람의 댓글이 있을 수 있음) */}
          {isDeleted && comments.length > 0 && (
            <button onClick={() => setShowComments(s => !s)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs"
              style={{ color: '#8893A8' }}>
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{comments.filter(c => !c.deleted_at).length}개 댓글</span>
            </button>
          )}

          {showCommentsEffective && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: '#F0E6D2' }}>
              {comments.map(c => (
                <CommentRow key={c.id} comment={c} user={user} highlight={highlight}
                  onEditComment={onEditComment} onDeleteComment={onDeleteComment} />
              ))}
              {!isDeleted && <CommentForm onSubmit={(ct) => onAddComment(post.id, ct)} />}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// 게시글/댓글 ⋮ 메뉴
function PostMenu({ onEdit, onDelete, isOpen, onToggle }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onToggle();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button onClick={onToggle}
        className="w-7 h-7 rounded-full flex items-center justify-center transition hover:bg-gray-100"
        style={{ color: '#8893A8' }} aria-label="메뉴">
        <MoreVertical className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-8 z-20 rounded-xl overflow-hidden min-w-[100px]"
          style={{ background: 'white', border: '1.5px solid #EADFC7', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          {onEdit && (
            <button onClick={onEdit}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50"
              style={{ color: '#1B2541' }}>
              <Edit3 className="w-3.5 h-3.5" /> 수정
            </button>
          )}
          <button onClick={onDelete}
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-red-50"
            style={{ color: '#E74C3C', borderTop: onEdit ? '1px solid #F0E6D2' : 'none' }}>
            <Trash2 className="w-3.5 h-3.5" /> 삭제
          </button>
        </div>
      )}
    </div>
  );
}

// 댓글 1개
function CommentRow({ comment: c, user, highlight, onEditComment, onDeleteComment }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(c.content || '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const ct = new Date(c.created_at).getTime();
  const cIsMine = user && c.student_id === user.student_id;
  const cIsAdmin = user?.is_admin;
  const cCanManage = cIsMine || cIsAdmin;
  const cIsDeleted = Boolean(c.deleted_at);
  const cIsAdminDeleted = cIsDeleted && c.deleted_by === 'admin';
  const cIsEdited = Boolean(c.updated_at) && !cIsDeleted;

  const handleEditSave = async () => {
    const trimmed = editContent.trim();
    if (!trimmed || trimmed === c.content || savingEdit) return;
    setSavingEdit(true);
    const ok = await onEditComment(c.id, trimmed.slice(0, 300));
    setSavingEdit(false);
    if (ok) setIsEditing(false);
    else alert('수정에 실패했어요.');
  };

  const handleDelete = async () => {
    const isAdminAction = cIsAdmin && !cIsMine;
    const message = isAdminAction
      ? `[관리자] 이 댓글을 삭제할까요?\n작성자: ${c.nickname} (${c.student_id})`
      : '이 댓글을 삭제할까요?';
    if (!confirm(message)) return;
    const ok = await onDeleteComment(c.id, isAdminAction);
    setMenuOpen(false);
    if (!ok) alert('삭제에 실패했어요.');
  };

  return (
    <div className="flex gap-2 mb-3 last:mb-2">
      <Avatar name={cIsDeleted ? '?' : c.nickname} size={28} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {cIsDeleted ? (
              <span className="font-bold text-xs" style={{ color: '#8893A8' }}>(삭제됨)</span>
            ) : (
              <>
                <span className="font-bold text-xs" style={{ color: '#1B2541' }}>
                  <Highlighted text={c.nickname} highlight={highlight} />
                </span>
                {c.student_id && (
                  <span className="text-[10px] px-1 rounded" style={{ background: '#FFFBF0', color: '#8893A8' }}>
                    <Highlighted text={c.student_id} highlight={highlight} />
                  </span>
                )}
                {cIsMine && <span className="text-[10px] px-1 rounded font-bold" style={{ background: '#FFF3E0', color: '#F57C00' }}>나</span>}
                <span className="text-[11px]" style={{ color: '#8893A8' }}>· {formatTime(ct)}</span>
                {cIsEdited && <span className="text-[10px]" style={{ color: '#8893A8' }}>· 수정됨</span>}
              </>
            )}
          </div>
          {cCanManage && !cIsDeleted && !isEditing && (
            <PostMenu
              onEdit={cIsMine ? () => { setIsEditing(true); setEditContent(c.content); setMenuOpen(false); } : null}
              onDelete={handleDelete}
              isOpen={menuOpen} onToggle={() => setMenuOpen(o => !o)} />
          )}
        </div>

        {cIsDeleted ? (
          <p className="text-xs italic mt-0.5" style={{ color: '#B0B5C0' }}>
            {cIsAdminDeleted ? '⚠️ 관리자에 의해 삭제된 댓글입니다.' : '삭제된 댓글입니다.'}
          </p>
        ) : isEditing ? (
          <div className="mt-1">
            <textarea value={editContent} onChange={e => setEditContent(e.target.value)} maxLength={300} rows={2}
              className="w-full px-2.5 py-1.5 rounded-lg text-sm outline-none resize-none focus:ring-1"
              style={{ background: '#FFFBF0', border: '1.5px solid #FF7A59' }}
              autoFocus />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px]" style={{ color: '#8893A8' }}>{editContent.length} / 300</span>
              <div className="flex gap-1.5">
                <button onClick={() => { setIsEditing(false); setEditContent(c.content); }}
                  className="text-[11px] px-2 py-1 rounded-full"
                  style={{ background: 'white', border: '1px solid #EADFC7', color: '#6B7489' }}>
                  취소
                </button>
                <button onClick={handleEditSave}
                  disabled={savingEdit || !editContent.trim() || editContent.trim() === c.content}
                  className="text-[11px] px-2 py-1 rounded-full inline-flex items-center gap-1"
                  style={{
                    background: '#FF7A59', color: 'white', fontWeight: 700,
                    opacity: (savingEdit || !editContent.trim() || editContent.trim() === c.content) ? 0.5 : 1,
                  }}>
                  <Save className="w-2.5 h-2.5" /> {savingEdit ? '...' : '저장'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap break-words mt-0.5" style={{ color: '#1B2541', lineHeight: 1.5 }}>
            <Highlighted text={c.content} highlight={highlight} />
          </p>
        )}
      </div>
    </div>
  );
}

// 검색어를 노란색으로 강조 표시하는 헬퍼 컴포넌트
// 베스트 게시글 한 줄
function BestPostRow({ rank, post, onClick }) {
  const medalIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
  const preview = (post.content || '').slice(0, 60).replace(/\n/g, ' ');
  return (
    <button onClick={onClick}
      className="w-full p-3 rounded-xl flex items-center gap-3 transition hover:scale-[1.01] text-left"
      style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,201,60,0.3)' }}>
      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-display text-sm"
        style={{
          background: rank <= 3 ? '#1B2541' : '#FFFBF0',
          color: rank <= 3 ? '#FFC93C' : '#6B7489',
          fontSize: medalIcon ? '16px' : '13px',
        }}>
        {medalIcon || rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <span className="font-bold text-xs">{post.nickname}</span>
          {post.student_id && (
            <span className="text-[10px] px-1 rounded" style={{ background: '#FFFBF0', color: '#8893A8' }}>
              {post.student_id}
            </span>
          )}
        </div>
        <p className="text-xs truncate" style={{ color: '#4A5568' }}>{preview}{post.content?.length > 60 ? '...' : ''}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0" style={{ color: '#FF5B8A' }}>
        <ThumbsUp className="w-3.5 h-3.5" fill="#FF5B8A" />
        <span className="font-bold text-sm">{post.likes?.length || 0}</span>
      </div>
    </button>
  );
}

function Highlighted({ text, highlight }) {
  if (!text) return null;
  if (!highlight || !highlight.trim()) return <>{text}</>;
  const q = highlight.trim();
  // 대소문자 무시 매칭. 정규식 특수문자 이스케이프
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = String(text).split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase()
          ? <mark key={i} style={{ background: '#FFE082', color: '#1B2541', padding: '0 2px', borderRadius: '3px' }}>{part}</mark>
          : <React.Fragment key={i}>{part}</React.Fragment>
      )}
    </>
  );
}

function CommentForm({ onSubmit }) {
  const [content, setContent] = useState('');
  const canSubmit = content.trim();

  const handle = () => {
    if (!canSubmit) return;
    onSubmit(content.trim().slice(0, 300));
    setContent('');
  };

  return (
    <div className="flex gap-2 mt-2">
      <textarea value={content} onChange={e => setContent(e.target.value)} maxLength={300} rows={2}
        placeholder="댓글 남기기..."
        className="flex-1 px-2.5 py-1.5 rounded-lg text-sm outline-none resize-none"
        style={{ background: '#FFFBF0', border: '1px solid #EADFC7' }} />
      <button onClick={handle} disabled={!canSubmit}
        className="self-end flex items-center justify-center w-9 h-9 rounded-full transition flex-shrink-0"
        style={{ background: canSubmit ? '#2B7FFF' : '#EADFC7', opacity: canSubmit ? 1 : 0.6 }}>
        <Send className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

function Composer({ onSubmit, user }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = content.trim() && !submitting;

  const handle = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    await onSubmit(content.trim().slice(0, 500));
    setContent('');
    setSubmitting(false);
  };

  return (
    <div className="relative p-0.5 rounded-3xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FF7A59 0%, #FFC93C 50%, #3BC4A0 100%)' }}>
      <div className="p-6 rounded-[22px] relative" style={{ background: '#FFFBF0' }}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10" style={{ background: '#FF7A59' }} />
        <div className="absolute -bottom-8 -left-4 w-32 h-32 rounded-full opacity-10" style={{ background: '#3BC4A0' }} />

        <div className="relative flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, #FF7A59, #FFC93C)' }}>
            ✨
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-2xl leading-tight">내 생각 남기기</h3>
            <p className="text-xs" style={{ color: '#6B7489' }}>
              <b style={{ color: '#1B2541' }}>{user.nickname}</b> ({user.student_id}) 으로 작성됩니다
            </p>
          </div>
        </div>

        <div className="relative space-y-3">
          {/* 작성 시 경고 문구 */}
          <div className="p-3 rounded-xl text-xs leading-relaxed flex items-start gap-2"
            style={{ background: '#FFE4E4', border: '1.5px solid #E74C3C', color: '#A82F2F' }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              <b>박람회·진로·과목과 무관한 글</b> 또는 <b>학교폭력으로 보일 수 있는 글</b>은 절대 작성하지 마세요.
              관리자가 즉시 삭제하며, 학생부에 통보될 수 있습니다.
            </p>
          </div>
          <textarea value={content} onChange={e => setContent(e.target.value)} maxLength={500} rows={4}
            placeholder="오늘 박람회에서 인상 깊었던 부스, 선택과목 팁, 친구들에게 공유하고 싶은 정보... 무엇이든 자유롭게!"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition focus:ring-2"
            style={{ background: 'white', border: '1.5px solid #EADFC7', lineHeight: 1.5 }} />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: '#8893A8' }}>{content.length} / 500</span>
            <button onClick={handle} disabled={!canSubmit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
              style={{
                background: canSubmit ? 'linear-gradient(135deg, #FF7A59, #FF5B8A)' : '#EADFC7',
                color: 'white', opacity: canSubmit ? 1 : 0.6, boxShadow: canSubmit ? '0 4px 12px rgba(255,122,89,0.3)' : 'none'
              }}>
              <Send className="w-4 h-4" /> 지금 올리기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(t) {
  const diff = (Date.now() - t) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  const d = new Date(t);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}
