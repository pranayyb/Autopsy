import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
}

export default app;
