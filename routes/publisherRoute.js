const express = require('express');
const router = express.Router();
const {getAllPublisher, editPublisher, addNewPublisher, deletePublisher} = require('../controller/publisherController')


/* GET users listing. */
router.get('/getAll', getAllPublisher)
//Registration
router.post('/add', addNewPublisher)
//Delete account
router.delete('/delete/:id', deletePublisher)
//Edit account
router.put('/edit/:id', editPublisher)


module.exports = router;
