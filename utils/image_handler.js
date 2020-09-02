const fetch = require('node-fetch');
const pattern = /^https?:\/\/www.instagram.com\/p\/[0-9a-zA-Z-_]*\//g;

module.exports = async ( src, srcSet, instagramURL ) => {
  let itemSrcSet = (typeof srcSet !== 'undefined' ) ? `srcset="${ srcSet }"` : '';
  let itemSrc = (typeof src !== 'undefined') ? `src="${ src }"` : '';
  const url = instagramURL.match( pattern );

  if( url ) {
    const params = new URLSearchParams();
    params.append( 'url', url[0] );
    params.append( 'maxwidth', 640 );
    params.append( 'fields', 'thumbnail_url' );
    params.append( 'access_token', `${process.env.INSTAGRAM_API_APP}|${process.env.INSTAGRAM_API_CLIENT}` );

    const endpoint = process.env.INSTAGRAM_API_URL + '?' + params.toString();

    const response = await fetch( endpoint );

    const json = await response.json();

    itemSrc = ( json.thumbnail_url ) ? `src="${json.thumbnail_url}"` : '';
  }

  return `<img ${itemSrc} alt="" ${itemSrcSet} class="card-image cover"/>`;

}