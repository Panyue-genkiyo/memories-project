import jwt from 'jsonwebtoken';

//鉴权middleware 检查用户是否登陆
const auth = async (req, res, next) => {
    try{
        //检查是否有token存在
        console.log(req.headers);
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;
        let decodeData;
        if(token && isCustomAuth){
            decodeData = jwt.verify(token, 'wearyou1432'); //解析token中的数据
            //此时存入id(登入用户的id)
            req.userId = decodeData?.id;
        }else{
            decodeData = jwt.decode(token);
            req.userId = decodeData?.sub; //google id
        }
        next();
    }catch (error){
        console.log(error);
    }
}


export default auth;
