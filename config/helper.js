const MySqli = require('mysqli' );


let conn = new MySqli({
host: 'localhost',
post: 3306,
user: 'root',
passwd: '',
db: 'mega_shop'
});

let db = conn.emit(false,'' );

module.exports = {
    secret: process.env.JWT_SECRET || 'yourSecretKey', // Ensure this key is set
    database: db
};

// module.exports = {
//     secret: process.env.JWT_SECRET || 'yourSecretKey', // Ensure this key is set
//     // other helper functions and configurations
// };