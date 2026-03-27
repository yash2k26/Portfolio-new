import { serve, file } from "bun";
import index from "./index.html";

const server = serve({
  port: 3001,
  routes: {
    // Serve static assets from src/assets
    "/me-bw.jpeg": file("src/assets/me-bw.jpeg"),
    "/me-color.jpeg": file("src/assets/me-color.jpeg"),
    "/og-image.png": file("src/assets/og-image.png"),
    "/fight_club.jpg": file("src/assets/fight_club.jpg"),
    "/interstellar.jpg": file("src/assets/interstellar.jpg"),
    "/martian.jpg": file("src/assets/martian.jpg"),
    "/inception.jpg": file("src/assets/inception.jpg"),
    "/oppenheimer.jpg": file("src/assets/oppenheimer.jpg"),
    "/tenet.jpg": file("src/assets/tenet.jpg"),
    "/pulse-api.png": file("src/assets/pulse-api.png"),
    "/gemini1.png": file("src/assets/gemini1.png"),

    "/api/hello": {
      async GET(req) {
        return Response.json({ message: "Hello, world!", method: "GET" });
      },
      async PUT(req) {
        return Response.json({ message: "Hello, world!", method: "PUT" });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({ message: `Hello, ${name}!` });
    },

    // Serve index.html for all unmatched routes.
    // This must be last as it is a catch-all.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
