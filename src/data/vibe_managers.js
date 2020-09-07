const { request, gql } = require('graphql-request');

module.exports = async function() {
  const query = gql`
    query artistQuery($cityId: String!) {
      vibe_managers(first: 1, where: {metaQuery: {relation: AND, metaArray: {key: "artist_city", compare: LIKE, value: $cityId}}}) {
        nodes {
          databaseId
          title
          content
          uri
          featuredImage {
            node {
              sourceUrl(size: FRONT_PAGE_IMAGE)
              srcSet(size: FRONT_PAGE_IMAGE)
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
                  }
                  content
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

  const vibe_managers = data.vibe_managers.nodes.map((item) => {
    return {
      id: item.databaseId,
      title: item.title,
      content: item.content,
      uri: item.uri,
      img: item.featuredImage.node.sourceUrl,
      imgSrcSet: item.featuredImage.node.srcSet,
      locations: item.artistFieldGroup.artistsLocations,
    };
  });

  return vibe_managers;
}