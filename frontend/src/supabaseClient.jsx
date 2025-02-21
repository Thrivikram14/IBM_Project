import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kgcrqevykbsygnmuozth.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnY3JxZXZ5a2JzeWdubXVvenRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNDY2MjcsImV4cCI6MjA1MDYyMjYyN30.Oei1ePUwjk2AMWzyrNS-_D0cesCyouc90vrzfTqktjk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);