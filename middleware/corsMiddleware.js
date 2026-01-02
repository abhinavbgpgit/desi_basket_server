import cors from "cors";

const allowedOrigins = [
   "http://localhost:5173",
  "https://desi-kisan-live.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

export default cors(corsOptions);
