import userController from "./Modules/User/user.controller.js";
import authController from "./Modules/Auth/auth.controller.js";
import messageController from "./Modules/Message/message.controller.js";
import connDB from "./DB/conn-DB.js"
import { globalErrorHandller } from "./Utils/globleErrorHandller.utiles.js";
import cors from "cors";
import path from "path";
import { attachRouterWithLogher } from "./Utils/logger/logger.util.js";
import helmet from "helmet";
import { corsOption } from "./Utils/Cors/cors.util.js";
import { rateLimit } from "express-rate-limit"
const bootstrap = async (app, express) => {

    app.use(express.json());
    app.use(cors(corsOption())) //any one can access the app if has the url 
    app.use(helmet()) //helmet is a middleware that helps to secure the app
    const limiter = rateLimit({
        windowMs: 5 * 60 * 1000, // 5 minutes
        limit: 100, // limit each IP to 100 requests per windowMs
        message: {
            statusCode: 429,
            message: "Too many requests from this IP, please try again later"
        },
        legacyHeaders: false
    })
    app.use(limiter)
    connDB();
    attachRouterWithLogher(app, "/api/v1/auth", authController, "auth.log")
    attachRouterWithLogher(app, "/api/v1/user", userController, "users.log")
    attachRouterWithLogher(app, "/api/v1/message", messageController, "message.log")
    // app.use(morgan()) //globle
    app.use("/uploads", express.static(path.resolve("./src/uploads")))
    app.use("/api/v1/user", userController);
    app.use("/api/v1/auth", authController);
    app.use("/api/v1/message", messageController);

    app.get("/", (req, res) => {
        // return  res.send(`<script>alert("XSS Attack!!")</script>`)
        return res.status(200).json({ meesage: "Sara7a App 🚀" });
    });
    app.all("/*dummy", (req, res) => {
        return res.status(404).json({ meesage: `This url: ${req.url} not found` });
    });

    // Global Error Handler Middelware 
    app.use(globalErrorHandller)



}

export default bootstrap;

// some attacks

// xss (cros site scripting)


// clickjacking --> butten click  --- >direct to other website fake button  on the real button


// mime sniffing --> browser try to guess the content type of the response


// HSTS ( http strict transport security  ) --> force the browser to use only https  dont use http




/// cors --> cross origin resource sharing

// http://localhost:3000/path --> origin 






//expression 
//^[A-Z][a-z]{1,16}\s{1}[A-Z][a-z]{1,16}$ --> name 

//^01[0125][0-9]{8}$ // --> phone number Eg   the same  ^01[0125]\d{8}$
//^(002|\+2)?01[0125]\d{8}$ --> phone number start with 002 or +2