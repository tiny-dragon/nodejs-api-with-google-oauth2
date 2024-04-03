const jwt = require('jsonwebtoken')
const settings = require('../config/settings')
const google = require('googleapis').google
const userModel = require('../models/user')
const bookModel = require('../models/book')
const lessonModel = require('../models/lesson')

// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2;

exports.glogin = function (req, res) {
    try {
        const oauth2Client = new OAuth2(settings.oauth2Credentials.client_id, settings.oauth2Credentials.client_secret, settings.oauth2Credentials.redirect_uris[0]);

        const loginLink = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: settings.oauth2Credentials.scopes
        });
        // return res.render("ejs/index", { loginLink: loginLink });
        return res.status(200).json({
            message : 'success',
            data    : { loginLink }
        })
    } catch (e) {
        return res.status(400).json({
            message : e,
            data    : null
        })
    }
}

exports.auth_callback = async function (req, res) {
    try {
        // Create an OAuth2 client object from the credentials in our config file
        const oauth2Client = new OAuth2(settings.oauth2Credentials.client_id, settings.oauth2Credentials.client_secret, settings.oauth2Credentials.redirect_uris[0]);

        if (req.query.error) {
            // The user did not give us permission.
            res.redirect('/glogin');
        } else {
            const data = await oauth2Client.getToken(req.query.code);
            const tokens = data.tokens;
            // console.log(tokens);
            oauth2Client.setCredentials(tokens);
            const service = google.people({ version: 'v1', auth: oauth2Client });
            const me = await service.people.get({
                resourceName: 'people/me',
                personFields: 'names,emailAddresses',
            });
            const google_id = '';
            const name = me.data.names[0].displayName;
            const email = me.data.emailAddresses[0].value;
            
            userModel.userLogin({google_id, name, email}, (err, result) => {
                if (err) {
                    res.status(400).json({
                        message : err,
                        data    : null
                    })
                } else {
                    tokens.user_id = result;
                    res.cookie('jwt', jwt.sign(tokens, settings.TOKEN_SECRET));
                    res.status(200).json({
                        message : 'success',
                        data    : { name, email }
                    })
                }
            })
        }
    } catch (e) {
        res.status(400).json({
            message : e,
            data    : null
        })
        // res.redirect('/glogin');
    }
}

exports.library = function (req, res, next) {
    try {
        if (!req.cookies.jwt) {
            res.status(400).json({
                message : "Authentication Error",
                data    : null
            })
            // res.redirect('/glogin');
        } else {
            jwt.verify(req.cookies.jwt, settings.TOKEN_SECRET)

            bookModel.getAll(null, function(err, result) {
                if (err)
                    res.status(400).json({message:err, data: null})
                else {
                    res.status(200).json({
                        message : 'success',
                        data    : {
                            books   : result
                        }
                    })
                }
            })
        }
    } catch (e) {
        res.status(400).json({message: e})
    }
}

exports.save_page = function (req, res, next) {
    try {
        if (!req.cookies.jwt) {
            res.status(400).json({
                message : "Authentication Error",
                data    : null
            })
        } else {
            const { user_id } = jwt.verify(req.cookies.jwt, settings.TOKEN_SECRET)
            const { lesson_id, last_page } = req.body;
            
            lessonModel.savePage({user_id, lesson_id, last_page}, function(err, result) {
                if (err)
                    res.status(400).json({message:err, data: null})
                else {
                    res.status(200).json({
                        message : 'success',
                        data    : null
                    })
                }
            })
        }
    } catch (e) {
        console.log(e)
        res.status(400).json({message: e})
    }
}

exports.favorite = function (req, res, next) {
    try {
        if (!req.cookies.jwt) {
            res.status(400).json({
                message : "Authentication Error",
                data    : null
            })
        } else {
            const { user_id } = jwt.verify(req.cookies.jwt, settings.TOKEN_SECRET)
            const { book_id, favorite } = req.body;
            
            bookModel.addFavoriteBook({user_id, book_id, favorite}, function(err, result) {
                if (err)
                    res.status(400).json({message:err, data: null})
                else {
                    res.status(200).json({
                        message : 'success',
                        data    : null
                    })
                }
            })
        }
    } catch (e) {
        res.status(400).json({message: e})
    }
}

exports.contact_us = function (req, res, next) {
    try {
        if (!req.cookies.jwt) {
            res.status(400).json({
                message : "Authentication Error",
                data    : null
            })
        } else {
            const { user_id } = jwt.verify(req.cookies.jwt, settings.TOKEN_SECRET)
            const { text } = req.body;
            
            userModel.addUserInquery({user_id, text}, function(err, result) {
                if (err)
                    res.status(400).json({message:err, data: null})
                else {
                    res.status(200).json({
                        message : 'success',
                        data    : null
                    })
                }
            })
        }
    } catch (e) {
        res.status(400).json({message: e})
    }
}