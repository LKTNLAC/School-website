import { NextResponse } from 'next/server';

import { submitContactAction } from '@/features/contact/actions';

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await submitContactAction(formData);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result, { status: 201 });
}