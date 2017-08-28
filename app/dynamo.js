var AWS = require('aws-sdk')

var util = require('./util.js')

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

function getSpots(userLat, userLon) {
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
  .then(data => {
    if(userLat && userLon) {
      data.forEach(spot => {
        //count the crow fly distance here
        distanceInKm = util.distance(spot.lat, spot.lon, userLat, userLon)
        //round to 1 decimal and add to spot properties
        spot.distance = distanceInKm.toFixed(1)
      })
      //return array sorted by distance
      return util.sortByKey(data, 'distance')
    }
    //No user location, so just pass the data like we got it from DB
    return data
  })
  .catch(err => {
    return err  
  })
}

module.exports = {
  getSpots: (userLat, userLon) => getSpots(userLat, userLon),
  createSpot: () => createSpot()
}