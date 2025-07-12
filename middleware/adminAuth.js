//admin permission
import jwt from "jsonwebtoken";
const adminAuth = async (req, res, next) => {
    try {
        const {token} = req.headers;
        if(!token) {
            return res.json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD) {
           return res.json({ success: false, message: "Unauthorized access" });
        }
       next();
        
    } catch (error) {
        console.error("Error in adminAuth:", error);
        res.json({ success: false, message: "Internal server error" });
        
    }
}
export default adminAuth;