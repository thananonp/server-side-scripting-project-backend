const author = require('../models/authorModel')


const getAllAuthor = async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    await author
        .find({})
        .then(allBooks => res.send(allBooks))
        .catch(e => res.status(400).send(e))
}

const addNewAuthor = async (req, res) => {
    const newBook = req.body
    await author
        .create(newBook)
        .then(newStaff => res.send(newStaff))
        .catch(e => {
            res.sendStatus(400)
        });
}

const deleteAuthor = async (req, res) => {
    let isbn = req.params.isbn
    await author
        .deleteOne({"isbn": isbn})
        .then(
            res.sendStatus(204)
        ).catch(e => {
            console.log(e)
            res.sendStatus(404)
        });
}

const editAuthor = async (req, res) => {
    let isbn = req.params.isbn
    await author
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
    getAllAuthor, editAuthor, addNewAuthor, deleteAuthor
}
