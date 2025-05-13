// we store jwt token in cookie because it is present in server side and so is safer
// cookie can be stored in local storage also , but it is not safe (xss attacks)

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if(!response.ok)
    {
    return NextResponse.json({error: data.error}, {status: response.status});
    }
    
    const cookieStore=await cookies();

    cookieStore.set({
      name: 'token',
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        createdAt: data.user.createdAt
      },
      newBadge: data.newBadge,
      earnedBadges: data.earnedBadges || []
    }, { status: 200 });

  }
   catch (error) 
   {
    return NextResponse.json( { "error": "Internal server error" }, { status: 500 });
  }
}