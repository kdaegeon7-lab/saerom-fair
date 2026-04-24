import { createClient } from '@supabase/supabase-js'

// 환경변수에서 Supabase 설정 불러오기
// Vercel에 배포할 때 Environment Variables에 설정해주세요
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Supabase 설정이 되어 있는지 확인
export const isSupabaseReady = () => Boolean(supabaseUrl && supabaseAnonKey)
