const { request, gql } = require('graphql-request');

module.exports = async function() {
  const query = gql`
    query artistQuery($cityId: String!) {
      artists(where: {metaQuery: {relation: AND, metaArray: {key: "artist_city", compare: LIKE, value: $cityId}}}) {
        nodes {
          databaseId
          title
          content
          uri
          featuredImage {
            node {
              sourceUrl(size: FRONT_PAGE_REVERB)
              srcSet(size: FRONT_PAGE_REVERB)
            }
          }
          artistFieldGroup {
            artistsLocations {
              location {
                ... on Location {
                  id
                  featuredImage {
                    node {
                      sourceUrl(size: LARGE_FEATURE)
                      srcSet(size: LARGE_FEATURE)
                    }
                  }
                  databaseId
                  locationFieldGroup {
                    address {
                      latitude
                      longitude
                      streetAddress
                    }
                    website
                    photoCredit
                    instagramImage
                    instagramUrl
                  }
                  content
                  excerpt
                  title
                }
              }
            }
          }    
        }
      }  
    }
  `;
  
  const variables = {
    cityId: process.env.CITY_ID,
  }

  const data = await request(process.env.GRAPHQL_ENDPOINT, query, variables);

  const artists = data.artists.nodes.map((item) => {
    return {
      id: item.databaseId,
      title: item.title,
      content: item.content,
      excerpt: item.excerpt,
      uri: item.uri,
      img: item.featuredImage.node.sourceUrl,
      imgSrcSet: item.featuredImage.node.srcSet,
      locations: item.artistFieldGroup.artistsLocations,
    };
  });

  return artists;
}