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
  }

  type Query {
    allSpots: [Spot]
  }
`);

module.exports = {
  schema: schema
}