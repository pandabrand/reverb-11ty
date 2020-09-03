const { request, gql } = require('graphql-request');

module.exports = async function() {
  const query = gql`
    {
      vibe_managers(first: 1, where: {metaQuery: {relation: AND, metaArray: {compare: LIKE, key: "artist_city", value: "48142"}}}) {
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

      artists(where: {metaQuery: {relation: AND, metaArray: {compare: LIKE, key: "artist_city", value: "48142"}}}, first: 3) {
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

      locations(where: {metaQuery: {relation: AND, metaArray: {key: "location_city", compare: LIKE, value: "48142"}}}) {
        nodes {
          locationId
          title
          excerpt
          featuredImage {
            node {
              sourceUrl(size: LARGE_FEATURE)
              srcSet(size: LARGE_FEATURE)
            }
          }
          locationFieldGroup {
            instagramUrl
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
    }
  `;
  
  const data = await request(process.env.GRAPHQL_ENDPOINT, query);
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
    let srcset = (item.featuredImage) ? item.featuredImage.node.srcSet : '';
    let src = (item.featuredImage) ? item.featuredImage.node.sourceUrl : '';
    let instaUrl = item.locationFieldGroup.instagramUrl || '';
    let instaImg = item.locationFieldGroup.instagramImage || '';
    let photoCredit = item.locationFieldGroup.photoCredit || '';

    return {
      locationId: item.locationId,
      title: item.title,
      excerpt: item.excerpt,
      img: src,
      imgSrcSet: srcset,
      instagramUrl: instaUrl,
      instagramImage: instaImg,
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
    'locations': locations
  };
}