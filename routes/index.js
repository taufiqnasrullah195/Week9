const express = require("express");
const router = express.Router();
const movieRouter = require("./movies.js")
const pool = require("../config.js");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync();
const jwt = require("jsonwebtoken");
const secretKey = "RAHASIANEGARA"
const {authentication} = require("../middlewares/auth.js");

router.post("/login", (req, res, next) =>{
    const {email, password} = req.body;

    const findUser = `
        SELECT
        *
        FROM users
        WHERE email = $1
    `

    pool.query(findUser, [email], (err, result) => {
        if (err) next(err)
        if(result.rows.length === 0){
            // TIDAK KETEMU
            next({name: "ErrorNotFound"})
        }else{
            // KETEMU
            const data = result.rows[0]
            const comparePassword = bcrypt.compareSync(password, data.password);
            
            if(comparePassword){
                //Password benar
                const accessToken = jwt.sign({
                    id: data.id,
                    email: data.email,
                }, secretKey)

                res.status(200).json({
                    id: data.id,
                    email: data.email,
                    accessToken: accessToken
                })

            }else{
                //Password salah
                next({name: "WrongPassword"})
            }
        }
    })
})

router.post('/register', (req, res, next) => {
    const { email, gender, password, role } = req.body;
    
    const hash = bcrypt.hashSync(password, salt);
    const registerUser = `
    INSERT INTO users (email, gender, password, role)
        VALUES
        ($1, $2, $3, $4)
    `;

    pool.query(registerUser, [email, gender, hash, role], (err, result) => {
        if(err) next(err)
        res.status(201).json({
            message: "Register Successfully"
        });
        return;
    })
    
    });

router.use(authentication)
router.use("/", movieRouter)

module.exports = router;