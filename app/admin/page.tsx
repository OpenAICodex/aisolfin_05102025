import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import AdminDashboard from '@/components/AdminDashboard';
import { isSupabaseConfigured } from '@/lib/env';
import { getDemoUserFromCookies } from '@/lib/demoSession';
import { getDemoPrompts } from '@/lib/demoData';
import { isAdminRole } from '@/lib/roles';
import { getSupabaseServiceClient } from '@/lib/supabaseServiceClient';

/**
 * Server component for the admin dashboard.  It verifies the user is
 * authenticated and has the 'admin' role before rendering the
 * dashboard.  On success it loads the stored prompts from
 * `admin_settings` and passes them to the client component.  If the
 * user is not authorised the page redirects to either the login
 * screen or the home page.
 */
export default async function AdminPage() {
  if (isSupabaseConfigured()) {
    const supabase = createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      redirect('/login');
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

    const isAdmin = candidateRoles.some((role) => isAdminRole(role));
    if (!isAdmin) {
      redirect('/');
    }

      .single();
    if (!isAdminRole(profile?.role)) {
      redirect('/');
    }
    const { data: settings } = await supabase
      .from('admin_settings')
      .select('prompts')
      .eq('id', 1)
      .single();
    const prompts = settings?.prompts ?? {};
    return <AdminDashboard initialPrompts={prompts} />;
  }
  const demoUser = getDemoUserFromCookies();
  if (!demoUser) {
    redirect('/login');
  }
  if (!isAdminRole(demoUser.role)) {
    redirect('/');
  }
  return <AdminDashboard initialPrompts={getDemoPrompts()} />;
}