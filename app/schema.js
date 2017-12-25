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
    Spots(userLat: Float, userLon: Float, offset: Int, limit: Int, type: String, name: String): [Spot]
  }
`);

module.exports = {
  schema: schema
}