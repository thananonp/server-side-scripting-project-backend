const bookResolver = require('./bookResolver.js');
const authorResolver = require('./authorResolver.js')
const categoryResolver = require('./categoryResolver.js')
const publisherResolver = require('./publisherResolver.js')
const staffResolver = require('./staffResolver.js')
const userResolver = require('./userResolver.js')

module.exports = [bookResolver, authorResolver, categoryResolver, publisherResolver, staffResolver, userResolver]