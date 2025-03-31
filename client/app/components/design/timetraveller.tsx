import { motion } from 'framer-motion';

const TimeTraveller= () => {
  return(
    <div className="absolute -bottom-10 -right-10 md:-bottom-16 md:-right-16 w-32 h-32 opacity-70 pointer-events-none">
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="w-full h-full"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full fill-blue-400">
          <path d="M50,10 C60,10 70,20 70,30 C70,40 65,45 65,55 C65,65 70,75 65,85 C60,95 40,95 35,85 C30,75 35,65 35,55 C35,45 30,40 30,30 C30,20 40,10 50,10 Z" />
          <circle cx="50" cy="25" r="5" className="fill-blue-800" />
          <path d="M40,35 C40,35 45,40 50,40 C55,40 60,35 60,35" className="stroke-blue-800 fill-none" strokeWidth="2" />
        </svg>
      </motion.div>
    </div>
  );
}

export default TimeTraveller;