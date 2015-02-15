// TODO: Database implementation
var config = require('config');
var Sequelize = require('sequelize');

var redisClient = require("redis"),
    redis = redisClient.createClient();

var sequelize = new Sequelize(config.get('database.database'), config.get('database.username'), config.get('database.password'), {
    host: '10.0.2.15',
    dialect: 'mysql',
    port: 3306,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .complete(function (err) {
        if (err) {
            console.log('Unable to connect to the database:', err)
        }
    });

var User = sequelize.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    passkey: Sequelize.STRING,
    upload: Sequelize.INTEGER,
    download: Sequelize.INTEGER,
    enabled: Sequelize.INTEGER
}, {
    tableName: 'users', // this will define the table's name
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

redis.on("error", function (err) {
    console.log("Redis Error " + err);
});

var exports = module.exports = {};

exports.loadUsers = function () {
    var userCount = 0;
    User.findAll({where: {enabled: 1}}).then(function (users) {
        for(k in users)
        {
            userCount += 1;
            user = [users[k].username, users[k].id, users[k].download, users[k].passkey, users[k].upload, users[k].enabled];
            redis.set(users[k].passkey, user);
        }
    });

    //TODO: this won't work because it runs before the query is done.
    console.log('Loaded users: ' + userCount);
    console.log(redis.get('0ristj5ygmtdpazgrvcl9sxetdga66bl'));
};
