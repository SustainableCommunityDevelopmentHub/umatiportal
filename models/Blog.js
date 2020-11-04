const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    id: Number,
    userid: String,
    username: String,
    blogexists: String,
    posttitle: String,
    subtext: String,
    blogtitle: String,
    authorname: String,
    post: String,
    location: String,
    postcat: String,
    posttags: String,
    postdate: Date,
    iphash: String,
    template: String,
    group: String,
    visibility: String
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;


