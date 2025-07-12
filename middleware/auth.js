// auth middlerwareleware
import jwt from 'jsonwebtoken';
const authUser = async (req, res, next) => {
    try {
        const {token} = req.headers;
        if (!token) {
            return res.json({ success: false, message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        res.json({ success: false, message: "Internal server error" });
    }
}
export default authUser;