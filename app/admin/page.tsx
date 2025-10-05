import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import AdminDashboard from '@/components/AdminDashboard';
import { isSupabaseConfigured } from '@/lib/env';
import { getDemoUserFromCookies } from '@/lib/demoSession';
import { getDemoPrompts } from '@/lib/demoData';
import { isAdminRole } from '@/lib/roles';

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
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
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