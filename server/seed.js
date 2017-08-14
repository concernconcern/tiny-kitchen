const db = require('./db');
const User = db.model('user');


const Promise = require('bluebird');
const chance = require('chance')(123);

function doTimes (n, fn) {
  var results = [];
  while (n--) {
    results.push(fn());
  }
  return results;
}

let emails = chance.unique(chance.email, 100);

function randUser () {
  let address = chance.address();
  return User.build({
    first_name: chance.first(),
    last_name: chance.last(),
    email: emails.pop(),
    password: chance.word(),
    picture_url: "https://maxcdn.icons8.com/Share/icon/Users//circled_user_female1600.png",
    is_admin: chance.weighted([true, false], [5, 95]),
  });
}

function generateUsers(){
  let users = doTimes(100, randUser);
  users.push(User.build({
    first_name: 'Sarah',
    last_name: 'Charles',
    email: 'sarah@sarha.com',
    password: 'gus',
    is_admin: true,
    picture_url: 'https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/20768023_10207797720139613_1847547037954003603_n.jpg?oh=2d3912b2d890d2129bbbeed2460edea9&oe=59F07A99'
  }));
  users.push(User.build({
    first_name: 'Danni',
    last_name: 'Liu',
    email: 'danni@liu.liu',
    password: 'liu',
    is_admin: true,
    picture_url: 'https://maxcdn.icons8.com/Share/icon/Users//circled_user_female1600.png'
  }));
  return users;
}

function createUsers(){
  return Promise.map(generateUsers(), function(user) {
    return user.save();
  });
}

function seed() {
  let arr = [createUsers()];
  return Promise.all(arr);
}

console.log('Syncing database');

db.sync({force: true})
.then(() => {
  console.log('Seeding database');
  return seed();
})
.then(function () {
  console.log('Seeding successful');
}, function (err) {
  console.error('Error while seeding');
  console.error(err.stack);
})
.finally(function () {
  db.close();
  return null;
});
