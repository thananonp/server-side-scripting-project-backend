const express = require('express');
const router = express.Router();
const {getAllAuthor, editAuthor, addNewAuthor, deleteAuthor} = require('../controller/authorController')


/* GET users listing. */
router.get('/getAll', getAllAuthor)
//Registration
router.post('/add', addNewAuthor)
//Delete account
router.delete('/delete/:id', deleteAuthor)
//Edit account
router.put('/edit/:id', editAuthor)


module.exports = router;
