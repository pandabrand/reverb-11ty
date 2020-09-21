// const emblaOptions = { dragFree: false, align: "start" };
// const emblaHome = document.getElementById( 'home-carousel' );
// const emblaViewport = emblaHome.querySelector( '.embla__viewport' );
// let homeCarousel = {};

// console.log( emblaViewport );
// if( emblaViewport ) {
//   if( window.innerWidth < 768 ) {
//     homeCarousel = EmblaCarousel( emblaViewport, emblaOptions );
//   }
  
//   window.addEventListener( 'resize', homeCarouselHandler );
// }

// function homeCarouselHandler() {
//   if( window.innerWidth > 768 && homeCarousel ) {
//     homeCarousel.destroy();
//   } else if(window.innerWidth < 768 && homeCarousel ) {
//     homeCarousel.reInit( emblaOptions );
//   } else {
//     homeCarousel = EmblaCarousel( emblaViewport, emblaOptions );
//   }
// }