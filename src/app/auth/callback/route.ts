import type { EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { getSafeRedirectPath } from '@/lib/auth-redirect';
import { createClient } from '@/lib/supabase/server';

const recoveryType: EmailOtpType = 'recovery';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const next = getSafeRedirectPath(requestUrl.searchParams.get('next'), '/reset-password');
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const supabase = await createClient();

  let error: Error | null = null;

  if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    error = result.error;
  } else if (tokenHash && type === recoveryType) {
    const result = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: recoveryType,
    });
    error = result.error;
  } else {
    error = new Error('Missing password recovery credentials');
  }

  if (!error) {
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  return NextResponse.redirect(new URL('/forgot-password?error=invalid_link', requestUrl.origin));
}
