const sqlite3 = require('sqlite3').verbose();
const { rejects } = require('assert');
const path = require('path');
const { use } = require('react');

const dbPath = path.join(__dirname , 'passwords.db');
const db = new sqlite3.Database(dbPath);  // db variable basically is database in file and to create databbase from sqlite3 we need a file and in same directory take in same some variable like dbpath and that path variable will be use as path variable for .Database function


// now we need to initialize the DB -> create table if not exists;

async function initDB(){
    return new Promise((resolve,reject)=>{
        db.serialize(()=>{   // serialize() ensures that SQL statements run sequentially (one after another) in the callback.
            db.run(`
                CREATE TABLE IF NOT EXISTS users(
                 id INTEGER PRIMARY KEY AUTOINCREMENT ,     
                 username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                method TEXT NOT NULL
                )            
                `,(err)=>{
                    if(err){
                        reject(err);
                    }else{
                        console.log('Database initialized . Table "users" are ready ');
                        resolve();
                    }
                });
            });
        });
}


// now we need to gonna insert a user(async wrapper for safety).
async function insertUser(username , password,method){
    return new Promise((resolve,reject)=>{
        getUser(username)
        .then(existing =>{
            if(existing){
                reject(new Error(`User ${username} already exists`));
                return;
            }
            db.run(
                'INSERT INTO users(username , password , method) VALUES (?,?,?) ',
                [username,password,method],
                function(err){
                    if(err){
                        reject(err);
                    }else{
                        console.log(`User ${username} registered with method : ${method}`);
                        resolve(this.lastID);
                    }
                }

            );
        })
        .catch(reject);
    });
}

// get user by username (returns {id , username , password , method} or null ).

async function getUser(username){
    return new Promise((resolve ,reject)=>{
        db.get(
            'SELECT * FROM users WHERE username = ?',
            [username] ,
            (err,row) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(row || null);
                }
            }
        );
    });
}


// Dump all users (for breach demo : show plain vs hashed)

async function dumpUsers(){
    return new Promise((resolve,reject)=>{
        db.all('SELECT * FROM users',[] , (err,rows)=>{
            if(err){
                reject(err);
            }else{
                console.table(rows);
                resolve(rows);
            }
        });
    });
}

// close DB (call on aoo exit)

function closeDB(){
    db.close((err)=>{
        if(err){
            console.error(err.message);
        }
        console.log('Database closed');
    });
}

module.exports = {initDB , insertUser , getUser , dumpUsers , closeDB};
