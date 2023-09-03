import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://kzthdyjkhdwyqztvlvmp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6dGhkeWpraGR3eXF6dHZsdm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM3MjgzNjUsImV4cCI6MjAwOTMwNDM2NX0.CNekAEBT8XSrtY74CVAWyo3i3xh3T3gAH8TT6zEXTLM';

console.log(supabaseUrl);
console.log(supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey)