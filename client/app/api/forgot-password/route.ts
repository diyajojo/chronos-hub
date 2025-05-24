import { NextResponse } from 'next/server';
import {API_BASE_URL} from '@/lib/config';

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
