const express = require('express');
const app = express();
const port = 3000;
const router = require("./routes/index.js");
const errorHandler = require("./middlewares/errorhandler.js")
app.use(express.json())
const morgan = require("morgan")

app.use(morgan());
app.use(router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})