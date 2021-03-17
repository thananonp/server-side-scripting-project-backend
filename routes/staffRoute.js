const express = require('express');
const router = express.Router();
const {addNewStaff, authenticate, deleteStaff, editStaff, getAllStaff} = require('../controller/staffController')


/* GET users listing. */
router.get('/getAll', getAllStaff)
//Registration
router.post('/add', addNewStaff)
//Delete account
router.delete('/delete/:email', deleteStaff)
//Edit account
router.put('/edit/:email', editStaff)
//Authenticate
router.post('/authenticate', authenticate)


module.exports = router;
