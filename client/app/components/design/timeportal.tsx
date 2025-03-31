
const TimePortalEffect=()=> {
    return (
      <>
        {/* Animated portal effect around the image */}
        <div className="absolute inset-0 border-8 border-indigo-500 border-opacity-30 rounded-lg animate-pulse"></div>
        <div className="absolute -inset-1 border border-blue-400 border-opacity-40 rounded-lg"></div>
        
        {/* Time portal rings */}
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="absolute inset-0 border-2 border-blue-400 border-opacity-20 rounded-full animate-ping"
            style={{ 
              animationDuration: `${3 + i}s`,
              width: `${100 + i * 10}%`,
              height: `${100 + i * 10}%`,
              left: `${-i * 5}%`,
              top: `${-i * 5}%`
            }}
          ></div>
        ))}
      </>
    );
  }
  
  export default TimePortalEffect;