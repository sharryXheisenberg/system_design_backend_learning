// auth.js: Registration and login functions for different methods.
// INSECURE METHODS ARE FOR DEMO ONLY! Never use in production.
// Supports: 'plain' (direct), 'md5' (fast hash), 'sha256' (fast hash), 'bcrypt_peppered' (secure).

require('dotenv').config();  //loading .env for PEPPER
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const {getUser} = require('./db');
const { error } = require('console');


// defining the main thing that is Secret pepper from env

const PEPPER = process.env.PASSWORD_PEPPER;
if(!PEPPER){
    throw new Error('PASSWORD_PEPPER  not set in .env! Existing');
}

const SALT_ROUNDS = 12;

async function registerUser(username , password , method){
    let hashPass;

    try{
        switch (method){
            case 'plain':
                //INSECURE: Store as-is. this cause direct DB read
                hashPass = password;
                break;
            
            case 'md5':
                hashPass = crypto.createHash('md5').update(password).digest('hex');
                break;

            case 'sha256':
                hashPass = crypto.createHash('sha256').update(password).digest('hex');
                break;

            case 'bcrypt_peppered':
                const dataToHash = password +  PEPPER;
                hashPass = await bcrypt.hash(dataToHash , SALT_ROUNDS);
                break;

            default:
                throw new Error(`Unknown method :${method}`);

            }

        // Insert to DB (db.js handles uniqueness)

        const userId = await require('./db').insertUser(username,hashPass , method);
        return {success:true , userId , method};

    } catch(err){
        console.error(`Registration failed for ${username}:` , err.message);
        return {success:false , error: err.message};
    }
}

// Login user: Retrieve, re-hash entered pw, compare.

