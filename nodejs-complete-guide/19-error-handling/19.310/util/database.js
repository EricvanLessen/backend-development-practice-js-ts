const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
mongoClient.connect(
    "mongodb+srv://ericvanlessen:JYAqHNk79C2tLk@cluster0.1qzfncf.mongodb.net/?retryWrites=true&w=majority"
)
    .then(client => {
        console.log('Connected!');
        _db = client.db();
        callback();
    })
    .catch(error => {
        console.log(error);
    });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;


