import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { API_BASE_URL } from '@/lib/config';

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

    // Check if user still exists in the database
    const userId = (user as JwtPayload).id;
    try {
      const userResponse = await fetch(`${API_BASE_URL}/user/${userId}`);
      const userData = await userResponse.json();
      
      if (!userResponse.ok || userData.error === 'User not found') {
        console.log('User no longer exists in database');
        // Clear the token cookie
        cookieStore.delete('token');
        return NextResponse.json({ authenticated: false, error: 'User not found' }, { status: 401 });
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      // Continue with authentication on server error to prevent accidental lockouts
    }

    console.log('JWT payload:', JSON.stringify(user));

    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: (user as JwtPayload).id,
        name: (user as JwtPayload).name,
        email: (user as JwtPayload).email,
        createdAt: (user as JwtPayload).createdAt
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ authenticated: false, error: 'Server error' }, { status: 401 });
  }
}
