import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen, Sparkles, Trophy, ArrowLeft, Plus, Check, MessageSquare,
  Users, Compass, Lightbulb, Globe, GraduationCap, Target, Heart,
  Send, Clock, Award, ChevronRight, RefreshCw, AlertCircle, MapPin,
  ThumbsUp, MessageCircle, FileText, X, LogIn, LogOut, User,
  Lock, Hash, Briefcase, ShieldCheck
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

const PROGRAMS = [
  { icon: Compass, color: '#FF7A59', title: '진로 탐색 프로그램', desc: '계열별 맞춤 멘토링, 대학·학과 탐방, 직업인 초청 특강으로 나만의 진로 지도를 그려봅니다.', tags: ['진로', '멘토링'] },
  { icon: Lightbulb, color: '#2B7FFF', title: '수학과학중점 심화', desc: '수학·과학 중점 과정 운영으로 이공계열 진학을 준비하는 학생을 위한 심화 프로그램.', tags: ['중점', '이공계'] },
  { icon: Users, color: '#3BC4A0', title: '자율 동아리 40+', desc: '관심사를 공유하는 친구들과 만드는 우리만의 동아리. 올해 40개 이상 운영 중.', tags: ['동아리', '자율'] },
  { icon: Globe, color: '#FFC93C', title: '독서·논술 인문 소양', desc: '독서·논술 교육 중심의 인문학 소양 함양 프로그램으로 사고력과 표현력을 키워요.', tags: ['인문', '독서'] },
  { icon: GraduationCap, color: '#A56BFF', title: '디지털 기반 혁신 수업', desc: '디지털 기반 교육혁신 선도학교로서 AI·데이터 도구를 활용한 수업 운영.', tags: ['디지털', '혁신'] },
  { icon: Heart, color: '#FF5B8A', title: '학생 맞춤형 프로젝트', desc: '관심사와 진로에 맞춘 자율적 교육과정 + 창의적 역량을 함양하는 프로젝트 수업.', tags: ['맞춤형', '프로젝트'] },
];

const MISSIONS = [
  { id: 'm1', title: '관심 부스 3곳 방문', desc: '궁금했던 교과 부스 3곳을 돌며 체크인하기', points: 30 },
  { id: 'm2', title: '선배 인터뷰', desc: '해당 과목을 수강한 선배와 5분 이상 대화', points: 20 },
  { id: 'm3', title: '시뮬레이션 완주', desc: '과목 선택 시뮬레이션 한 번 끝까지 체험', points: 20 },
  { id: 'm4', title: '박람회 커뮤니티', desc: '커뮤니티에 후기나 의견, 유용한 정보 자유롭게 남기기', points: 15 },
  { id: 'm5', title: '진로상담 부스 방문', desc: '진로상담 부스에서 1회 이상 상담받기', points: 15 },
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

  const handleLogin = (userData) => {
    setUser(userData);
    ls.set('current_user', userData);
  };

  const handleLogout = () => {
    if (!confirm('로그아웃 하시겠어요? 미션 진행 상황은 그대로 유지됩니다.')) return;
    setUser(null);
    ls.remove('current_user');
    setPage('home');
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

      <Header onHome={() => setPage('home')} page={page} user={user} onLogout={handleLogout} />
      <div className="fade-in flex-1">
        {page === 'home' && <Home onNavigate={setPage} user={user} />}
        {page === 'simulation' && <Simulation onBack={() => setPage('home')} />}
        {page === 'programs' && <Programs onBack={() => setPage('home')} />}
        {page === 'fair' && <Fair onBack={() => setPage('home')} user={user} />}
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

function Header({ onHome, page, user, onLogout }) {
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
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#FFF3E0', border: '1.5px solid #FFC93C' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: avatarColor(user.nickname) }}>
              {user.nickname.slice(0, 1).toUpperCase()}
            </div>
            <div className="text-xs leading-tight">
              <div className="font-bold" style={{ color: '#1B2541' }}>{user.nickname}</div>
              <div style={{ color: '#8893A8' }}>{user.student_id}</div>
            </div>
          </div>
          <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: '#FFF3E0', border: '1.5px solid #FFC93C' }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: avatarColor(user.nickname) }}>
              {user.nickname.slice(0, 1).toUpperCase()}
            </div>
            <span className="text-[11px] font-bold" style={{ color: '#1B2541' }}>{user.nickname}</span>
          </div>
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

      onLogin({ student_id: sid, nickname: nick, career_paths: careers });
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
                <p className="text-xs text-center pt-1" style={{ color: '#8893A8' }}>
                  비밀번호는 잊어버리지 않게 꼭 기억해주세요!
                </p>
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
            오늘의 진로 여정을 시작해볼까요?
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

function Simulation({ onBack }) {
  const [cohort, setCohort] = useState(null);
  const [selected, setSelected] = useState({});

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

      <ProgressSummary groups={visibleGroups} selected={selected} />

      <div className="mt-8 space-y-10">
        {[2, 3].filter(g => cohort === 'g1' || g === 3).map(grade => (
          <GradeSection key={grade} grade={grade}
            groups={visibleGroups.filter(g => g.grade === grade)}
            selected={selected} onToggle={toggle} />
        ))}
      </div>
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

function Programs({ onBack }) {
  return (
    <main className="max-w-6xl mx-auto px-6 pt-8 pb-8">
      <BackButton onBack={onBack} />
      <div className="mb-10">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#E0EDFF', color: '#2B7FFF' }}>STEP 2</span>
        <h2 className="font-display text-4xl mb-3">학교 특색 프로그램</h2>
        <p style={{ color: '#4A5568' }}>새롬고가 특별히 공들여 운영하는 프로그램들이에요.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {PROGRAMS.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="p-6 rounded-2xl bg-white flex gap-5 hover:-translate-y-0.5 transition-transform"
              style={{ border: '1.5px solid #F0E6D2', animation: `fadeIn 0.4s ease-out ${i * 0.07}s both` }}>
              <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: `${p.color}22` }}>
                <Icon className="w-7 h-7" style={{ color: p.color }} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl mb-1.5">{p.title}</h3>
                <p className="text-sm mb-3" style={{ color: '#4A5568' }}>{p.desc}</p>
                <div className="flex gap-1.5">
                  {p.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#FFFBF0', color: '#6B7489', border: '1px solid #EADFC7' }}>#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function Fair({ onBack, user }) {
  const [tab, setTab] = useState('mission');
  const [done, setDone] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDone(ls.get(`missions_${user.student_id}`) || []);

    if (!isSupabaseConfigured) { setLoading(false); return; }

    const load = async () => {
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
      setLoading(false);
    };
    load();

    const channel = supabase.channel('posts-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments' }, load)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user.student_id]);

  const toggleMission = (id) => {
    const next = done.includes(id) ? done.filter(x => x !== id) : [...done, id];
    setDone(next);
    ls.set(`missions_${user.student_id}`, next);
  };

  const submitPost = async (content) => {
    if (!isSupabaseConfigured) return;
    await supabase.from('posts').insert({
      nickname: user.nickname,
      student_id: user.student_id,
      content,
    });
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

  const points = done.reduce((sum, id) => sum + (MISSIONS.find(m => m.id === id)?.points || 0), 0);
  const totalPoints = MISSIONS.reduce((s, m) => s + m.points, 0);

  return (
    <main className="max-w-6xl mx-auto px-6 pt-8 pb-8">
      <BackButton onBack={onBack} />
      <div className="mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#DDF5EA', color: '#3BC4A0' }}>STEP 3</span>
        <h2 className="font-display text-4xl mb-3">박람회 미션 & 커뮤니티</h2>
        <p style={{ color: '#4A5568' }}>미션을 달성하고, 체험 후기와 질문을 친구들과 나눠보세요.</p>
      </div>

      <div className="p-5 rounded-2xl mb-6 flex items-center gap-4" style={{ background: '#1B2541', color: '#FFFBF0' }}>
        <Award className="w-8 h-8" style={{ color: '#FFC93C' }} />
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="font-display text-2xl" style={{ color: '#FFC93C' }}>{points}</span>
            <span className="text-sm opacity-70">/ {totalPoints} 포인트</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div className="h-full transition-all duration-500" style={{ width: `${(points / totalPoints) * 100}%`, background: '#FFC93C' }} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[{ k: 'mission', label: '미션', icon: Trophy }, { k: 'community', label: '커뮤니티', icon: MessageSquare }].map(t => {
          const Icon = t.icon;
          const on = tab === t.k;
          return (
            <button key={t.k} onClick={() => setTab(t.k)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition"
              style={{ background: on ? '#1B2541' : '#FFFBF0', color: on ? '#FFFBF0' : '#6B7489', border: '1.5px solid #EADFC7' }}>
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'mission' && <MissionList done={done} onToggle={toggleMission} />}
      {tab === 'community' && <Community posts={posts} loading={loading} user={user}
        onSubmit={submitPost} onToggleLike={toggleLike} onAddComment={addComment} />}
    </main>
  );
}

function MissionList({ done, onToggle }) {
  return (
    <div className="space-y-3">
      {MISSIONS.map(m => {
        const on = done.includes(m.id);
        return (
          <button key={m.id} onClick={() => onToggle(m.id)}
            className="w-full p-5 rounded-2xl flex items-center gap-4 text-left transition-all"
            style={{ background: on ? '#DDF5EA' : 'white', border: `1.5px solid ${on ? '#3BC4A0' : '#F0E6D2'}` }}>
            <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: on ? '#3BC4A0' : '#FFFBF0', border: on ? 'none' : '2px solid #EADFC7' }}>
              {on && <Check className="w-5 h-5 text-white" />}
            </div>
            <div className="flex-1">
              <h4 className="font-display text-lg mb-0.5" style={{ textDecoration: on ? 'line-through' : 'none', opacity: on ? 0.7 : 1 }}>{m.title}</h4>
              <p className="text-sm" style={{ color: '#6B7489' }}>{m.desc}</p>
            </div>
            <span className="text-sm font-bold px-2.5 py-1 rounded-full" style={{ background: on ? '#3BC4A0' : '#FFF0D6', color: on ? 'white' : '#B8852F' }}>+{m.points}P</span>
          </button>
        );
      })}
    </div>
  );
}

function Community({ posts, loading, user, onSubmit, onToggleLike, onAddComment }) {
  const composerRef = useRef(null);
  const scrollToComposer = () => composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl">💬 모두의 이야기</h3>
        <button onClick={scrollToComposer}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition hover:scale-105"
          style={{ background: '#FF7A59', color: 'white' }}>
          <Plus className="w-3.5 h-3.5" /> 글 남기기
        </button>
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
        {posts.map(p => (
          <PostCard key={p.id} post={p} user={user}
            onToggleLike={onToggleLike} onAddComment={onAddComment} />
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

function PostCard({ post, user, onToggleLike, onAddComment }) {
  const [showComments, setShowComments] = useState(false);
  const likes = post.likes || [];
  const comments = post.comments || [];
  const hasLiked = user && likes.includes(user.student_id);
  const time = new Date(post.created_at).getTime();
  const isMine = user && post.student_id === user.student_id;

  return (
    <article className="p-4 rounded-2xl transition-colors"
      style={{ background: 'white', border: `1.5px solid ${isMine ? '#FFC93C55' : '#F0E6D2'}` }}>
      <div className="flex gap-3">
        <Avatar name={post.nickname} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="font-bold text-sm" style={{ color: '#1B2541' }}>{post.nickname}</span>
            {post.student_id && <span className="text-[11px] px-1.5 rounded-full" style={{ background: '#FFFBF0', color: '#8893A8', border: '1px solid #EADFC7' }}>{post.student_id}</span>}
            {isMine && <span className="text-[10px] px-1.5 rounded-full font-bold" style={{ background: '#FFF3E0', color: '#F57C00' }}>나</span>}
            <span className="text-xs" style={{ color: '#8893A8' }}>· {formatTime(time)}</span>
          </div>
          <p className="text-[15px] whitespace-pre-wrap break-words mb-3" style={{ color: '#1B2541', lineHeight: 1.55 }}>
            {post.content}
          </p>
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
              style={{ color: showComments ? '#2B7FFF' : '#8893A8', fontWeight: showComments ? 700 : 400 }}>
              <MessageCircle className="w-4 h-4" strokeWidth={showComments ? 2.2 : 1.8} />
              <span>{comments.length > 0 ? comments.length : ''}</span>
            </button>
          </div>

          {showComments && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: '#F0E6D2' }}>
              {comments.map(c => {
                const ct = new Date(c.created_at).getTime();
                const cIsMine = user && c.student_id === user.student_id;
                return (
                  <div key={c.id} className="flex gap-2 mb-3 last:mb-2">
                    <Avatar name={c.nickname} size={28} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs" style={{ color: '#1B2541' }}>{c.nickname}</span>
                        {c.student_id && <span className="text-[10px] px-1 rounded" style={{ background: '#FFFBF0', color: '#8893A8' }}>{c.student_id}</span>}
                        {cIsMine && <span className="text-[10px] px-1 rounded font-bold" style={{ background: '#FFF3E0', color: '#F57C00' }}>나</span>}
                        <span className="text-[11px]" style={{ color: '#8893A8' }}>· {formatTime(ct)}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap break-words mt-0.5" style={{ color: '#1B2541', lineHeight: 1.5 }}>
                        {c.content}
                      </p>
                    </div>
                  </div>
                );
              })}
              <CommentForm onSubmit={(ct) => onAddComment(post.id, ct)} />
            </div>
          )}
        </div>
      </div>
    </article>
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
