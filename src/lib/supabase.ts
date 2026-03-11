import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://puotoeaxtkymqpzkvjbk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1b3RvZWF4dGt5bXFwemt2amJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjc3ODAsImV4cCI6MjA4ODgwMzc4MH0.ym1-hwjKwr_sTyqCmSKpeTO9Zc-1Gx02b4BK27yqqyM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)