var express = require('express')
var graphqlHTTP = require('express-graphql')
var body_parser = require('body-parser')
var dynamoConnection = require ('./dynamo.js')
var schema = require('./schema.js')

var root = {
  Spots: ({userLat, userLon, offset, limit, type}) => {
    return dynamoConnection.getSpots(userLat, userLon, offset, limit, type)
  },
}

var app = express()
app.use( body_parser.json({limit: '50mb'}))

app.use('/graphql', graphqlHTTP({
  schema: schema.schema,
  rootValue: root,
  graphiql: true,
}))
app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')

module.exports = app
