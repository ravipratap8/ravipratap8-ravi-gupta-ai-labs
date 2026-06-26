
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function getSafeRedirectPath(requestUrl) {
  const next = requestUrl.searchParams.get('next');

  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/dashboard';
  }

  return next;
}

function createWorkspaceSlug(user) {
  const emailPrefix = user.email?.split('@')[0] || 'workspace';
  const safePrefix = emailPrefix
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return `${safePrefix || 'workspace'}-${user.id.slice(0, 8)}`;
}

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectPath = getSafeRedirectPath(requestUrl);

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=missing_auth_code', requestUrl.origin)
    );
  }

  const supabase = await createClient();

  const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

  if (sessionError) {
    console.error('Supabase auth callback error:', sessionError.message);

    return NextResponse.redirect(
      new URL('/login?error=auth_callback_failed', requestUrl.origin)
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Supabase user lookup failed:', userError?.message);

    return NextResponse.redirect(
      new URL('/login?error=user_lookup_failed', requestUrl.origin)
    );
  }

  const { data: existingProfile, error: profileLookupError } = await supabase
    .from('profiles')
    .select('id, workspace_id')
    .eq('id', user.id)
    .maybeSingle();

  if (profileLookupError) {
    console.error('Profile lookup failed:', profileLookupError.message);

    return NextResponse.redirect(
      new URL('/login?error=profile_lookup_failed', requestUrl.origin)
    );
  }

  if (!existingProfile?.workspace_id) {
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'User';

    const workspaceName = `${fullName}'s Workspace`;
    const workspaceSlug = createWorkspaceSlug(user);

    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        owner_id: user.id,
        name: workspaceName,
        slug: workspaceSlug,
      })
      .select('id')
      .single();

    if (workspaceError) {
      console.error('Workspace creation failed:', workspaceError.message);

      return NextResponse.redirect(
        new URL('/login?error=workspace_creation_failed', requestUrl.origin)
      );
    }

    const profilePayload = {
      id: user.id,
      workspace_id: workspace.id,
      full_name: fullName,
      email: user.email,
      role: 'owner',
    };

    const { error: profileUpsertError } = await supabase
      .from('profiles')
      .upsert(profilePayload, {
        onConflict: 'id',
      });

    if (profileUpsertError) {
      console.error('Profile upsert failed:', profileUpsertError.message);

      return NextResponse.redirect(
        new URL('/login?error=profile_creation_failed', requestUrl.origin)
      );
    }

    await supabase.from('audit_logs').insert({
      workspace_id: workspace.id,
      actor_id: user.id,
      action: 'workspace.created',
      entity_type: 'workspace',
      entity_id: workspace.id,
      metadata: {
        source: 'auth_callback',
      },
    });
  }

  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
}
