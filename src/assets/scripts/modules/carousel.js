import EmblaCarousel from 'embla-carousel'
const emblaNode = document.getElementById('embla');

if(emblaNode) {
  const embla = EmblaCarousel(emblaNode, { dragFree: true, align: "start" })
}
