const express = require('express');
const router = express.Router();
const {getAllBook, editBook, addNewBook, deleteBook} = require('../controller/bookController')


/* GET users listing. */
router.get('/getAll', getAllBook)
//Registration
router.post('/add', addNewBook)
//Delete account
router.delete('/delete/:isbn', deleteBook)
//Edit account
router.put('/edit/:isbn', editBook)


module.exports = router;
