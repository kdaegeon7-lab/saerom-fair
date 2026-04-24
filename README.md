# 🎓 새롬고 교육과정 박람회 - 배포 가이드

학생들이 도메인으로 접속할 수 있도록 배포하는 전체 가이드입니다.
**총 소요 시간: 약 20분**

---

## 📋 전체 순서 (이 순서대로 진행하세요)

1. **Supabase 프로젝트 만들기** (5분)
2. **GitHub에 코드 올리기** (5분)
3. **Vercel 배포** (5분)
4. **환경변수 연결** (3분)
5. **학생들에게 주소 공유**

---

## 1️⃣ Supabase 프로젝트 만들기

Supabase는 무료 데이터베이스 서비스입니다. 커뮤니티 글과 좋아요·댓글이 여기에 저장됩니다.

### 1-1. 회원가입 및 프로젝트 생성

1. https://supabase.com 접속
2. 우측 상단 **"Start your project"** 클릭
3. GitHub 계정으로 로그인 (또는 이메일 가입)
4. **"New project"** 클릭
5. 항목 입력:
   - **Name**: `saerom-fair` (원하는 이름)
   - **Database Password**: 아무 비밀번호 (어디 적어두기)
   - **Region**: `Northeast Asia (Seoul)` 선택
   - **Pricing Plan**: Free
6. **"Create new project"** 클릭 → 약 2분 대기

### 1-2. 테이블 만들기

1. 프로젝트가 준비되면 좌측 메뉴에서 **"SQL Editor"** 클릭
2. **"New query"** 클릭
3. `supabase-schema.sql` 파일의 **전체 내용을 복사**해서 붙여넣기
4. 우측 하단 **"Run"** 클릭 (또는 Ctrl+Enter)
5. 하단에 "Success. No rows returned" 나오면 성공 ✅

### 1-3. API 키 복사해두기

1. 좌측 메뉴 최하단 ⚙️ **"Project Settings"** 클릭
2. 좌측에서 **"API"** 클릭
3. 다음 두 값을 메모장에 복사해두세요:
   - **Project URL** (`https://xxxx.supabase.co` 형태)
   - **Project API keys** 중 **`anon` `public`** 키 (긴 문자열)

⚠️ `service_role` 키는 절대 복사하지 마세요. 공개되면 DB가 위험합니다.

---

## 2️⃣ GitHub에 코드 올리기

### 2-1. GitHub 계정 준비

계정이 없다면 https://github.com 에서 가입 (1분)

### 2-2. 새 저장소(Repository) 만들기

1. GitHub 로그인 → 우측 상단 **+** → **"New repository"**
2. **Repository name**: `saerom-fair`
3. **Public** 선택 (무료 배포용)
4. 나머지 기본값 → **"Create repository"** 클릭

### 2-3. 코드 업로드

**가장 쉬운 방법: GitHub 웹에서 직접 업로드**

1. 새로 만든 저장소 페이지에서 **"uploading an existing file"** 링크 클릭
2. `saerom-fair` 폴더 안의 **모든 파일을 선택해서 드래그** (node_modules 폴더 제외!)
3. 하단 **"Commit changes"** 클릭

💡 폴더 구조를 유지하려면 파일을 한 번에 드래그하세요. (index.html, package.json, src/ 폴더 등)

---

## 3️⃣ Vercel에 배포하기

### 3-1. Vercel 가입

1. https://vercel.com 접속
2. **"Sign Up"** → **"Continue with GitHub"** (방금 만든 GitHub 계정으로)
3. 권한 허용

### 3-2. 프로젝트 임포트

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. 방금 올린 `saerom-fair` 저장소 옆 **"Import"** 클릭
3. **Configure Project** 화면에서:
   - **Project Name**: `saerom-fair` (원하는 이름 — 이게 주소가 됩니다)
   - **Framework Preset**: Vite (자동 감지됨)
   - 나머지는 그대로

### 3-3. 환경변수 설정 (매우 중요!)

같은 화면에서 **"Environment Variables"** 섹션 펼치기:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | (1-3에서 복사한 Project URL) |
| `VITE_SUPABASE_ANON_KEY` | (1-3에서 복사한 anon public 키) |

각각 입력 후 **"Add"** 클릭.

### 3-4. 배포!

**"Deploy"** 버튼 클릭 → 약 1~2분 대기 → 🎉 완료!

축하 화면에서 보이는 주소(`saerom-fair.vercel.app` 같은 형태)가 **학생들에게 공유할 도메인**입니다.

---

## 4️⃣ 배포 확인

1. 받은 주소로 접속
2. 메인 화면 확인
3. 박람회 미션 & 커뮤니티 → 커뮤니티 탭 → 테스트 글 작성
4. **다른 브라우저(예: 핸드폰)로 같은 주소 접속** → 방금 쓴 글이 보이면 성공! ✨

상단에 "⚠️ Supabase 환경변수..." 경고가 나오면 3-3 환경변수 설정이 누락된 것이니 Vercel 프로젝트 → Settings → Environment Variables에서 다시 확인하세요.

---

## 5️⃣ 학생들에게 공유

- 주소 예시: `https://saerom-fair.vercel.app`
- QR 코드로 만들어서 교실·복도에 부착하면 편합니다 (QR코드 생성기: https://qr-code-generator.com)
- 가정통신문이나 학급 단톡방에 주소 공유

---

## 🔧 나중에 내용 수정하는 방법

### 방법 A: GitHub 웹에서 직접 수정
1. GitHub 저장소에서 수정할 파일 클릭 → 연필 아이콘
2. 수정 후 **"Commit changes"**
3. Vercel이 **자동으로 재배포** (1~2분)

### 방법 B: 내 컴퓨터에서 수정 (개발자용)
```bash
# 1. 저장소 복제
git clone https://github.com/내아이디/saerom-fair.git
cd saerom-fair

# 2. 의존성 설치
npm install

# 3. .env 파일 만들기 (.env.example 참고)
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...

# 4. 개발 서버 실행
npm run dev
# → http://localhost:5173 에서 확인

# 5. 수정 후 GitHub에 푸시
git add .
git commit -m "수정 내용"
git push
# → Vercel 자동 재배포
```

---

## 💡 자주 하는 실수

### ❌ "환경변수 경고가 계속 떠요"
Vercel 환경변수 설정 후에는 **Deployments 탭 → ... 메뉴 → Redeploy** 로 재배포해야 적용됩니다.

### ❌ "글이 저장이 안 돼요"
- Supabase SQL Editor에서 `supabase-schema.sql` 실행했는지 확인
- Supabase **Settings → API** 의 Realtime이 켜져있는지 확인

### ❌ "실시간으로 다른 사람 글이 안 보여요"
SQL 마지막의 `ALTER PUBLICATION supabase_realtime ADD TABLE ...` 3줄이 정상 실행됐는지 확인.
Supabase 좌측 **Database → Replication** 에서 세 테이블이 활성화되어 있어야 합니다.

### ❌ "커뮤니티에 부적절한 글이 올라왔어요"
Supabase **Table Editor → posts** 테이블에서 해당 행을 직접 삭제할 수 있습니다.

---

## 📊 사용량 한도 (무료 티어)

| 항목 | 한도 | 박람회 예상 사용 |
|------|------|------|
| Supabase DB | 500MB | 수천 개 글 OK |
| Supabase 동시 접속 | 200 | 충분 |
| Vercel 트래픽 | 100GB/월 | 충분 |

무료로 수천 명 학생이 써도 문제없습니다.

---

## 🆘 막히면

각 단계에서 오류가 나면 다음 스크린샷을 찍어두고 도움을 요청하세요:
- 어느 단계인지
- 화면에 뜨는 오류 메시지
- 브라우저 개발자도구(F12) → Console 탭 내용

---

**축하합니다! 이제 `https://여러분의프로젝트.vercel.app` 주소로 전교생이 접속할 수 있습니다.** 🎉
