import jwt from 'jsonwebtoken'

export const verify = (req, res, next) =>{

    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1]

        jwt.verify(token, "#123#890#", (err, user)=>{
            if (err){
                return res.status(403).json({message: "Token is not valid"})
            }

            req.user = user;
            next();
        })
    }else{
        res.status(401).json({message:"You are not authorized"});
    }
}