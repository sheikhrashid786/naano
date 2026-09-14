import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'COMPANY' || !user.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const company = await prisma.company.findUnique({
      where: { id: user.companyId },
      select: {
        id: true,
        name: true,
        industry: true,
        country: true,
        targetIndustries: true,
        targetCountries: true,
        targetRoles: true,
      },
    });

    return NextResponse.json({ company });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'COMPANY' || !user.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetIndustries, targetCountries, targetRoles, industry, country } = await req.json();

    const updated = await prisma.company.update({
      where: { id: user.companyId },
      data: {
        targetIndustries,
        targetCountries,
        targetRoles,
        industry,
        country,
      },
    });

    return NextResponse.json({ success: true, company: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
