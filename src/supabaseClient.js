import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://azyxmqbsagykdebddavg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6eXhtcWJzYWd5a2RlYmRkYXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODM2ODIsImV4cCI6MjA4MDg1OTY4Mn0.jULlWs6giJKV4aNtugQGWAzxqaBkQc_rwDXPLWXtetc";

export const supabase = createClient(supabaseUrl, supabaseKey);
