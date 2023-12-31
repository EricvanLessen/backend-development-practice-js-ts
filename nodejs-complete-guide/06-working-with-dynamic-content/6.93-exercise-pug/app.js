const path = require('path');

const express = require('express')
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', 'views');


const adminRoute = require('./routes/admin');
const dashboardRoute = require('./routes/dashboard');

app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminRoute.routes);
app.use('/', dashboardRoute);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
})

app.listen(3000);