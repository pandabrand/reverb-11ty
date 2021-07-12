const fetch = require('node-fetch');
const pattern = /^https?:\/\/www.instagram.com\/p\/[0-9a-zA-Z-_]*\//g;

module.exports = async ( location ) => {
  let itemSrc = location.featuredImage && `src="${ location.featuredImage.node.sourceUrl }"`;
  let itemSrcSet = location.featuredImage && `srcset="${ location.featuredImage.node.srcSet }"`;
  const url = location.locationFieldGroup.instagramImage && location.locationFieldGroup.instagramImage.match( pattern );

  if( url ) {
    const params = new URLSearchParams();
    params.append( 'url', url[0] );
    params.append( 'maxwidth', 640 );
    params.append( 'fields', 'thumbnail_url' );
    params.append( 'access_token', `${process.env.INSTAGRAM_API_APP}|${process.env.INSTAGRAM_API_CLIENT}` );

    const endpoint = process.env.INSTAGRAM_API_URL + '?' + params.toString();

    const response = await fetch( endpoint );

    const json = await response.json();

    if( json.thumbnail_url ) {
      itemSrc = `src="${json.thumbnail_url}"`;
      itemSrcSet = '';
    }
  }

  const fallbackSrc = itemSrc ? itemSrc : 'src="/assets/images/location-placeholder@2x.jpg"';
  return `<img ${fallbackSrc} alt="" ${itemSrcSet} class="card-image cover"/>`;

}