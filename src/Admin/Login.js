// React Admin/Login.js
import { createClient } from '@supabase/supabase-js';

// **Note:** Use your project's ANON public key and URL here.
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function handleLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    // Redirect to the dashboard on successful login
    window.location.href = '/dashboard'; 
  }
}