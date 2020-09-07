const { request, gql } = require('graphql-request');

module.exports = async function() {

  const query = gql`
    query cityQuery($cityId: String!, $cityPost: ID!) {
      vibe_managers(first: 1, where: {metaQuery: {relation: AND, metaArray: {compare: LIKE, key: "artist_city", value: $cityId}}, status: PRIVATE}) {
        nodes {
          vibe_managerId
          uri
          title
          content
          featuredImage {
            node {
              sourceUrl(size: FRONT_PAGE_IMAGE)
              srcSet(size: FRONT_PAGE_IMAGE)
            }
          }
        }
      }

      artists(where: {metaQuery: {relation: AND, metaArray: {compare: LIKE, key: "artist_city", value: $cityId}}, status: PRIVATE}, first: 3) {
        nodes {
          artistId
          content
          uri
          title
          featuredImage {
            node {
              sourceUrl(size: FRONT_PAGE_IMAGE)
              srcSet(size: FRONT_PAGE_IMAGE)
            }
          }
        }
      }

      locations(where: {metaQuery: {relation: AND, metaArray: {key: "location_city", compare: LIKE, value: $cityId}}, status: PRIVATE}) {
        nodes {
          databaseId
          title
          excerpt
          featuredImage {
            node {
              sourceUrl(size: LARGE_FEATURE)
              srcSet(size: LARGE_FEATURE)
            }
          }
          locationFieldGroup {
            address {
              streetAddress
              longitude
              latitude
            }
            website
            instagramImage
            photoCredit
          }
        }
      }
      city(id: $cityPost, idType: DATABASE_ID) {
        cityFieldGroup {
          cityLocation {
            latitude
            longitude
          }
        }
      }    
    }
  `;

  const variables = {
    cityId: process.env.CITY_ID,
    cityPost: process.env.CITY_ID,
  }

  const data = await request(process.env.GRAPHQL_ENDPOINT, query, variables);
  const city = data.city;
  
  const artists = data.artists.nodes.map((item) => {
    return {
      id: item.artistId,
      title: item.title,
      uri: item.uri,
      img: item.featuredImage.node.sourceUrl,
      imgSrcSet: item.featuredImage.node.srcSet,
      content: item.content
    };
  });

  const vibes = data.vibe_managers.nodes.map((item) => {
    return {
      id: item.vibe_managerId,
      title: item.title,
      uri: item.uri,
      img: item.featuredImage.node.sourceUrl,
      imgSrcSet: item.featuredImage.node.srcSet,
      content: item.content
    };
  });

  const locations = data.locations.nodes.map((item) => {
    let srcset = item.featuredImage && item.featuredImage.node.srcSet;
    let src = item.featuredImage && item.featuredImage.node.sourceUrl;
    let instagramImage = item.locationFieldGroup.instagramImage || '';
    let photoCredit = item.locationFieldGroup.photoCredit || '';

    return {
      locationId: item.databaseId,
      title: item.title,
      excerpt: item.excerpt,
      img: src,
      imgSrcSet: srcset,
      instagramImage: instagramImage,
      website: item.locationFieldGroup.website,
      photoCredit: photoCredit,
      address: item.locationFieldGroup.address.streetAddress,
      longitude: item.locationFieldGroup.address.longitude,
      latitude: item.locationFieldGroup.address.latitude,
    };
  });

  return {
    'artists': artists,
    'vibe_managers': vibes,
    'locations': locations,
    'city': city,
  };
}