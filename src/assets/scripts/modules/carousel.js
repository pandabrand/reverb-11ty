import EmblaCarousel from 'embla-carousel'
const emblaNode = document.getElementById('embla');
const emblaOptions = { dragFree: false, align: "start", slidesToScroll: 1 };
const emblaHome = document.getElementById( 'home-carousel' );
const emblaViewport = emblaHome.querySelector( '.embla__viewport' );
let homeCarousel = {};

if(emblaNode) {
  const embla = EmblaCarousel(emblaNode, emblaOptions )
}

if( emblaViewport ) {
  if( window.innerWidth < 768 ) {
    homeCarousel = EmblaCarousel( emblaViewport, emblaOptions );
    const prevBtn = emblaHome.querySelector(".embla__button--prev");
    const nextBtn = emblaHome.querySelector(".embla__button--next");
    const disablePrevAndNextBtns = disablePrevNextBtns( prevBtn, nextBtn, homeCarousel );
    setupPrevNextBtns(prevBtn, nextBtn, homeCarousel);

    homeCarousel.on('select', disablePrevAndNextBtns);
    homeCarousel.on('init', disablePrevAndNextBtns);
  }
  
  window.addEventListener( 'resize', homeCarouselHandler );
}

function homeCarouselHandler() {
  if( window.innerWidth > 768 && homeCarousel ) {
    homeCarousel.destroy();
  } else if(window.innerWidth < 768 && homeCarousel ) {
    homeCarousel.reInit( emblaOptions );
  } else {
    homeCarousel = EmblaCarousel( emblaHome, emblaOptions );
  }
}

function setupPrevNextBtns(prevBtn, nextBtn, embla) {
  prevBtn.addEventListener('click', embla.scrollPrev, false);
  nextBtn.addEventListener('click', embla.scrollNext, false);
};

function disablePrevNextBtns(prevBtn, nextBtn, embla) {
  return () => {
    if (embla.canScrollPrev()) prevBtn.removeAttribute('disabled');
    else prevBtn.setAttribute('disabled', 'disabled');

    if (embla.canScrollNext()) nextBtn.removeAttribute('disabled');
    else nextBtn.setAttribute('disabled', 'disabled');
  };
};
