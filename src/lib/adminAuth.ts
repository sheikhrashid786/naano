import { getCurrentUser, SessionPayload } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAdminSession(): Promise<{ user: SessionPayload } | { errorResponse: NextResponse }> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      ),
    };
  }

  if (user.role !== 'ADMIN') {
    return {
      errorResponse: NextResponse.json(
        { error: 'Forbidden: Super Admin privileges required' },
        { status: 403 }
      ),
    };
  }

  return { user };
}
