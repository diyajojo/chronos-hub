import { motion } from 'framer-motion';

function TimeTraveller() {
  return(
    <div className="absolute inset-0 w-full h-full opacity-80 pointer-events-none flex items-center justify-center">
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="w-64 h-64"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full fill-blue-400">
          <path d="M100,20 C120,20 140,40 140,60 C140,80 130,90 130,110 C130,130 140,150 130,170 C120,190 80,190 70,170 C60,150 70,130 70,110 C70,90 60,80 60,60 C60,40 80,20 100,20 Z" />
          <circle cx="100" cy="50" r="10" className="fill-blue-800" />
          <path d="M80,70 C80,70 90,80 100,80 C110,80 120,70 120,70" 
                className="stroke-blue-800 fill-none" 
                strokeWidth="4" 
                strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}
export default TimeTraveller;