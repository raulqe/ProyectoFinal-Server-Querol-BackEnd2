
export const authorization = (role) => {
    return async (req, res, next) => {

        if(!req.user) return res.status(401).json({ error: "Your role is't authorized in this area." });
        if(req.user.role !== role) return res.status(403).json({ error: "Your role is't valid for this area." });
        
        next();
    }
}