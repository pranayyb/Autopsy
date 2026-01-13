import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`App listening on ${process.env.BACKEND_URL}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database", err);
        process.exit(1);
    });
