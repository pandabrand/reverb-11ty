import ScrollMagic from 'scrollmagic';

const SELECTORS = {
  trigger: '#map-trigger',
  spacer: '.spacer',
  pin: '#map-pin'
}

class ScrollPin {
  constructor() {
    this.controller = new ScrollMagic.Controller()
    this.scene = new ScrollMagic.Scene({ triggerElement: SELECTORS.trigger, triggerHook: 'onLeave' })
      .setPin(SELECTORS.pin, {spacerClass: SELECTORS.spacer})
      .addTo(this.controller);
      console.log(this.scene);
  }
}

if(document.querySelector(SELECTORS.pin).length > 0) {
  new ScrollPin()
}