import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
