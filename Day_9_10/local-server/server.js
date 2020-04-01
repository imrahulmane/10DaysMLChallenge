let express = require("express");
let cors = require("cors");
let app = express();

app.use(cors())
app.use(function(req, res, next){
    console.log(`${new Date()} - ${req.method} request for ${req.url}`);
    next(); //pass
});

app.use(express.static("../static"));

app.listen(8000, function(){
    console.log("Serving static on 8000");
});
