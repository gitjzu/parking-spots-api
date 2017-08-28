var { buildSchema } = require('graphql')

var schema = buildSchema(`
  type Coordinates {
    latitude: Float!
    longitude: Float!
  }

  type Spot {
    id: Int!
    spot_name: String!
    lat: Float!
    lon: Float!
    type: String!
    coordinates: [Coordinates]!
    distance: Float
  }

  type Query {
    Spots(userLat: Float, userLon: Float, spotName: String): [Spot]
  }
`);

module.exports = {
  schema: schema
}