const db = require('../utils/db')
const secret = process.env.SECRETJWT
const jwt = require('jsonwebtoken');
const book = require('../models/bookModel')


const getAllBook = async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    await book
        .find({})
        .then(allBooks => res.send(allBooks))
        .catch(e => res.status(400).send(e))
}

const addNewBook = async (req, res) => {
    const newBook = req.body
    await book
        .create(newBook)
        .then(newStaff => res.send(newStaff))
        .catch(e => {
            res.sendStatus(400)
        });
}

const deleteBook = async (req, res) => {
    let isbn = req.params.isbn
    await book
        .deleteOne({"isbn": isbn})
        .then(
            res.sendStatus(204)
        ).catch(e => {
            console.log(e)
            res.sendStatus(404)
        });
}

const editBook = async (req, res) => {
    let isbn = req.params.isbn
    await book
        .findOneAndUpdate({isbn: isbn}, {
            title: req.body.title,
            year: req.body.year,
            writer: req.body.password,
            publisher: req.body.publisher
        }, {new: true})
        .then(result => {
            if (result) {
                console.log("RESULT", result)
                res.send(result)
            } else {
                res.sendStatus(404)
            }
        }).catch(e => {
            console.log(e)
            res.sendStatus(400)
        })

}

module.exports = {
    getAllBook, editBook, addNewBook, deleteBook
}
