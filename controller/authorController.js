const author = require('../models/authorModel')


const getAllAuthor = async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    await author
        .find({})
        .then(allBooks => res.send(allBooks))
        .catch(e => res.status(400).send(e))
}

const addNewAuthor = async (req, res) => {
    const newAuthor = req.body
    await author
        .create(newAuthor)
        .then(newStaff => res.send(newStaff))
        .catch(e => {
            res.sendStatus(400)
        });
}

const deleteAuthor = async (req, res) => {
    await author
        .deleteOne({"_id": req.params.id})
        .then(
            res.sendStatus(204)
        ).catch(e => {
            console.log(e)
            res.sendStatus(404)
        });
}

const editAuthor = async (req, res) => {
    let id = req.params.id
    await author
        .findOneAndUpdate({"_id": id}, {
            firstName: req.body.firstName,
            lastName: req.body.lastName
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
