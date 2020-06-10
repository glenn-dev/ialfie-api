const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');

/* CONST */
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router(app);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

// const seed = require('./database/seed');
