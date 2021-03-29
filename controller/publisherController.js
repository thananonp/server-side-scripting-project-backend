const publisher = require('../models/publisherModel')


const getAllPublisher = async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    await publisher
        .find({})
        .then(allBooks => res.send(allBooks))
        .catch(e => res.status(400).send(e))
}

const addNewPublisher = async (req, res) => {
    const newAuthor = req.body
    await publisher
        .create(newAuthor)
        .then(newStaff => res.send(newStaff))
        .catch(e => {
            res.sendStatus(400)
        });
}

const deletePublisher = async (req, res) => {
    await publisher
        .deleteOne({"_id": req.params.id})
        .then(
            res.sendStatus(204)
        ).catch(e => {
            console.log(e)
            res.sendStatus(404)
        });
}

const editPublisher = async (req, res) => {
    let id = req.params.id
    await publisher
        .findOneAndUpdate({"_id": id}, {
            name: req.body.name,
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
    getAllPublisher, editPublisher, addNewPublisher, deletePublisher
}
