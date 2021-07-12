const fetch = require('node-fetch');
const pattern = /^https?:\/\/www.instagram.com\/p\/[0-9a-zA-Z-_]*\//g;
const Url = require('@11ty/eleventy/src/Filters/Url');

module.exports = async ( src, srcSet, instagramURL ) => {
  let itemSrcSet = (typeof srcSet !== 'undefined' ) ? srcSet : '';
  let itemSrc = (typeof src !== 'undefined') ? src : '';
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

    if( json.thumbnail_url ) {
      itemSrc = json.thumbnail_url;
      itemSrcSet = '';
    }
  }

  const newItemSrc = itemSrc ? itemSrc : '/assets/images/location-placeholder@2x.jpg';

  return `<img src="${newItemSrc}" alt="" ${(itemSrcSet ? 'srcSet="'+itemSrcSet+'"' : '')} class="card-image cover"/>`;

}