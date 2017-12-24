var AWS = require('aws-sdk')

var util = require('./util.js')

AWS.config.update({
  endpoint: 'https://dynamodb.eu-west-1.amazonaws.com',
  region: 'eu-west-1'
})

//Authentication for AWS is automatically done through env variables

const dynamoClient = new AWS.DynamoDB.DocumentClient()

const table = 'Parking_Spot'

function getSpots(userLat, userLon, offset = 0, limit, type) {
  return new Promise(function(resolve, reject) {

    /**
     * 'type' is a reserved word in DynamoDB, 
     *  so we have to use an Expression Attribute '#spot_type'
     *  instead and map it to the db field 'type'
     */
    let params = {
      TableName: table,
      ProjectionExpression: [
        'id',
        'spot_name',
        'lat',
        'lon',
        'coordinates',
        '#spot_type',
      ],
      ExpressionAttributeNames: {
        '#spot_type': 'type'
      },
    }

    // Filter with type if type is provided
    if (type) {
      params = Object.assign({}, params, {
        FilterExpression: '#spot_type = :spot_type',
        ExpressionAttributeValues: {
          ':spot_type': type,
        },
      })
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
      //sort array by distance with offset and limit applied
      data = util.sortByKey(data, 'distance')
    }

    if (limit) {
      data = data.splice(offset, limit)
    }

    return data
  })
  .catch(err => {
    return err  
  })
}

module.exports = {
  getSpots: (userLat, userLon, offset, limit, type) => getSpots(userLat, userLon, offset, limit, type)
}