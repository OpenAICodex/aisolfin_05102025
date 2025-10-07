import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import { createServerSupabaseClient } from '@/server/supabase';
import { isSupabaseConfigured } from '@/lib/env';
import { getDemoUserFromCookies } from '@/lib/demoSession';
import { getDemoPrompts, setDemoPrompts } from '@/lib/demoData';
import type { SupabaseClient } from '@supabase/supabase-js';


import type { Database, PromptSettings } from '@/types/supabase';

// choose one client but keep a single, unified type
let supabase: SupabaseClient<Database>;
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createServerSupabaseClient();
} else {
  supabase = createSupabaseServerClient();
}


type AdminSettingsRow =
  Database['public']['Tables']['admin_settings']['Row'];
type AdminSettingsPick = { prompts: PromptSettings | null };


export async function GET() {
  if (!isSupabaseConfigured()) {
    const user = getDemoUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json(getDemoPrompts());
  }
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle<{ role: string | null }>();
    // .single();
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { data: settings, error } = await supabase
    .from('admin_settings')
    .select('prompts')
    .eq('id', 1)
    // .single();
    .maybeSingle<AdminSettingsPick>(); // 👈 force the shape

  if (error || !settings) {
    return NextResponse.json({ error: 'Failed to load prompts' }, { status: 500 });
  }
  return NextResponse.json(settings.prompts ?? {});
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const {
    compliancePrompt,
    businessPrompt,
    toolsPrompt
  } = body as { compliancePrompt?: string; businessPrompt?: string; toolsPrompt?: string };
  if (
    typeof compliancePrompt !== 'string' ||
    typeof businessPrompt !== 'string' ||
    typeof toolsPrompt !== 'string'
  ) {
    return NextResponse.json({ error: 'Missing or invalid prompt fields' }, { status: 400 });
  }
  if (!isSupabaseConfigured()) {
    const user = getDemoUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    setDemoPrompts({
      compliance: compliancePrompt,
      businessValue: businessPrompt,
      toolsAutomation: toolsPrompt
    });
    return NextResponse.json({ success: true });
  }
  const supabaseUser = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabaseUser.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const { data: profile } = await supabaseUser
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    // .single();
    .maybeSingle<{ role: string | null }>();
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY ? createServerSupabaseClient() : supabaseUser;
  const updates = {
    prompts: {
      compliance: compliancePrompt,
      businessValue: businessPrompt,
      toolsAutomation: toolsPrompt
    }
  } satisfies Database['public']['Tables']['admin_settings']['Update'];

  const adminSettingsTable = supabase.from('admin_settings') as any;
  const { error: updateError } = await adminSettingsTable
    // The Supabase client types bundled with `@supabase/ssr` do not narrow
    // correctly when using our lightweight `Database` definition, causing the
    // update payload to be inferred as `never`. Casting the table reference to
    // `any` avoids the false-positive while the `satisfies` clause above keeps
    // the payload strongly typed.
    .update(updates)
    .eq('id', 1);
  if (updateError) {
    return NextResponse.json({ error: 'Failed to update prompts' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
