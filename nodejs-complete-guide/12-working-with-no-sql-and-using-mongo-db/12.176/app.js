const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const errorController = require('./controllers/404');
const database = require('./util/database');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("64eb3cbc2a26b133020acab8")
    .then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    }).
    catch((err) => {
        console.log(err)
    });
});

app.use((req, res, next) => {
    console.log("test");
    next();
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

database.mongoConnect(()=> {
    //if()
    app.listen(3000);
});
