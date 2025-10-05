import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import { createServerSupabaseClient } from '@/server/supabase';
import { isSupabaseConfigured } from '@/lib/env';
import { getDemoUserFromCookies } from '@/lib/demoSession';
import { getDemoPrompts, setDemoPrompts } from '@/lib/demoData';
import { isAdminRole } from '@/lib/roles';
import { getSupabaseServiceClient } from '@/lib/supabaseServiceClient';

export async function GET() {
  if (!isSupabaseConfigured()) {
    const user = getDemoUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (!isAdminRole(user.role)) {
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
  const candidateRoles: Array<string | null | undefined> = [
    (user.app_metadata?.role as string | undefined) ?? undefined,
    (user.user_metadata?.role as string | undefined) ?? undefined
  ];

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role) {
    candidateRoles.unshift(profile.role);
  }

  if (!profile?.role) {
    const serviceClient = await getSupabaseServiceClient();
    if (serviceClient) {
      const { data: serviceProfile } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      if (serviceProfile?.role) {
        candidateRoles.unshift(serviceProfile.role);
      }
    }
  }

  if (!candidateRoles.some((role) => isAdminRole(role))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

    .single();
  if (!isAdminRole(profile?.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { data: settings, error } = await supabase
    .from('admin_settings')
    .select('prompts')
    .eq('id', 1)
    .single();
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
    if (!isAdminRole(user.role)) {
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
  const candidateRoles: Array<string | null | undefined> = [
    (user.app_metadata?.role as string | undefined) ?? undefined,
    (user.user_metadata?.role as string | undefined) ?? undefined
  ];

  const { data: profile } = await supabaseUser
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role) {
    candidateRoles.unshift(profile.role);
  }

  const serviceClient = (await getSupabaseServiceClient()) ?? undefined;

  let supabase = supabaseUser;
  if (!profile?.role && serviceClient) {
    const { data: serviceProfile } = await serviceClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (serviceProfile?.role) {
      candidateRoles.unshift(serviceProfile.role);
    }
  }
  if (serviceClient) {
    supabase = serviceClient;
  }

  if (!candidateRoles.some((role) => isAdminRole(role))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

    .single();
  if (!isAdminRole(profile?.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY ? createServerSupabaseClient() : supabaseUser;
  const { error: updateError } = await supabase
    .from('admin_settings')
    .update({
      prompts: {
        compliance: compliancePrompt,
        businessValue: businessPrompt,
        toolsAutomation: toolsPrompt
      }
    })
    .eq('id', 1);
  if (updateError) {
    return NextResponse.json({ error: 'Failed to update prompts' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
