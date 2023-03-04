function errorHandler(err, req, res, next){

    if(err.name === "ErrorNotFound") {
        res.status(404).json({
            message: "Error Not Found"
        })
    }
    else if(err.name === "WrongPassword"){
        res.status(400).json({
            message: "Wrong Password"
        })
    }

    else if(err.name === "Unauthenticated"){
        res.status(400).json({
            message: "Unauthenticated"
        })
    }

    else if(err.name === "JWTerror"){
        res.status(400).json({
            message: "JWT Error"
        })
    }
    
    else{
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
    console.log(err)
}

module.exports = errorHandler;