// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://huthomycwizfznkaxyty.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1dGhvbXljd2l6Znpua2F4eXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2OTEwODMsImV4cCI6MjA2NDI2NzA4M30.5SQ45gtfXh8Jbrd__zuGpWoGt6vfQmOqvN0R_T3qXSs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);