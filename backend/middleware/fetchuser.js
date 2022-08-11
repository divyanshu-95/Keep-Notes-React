var jwt=require('jsonwebtoken');
const JWT_SECRET='Divyanshu';

const fetchuser=(req,res,next)=>{
    var token=req.header('auth-token');
    if(!token){
        res.status(401).send({error:'authenticate from valid'});
    }
    try {
        let data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).send({error:'authenticate from valid'});
    }
}
module.exports=fetchuser;