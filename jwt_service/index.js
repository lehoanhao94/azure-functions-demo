var jwt = require("jsonwebtoken");

module.exports = async function (context, req) {
    try {
        const { method, headers } = req;
        // Check health if the request is a GET request
        context.log("Health check succeed: ", req.body);
        if (method === "GET") {
            context.log("Health check succeed: ", headers["user-agent"]);
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: `Health check succeed: ${headers["user-agent"]}`,
            };
        }
        // Create a new JWT if the request is a POST request
        else {
            var identity = req.body.identity;
            var clientId = process.env["KoreAiClientId"];
            var clientSecret = process.env["KoreAiClientSecret"];
            var isAnonymous = req.body.isAnonymous || false;
            var aud = req.body.aud || "https://idproxy.kore.com/authorize";

            var options = {
                iat: new Date().getTime(),
                exp: new Date(
                    new Date().getTime() + 24 * 60 * 60 * 1000
                ).getTime(),
                aud: aud,
                iss: clientId,
                sub: identity,
                isAnonymous: isAnonymous,
            };

            var token = jwt.sign(options, clientSecret);

            const response = {
                jwt: token,
            };

            context.res = {
                // status: 200, /* Defaults to 200 */
                body: response,
            };
        }
    } catch (error) {
        context.log.error(error);
    }
};
