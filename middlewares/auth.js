const jwt = require("jsonwebtoken");
const secretKey = "RAHASIANEGARA"

function authentication(req, res, next) {

    console.log(req.headers);
    const {access_token} = req.headers;
    const pool = require("../config.js");

    if(access_token){
        try{
            const decoded = jwt.verify(access_token, secretKey);
            const {id, email} = decoded
            const findUser = `
            SELECT * FROM users WHERE id = $1;`

            pool.query(findUser, [id], (err, result) =>{
                if(err) next(err);
                if(result.rows.length === 0){
                    next({name: "ErrorNotFound"})
                }else{
                    const email = result.rows[0]
                    req.loggedUser = {
                        id: user.id,
                        email: email.id
                    }
                    next();
                }
            })
        }catch(err){
            next({name: "JWTerror"})
        }
        
    }else{
        next({name: "Unauthenticated"})

    }
}

function authorization(req, res, next){
console.log(req.loggedUser);
}

module.exports = {
    authentication,
    authorization
}