const { request, gql } = require('graphql-request');

module.exports = async function() {
  const query = gql`
    {
      artists(where: {metaQuery: {relation: AND, metaArray: {key: "artist_city", compare: LIKE, value: "48142"}}}) {
        nodes {
          artistId
          title
          uri
          featuredImage {
            node {
              sourceUrl(size: MEDIUM_LARGE)
              srcSet(size: MEDIUM_LARGE)
            }
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
      imgSrcSet: item.featuredImage.node.srcSet
    };
  });
  return artists;
}