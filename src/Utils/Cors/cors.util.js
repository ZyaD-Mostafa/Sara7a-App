export function corsOption() {

    const whitList =process.env.WHITE_LISTED_ORIGINS.split(",")

    const corsOptions = {
        origin: function (origin, callback) {
            if (whitList.includes(origin) || !origin) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // allowed methods

    }

    return corsOptions;
}