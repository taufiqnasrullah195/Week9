const { query } = require("express");
const express = require("express")
const router = express.Router();
const pool = require("../config.js");
const {authentication} = require("../middlewares/auth.js");
const DEFAULT_LIMIT = 10;
const DEFAULT_PAAGE = 1;


router.get("/movies", (req, res, next) => {
    console.log(req.loggedUser);
    const {limit, page} = req.query;

    let resultLimit = limit ? limit : DEFAULT_LIMIT;
    let resultPage = page ? page : DEFAULT_PAAGE;


   const findQuery = `
        SELECT
                *
        FROM movies
        ORDER BY movies.id
        LIMIT ${resultLimit} OFFSET ${(resultPage - 1) * resultLimit}
   `
pool.query(findQuery, (err, result) => {
    if(err) next(err)

    res.status(200).json(result.rows);
})

})

router.get("/movies/:id", (req, res, next) =>{

    const {id} = req.params;
    
    const findOneQuery = `
    SELECT
    *
    FROM movies
    WHERE movies.id = $1
    `
    pool.query(findOneQuery, [id], (err, result) =>{
        if(err) next(err)
        if(result.rows.length === 0){
            // TIDAK KETEMU
            next({name: "ErrorNotFound"})
        }else{
            // KETEMU
            res.status(200).json(result.rows[0]);
        }
       
    })
})

router.post('/movies', (req, res, next) =>{
    const { id, title, genres, year } = req.body;
    const postMovies = `
        INSERT INTO movies (id, title, genres, year)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *
    `;
    pool.query(postMovies, [id, title, genres, year], (err, result) => {
        if(err) return next(err);

        const newMovie = result.rows[0];

        res.status(201).json({
            message: "Movies added succesfully"
        })
        
    })

})

router.put("/movies/:id", (req, res, next) =>{
    const {id} = req.params;
    const {title, genres, year} = req.body;
    const updateMovies = `
        UPDATE movies
        SET title = $1,
            genres = $2,
            year = $3,
        WHERE id = $4;

    `
    pool.query(updateMovies, [title, genres, year], (err, result) =>{
        if(err) next(err)

        res.status(200).json({
            message: "Update movies successfully"
        })
    })
})


router.delete("/movies/:id", (req, res, next) =>{

    const {id} = req.params;

    const deleteMovie = `
    DELETE FROM movies
    WHERE id = $1
    RETURNING *
    ` 

    pool.query(deleteMovie, [id], (err, result) =>{
        if(err) return next(err);

        const deletedMovie = result.rows[0];
        if(!deletedMovie){
            return res.status(404).json({
                message: "Movie Not Found"});
        }
        res.status(200).json({
            message: "Movie deleted successfully", movie: deletedMovie
        })
    })
})
module.exports = router;