var AWS = require('aws-sdk')

AWS.config.update({
  endpoint: 'https://dynamodb.eu-west-1.amazonaws.com',
  region: 'eu-west-1'
})

//Authentication for AWS is automatically done through env variables

const dynamoClient = new AWS.DynamoDB.DocumentClient()

const table = 'Parking_Spot'

function createSpot(spot) {
  return new Promise(function(resolve, reject) {
    var params = {
      TableName: table,
      Item: spot
    }

    dynamoClient.put(params, function(err, data) {
      if (err) return reject(err)
      return resolve(post)
    })

  })
}

function getSpots() {
  return new Promise(function(resolve, reject) {
    var params = {
      TableName: table,
      AttributesToGet: [
        'id',
        'spot_name',
        'lat',
        'lon',
        'coordinates',
        'type',
      ]
    }

    dynamoClient.scan(params, function(err, data) {
      if (err) return reject(err)
      return resolve(data['Items'])
    })

  })
}

module.exports = {
  getSpots: () => getSpots(),
  createSpot: () => createSpot()
}