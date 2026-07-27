export function csrfMiddleware(req, res, next) {

    if (
        req.method === "GET" ||
        req.path === "/auth/login" ||
        req.path === "/auth/refresh"
    ) {
        return next();
    }

    const cookieToken = req.cookies.csrf_token;
    const headerToken = req.headers["x-csrf-token"];

    if (!cookieToken || !headerToken) {
        return res.status(403).json({
            message: "CSRF token missing"
        });
    }

    if (cookieToken !== headerToken) {
        return res.status(403).json({
            message: "Invalid CSRF token"
        });
    }

    next();
}