import React from "react";

const favMovies = [
  { title: "Fight Club", img: "/fight_club.jpg" },
  { title: "Interstellar", img: "/interstellar.jpg" },
  { title: "The Martian", img: "/martian.jpg" },
  { title: "Inception", img: "/inception.jpg" },
  { title: "Oppenheimer", img: "/oppenheimer.jpg" },
  { title: "Tenet", img: "/tenet.jpg" }
];

export const MovieShelf = () => {
  return (
    <div className="flex justify-center sm:justify-start w-full mt-4 pl-1">
      <div className="flex -space-x-4 hover:space-x-1 sm:-space-x-8 sm:hover:space-x-2 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group/shelf isolate">
        {favMovies.map((movie, index) => (
          <div 
            key={index} 
            className="relative w-28 h-40 sm:w-32 sm:h-48 shrink-0 rounded-lg overflow-hidden border-2 border-(--bg-primary) shadow-sm hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-4 cursor-pointer group/card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-muted) focus-visible:-translate-y-4 focus-visible:z-50 focus-within:z-50 hover:z-50"
            style={{ 
              zIndex: 10 + index,
              transformOrigin: 'bottom center'
            }}
            tabIndex={0}
          >
            <img 
              src={movie.img} 
              alt={movie.title} 
              className="w-full h-full object-cover scale-100 group-hover/card:scale-110 group-focus/card:scale-110 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
