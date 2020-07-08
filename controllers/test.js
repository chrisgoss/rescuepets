// bring in Express (all the TOOLS [a kind of dependency])
// bring in Axios
const express = require('express');
const router = express.Router();

// write route that just sends "test route"
router.get('/test', function(req, res) {
    res.send("💩");
})

// this is a controller--three parts


// routes / models / seeder

// message to foreman on completion
// this is the app.listen (in index.js)
// anything that is not index.js it is module.exports

module.exports = router;