import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Get the origin from the request headers
  const origin = request.headers.get('origin') || request.nextUrl.origin;

  return NextResponse.redirect(new URL('/login', origin));
}
