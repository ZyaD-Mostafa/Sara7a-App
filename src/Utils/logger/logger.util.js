import fs from "fs";
import path from "path";
import morgan from "morgan";

const __dirname = path.resolve();

export function attachRouterWithLogher(app, routerPath, router, logFileName) {

    const logsDir = path.join(__dirname, "src/logs");

    // Create the logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    const logFilePath = path.join(logsDir, logFileName);

    const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

    app.use(routerPath, morgan("combined", { stream: logStream }), router);
    app.use(routerPath, morgan("dev"), router);
}
