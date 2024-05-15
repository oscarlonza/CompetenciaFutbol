import express from "express";
import indexRoutes from "./routes/index.routes.js";
import { PORT } from "./config.js";

const app = express();
app.use(express.json());

app.use(indexRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
