const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://thananonAdmin:Fenceheart42@library.8smya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const express = require('express')
const router = express.Router();
const app = express()

client.connect(err => {
    try {
        console.log('connected to database');
        app.listen(process.env.PORT || 3001, function () {
            console.log("Listening on port " + process.env.PORT);
            listDatabases(client);

            // if (process.env.NODE_ENV === 'test') {
            //     console.log('Running Tests...');
            //     // setTimeout(function () {
            //     //     try {
            //     //         // runner.run();
            //     //     } catch (e) {
            //     //         let error = e;
            //     //         console.log('Tests are not valid:');
            //     //         console.log(error);
            //     //     }
            //     // }, 3500);
            // }
        });

        // perform actions on the collection object
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
});
//Start our server and tests!
// module.exports = router
function listDatabases(client) {
    let databasesList = client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;

// module.exports = app()