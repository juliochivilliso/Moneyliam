import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uzuqwffuiehiiplxjuuw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dXF3ZmZ1aWVoaWlwbHhqdXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDYzODIsImV4cCI6MjA3MzM4MjM4Mn0.7ZH0FxcfZ4yqJvr8bGiTTM7JdeNyzRjmeu0Y2A7WK-8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)