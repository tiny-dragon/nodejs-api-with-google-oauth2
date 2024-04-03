var pool = require('../config/database')

exports.getAll = function(body, callback) {
    try {
        pool.query("SELECT * FROM lesson", (err, result) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, result)
            }
        })
    } catch (e) {
        callback(e, null)
    }
}

exports.addLesson = function(body, callback) {
    try {
        const { pdf_path, name, picture, number_of_pages } = body
        const now = new Date()

        pool.query("INSERT INTO lesson (pdf_path, name, picture, number_of_pages, date_added) VALUES ?", [[[pdf_path, name, picture, number_of_pages, now]]], (err, result) => {
            if (err) callback(err, null)
            callback(null, result.insertId)
        })
    } catch (e) {
        callback(e, null)
    }
}

exports.savePage = function(body, callback) {
    try {
        const { user_id, lesson_id, last_page } = body
        const now = new Date()

        pool.query("SELECT * FROM user_lesson_progress WHERE user_id = ? AND lesson_id = ?", [user_id, lesson_id], (err, result) => {
            if (err) {
                callback(err, null)
            } else {
                if (result.length == 0) {
                    pool.query("INSERT INTO user_lesson_progress (user_id, lesson_id, last_page, timestamp) VALUES ?", [[[user_id, lesson_id, last_page, now]]], (err, result) => {
                        if (err) callback(err, null)
                        callback(null, result.insertId)
                    })
                } else {
                    pool.query("UPDATE user_lesson_progress SET last_page = ?, timestamp = ? WHERE user_id = ? AND lesson_id = ?", [last_page, now, user_id, lesson_id], (err, result) => {
                        if (err) callback(err, null)
                        callback(null, result.insertId)
                    })
                }
            }
        })

    } catch (e) {
        callback(e, null)
    }
}