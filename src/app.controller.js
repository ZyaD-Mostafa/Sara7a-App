import userController from "./Modules/User/user.controller.js";
import authController from "./Modules/Auth/auth.controller.js";
import messageController from "./Modules/Message/message.controller.js";
import connDB from "./DB/conn-DB.js"
import { globalErrorHandller } from "./Utils/globleErrorHandller.utiles.js";
import cors from "cors";
const bootstrap = async (app, express) => {

    app.use(express.json());
    app.use(cors())
    connDB();
    app.use("/api/v1/user", userController);
    app.use("/api/v1/auth", authController);
    app.use("/api/v1/message", messageController);

    app.get("/", (req, res) => {
        return res.status(200).json({ meesage: "Sara7a App 🚀" });
    });
    app.all("/*dummy", (req, res) => {
        return res.status(404).json({ meesage: `This url: ${req.url} not found` });
    });

    // Global Error Handler Middelware 
    app.use(globalErrorHandller)



}

export default bootstrap;