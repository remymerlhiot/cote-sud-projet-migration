// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oopbrlptvjkldvzdgxkm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vcGJybHB0dmprbGR2emRneGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMzM5OTEsImV4cCI6MjA1ODkwOTk5MX0.3GpYH1AeuicIwALqrYGUnKonBsdKU3ZpxHOLe0svvm8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);