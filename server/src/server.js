import dotenv from "dotenv";
dotenv.config();
import "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
