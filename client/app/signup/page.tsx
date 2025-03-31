'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StarBackground from '../components/design/starbackground';
import TimeParticles from '../components/design/timeparticles';

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Signup failed');
      }

      // Redirect to login page on success
      window.location.href = '/login';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } 
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-950 overflow-hidden relative">
      <StarBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-500 mb-2">
              Chrono Chronicles
            </h1>
            <p className="text-gray-300">Create your account</p>
          </div>

          {error && (
            <div className="bg-red-500/80 backdrop-blur-sm text-white p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-200 mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800/80 text-white border border-gray-700 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-200 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800/80 text-white border border-gray-700 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-200 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800/80 text-white border border-gray-700 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-3 rounded hover:bg-amber-600 transition duration-300"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center mt-6 text-gray-300">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-amber-500 hover:text-amber-400"
            >
              Login
            </button>
          </p>
        </div>
      </div>


      <TimeParticles />
    </div>
  );
}

export default SignUp;