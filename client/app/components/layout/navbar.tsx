
import Link from 'next/link';

const Navbar=()=> {
  return (
    <nav className="px-6 py-4 bg-blue-950 bg-opacity-50 backdrop-blur border-b border-blue-500 border-opacity-20 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl mr-2">⏳</span>
          <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">
            ChronoChronicles
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <Link 
            href="/login" 
            className="px-4 py-2 rounded-lg text-blue-200 hover:text-white transition-colors duration-200"
          >
            Login
          </Link>
          <Link 
            href="/signup" 
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;