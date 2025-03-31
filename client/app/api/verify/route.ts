import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';

async function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || '');
    return payload;
  } catch (error) {
    return null;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token?.value) 
      {
      console.log('No token found in cookies');
      return NextResponse.json({ authenticated: false, error: 'No token found' }, { status: 401 });
    }

    const user = await verifyToken(token.value);
    
    if (!user) {
      console.log('Invalid or expired token');
      return NextResponse.json({ authenticated: false, error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: (user as JwtPayload).id,
        name: (user as JwtPayload).name,
        email: (user as JwtPayload).email
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ authenticated: false, error: 'Server error' }, { status: 401 });
  }
}
