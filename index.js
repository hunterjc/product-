const express = require("express");
const connectDb = require("./db/connect.js");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 9000;
const passport = require("passport");
const app = express();
const http = require("http");
const apiV1Route = require("./routes/api.v1.route");
const helmet = require("helmet");

const start = async () => {
  const server = http.createServer(app);
  require("./strategies/JWTStrategy.js");
  let io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
    serveClient: true,
  });

  app.use(helmet());
  app.use(cors());
  app.use(passport.initialize());
  app.use(express.json());
  app.use(express.static("public"));

  app.use("/api/v1", apiV1Route);

  server.listen(PORT, () => {
    console.log(`Server Started at : http://localhost:${PORT}`);
  });
  await connectDb();
};

start();
