const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}))

app.use('/add-product',(req, res, next) => {
    console.log('In the middleware!');
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add product</button></form>');
});

app.use('/product',(req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

app.use('/',(req, res, next) => {
    console.log('In another middleware!');
    res.send('<h1>Hello from Express!</h1>');
});

const port = 3000;

app.listen(port);

console.log(`Server started on port: ${port}`);