import ScrollMagic from 'scrollmagic';

const SELECTORS = {
  trigger: '#map-trigger',
  spacer: 'spacer',
  pin: '#map-pin'
}

const CLASSES = {
  sceneToggle: 'map-z'
}

class ScrollPin {
  constructor() {
    this.controller = new ScrollMagic.Controller()
    
    if( window.innerWidth < 768 ) {
        this.scene = new ScrollMagic.Scene({ triggerElement: SELECTORS.trigger, triggerHook: 'onLeave' })
          .setClassToggle(SELECTORS.pin, CLASSES.sceneToggle)
          // .setPin(SELECTORS.pin, {spacerClass: SELECTORS.spacer});
        this.scene.addTo( this.controller );
      }

      window.addEventListener('resize', () => this.togglePin());
  }

  togglePin() {
    if( window.innerWidth > 768 ) {
      this.controller.destroy( this.scene );
    } else if(window.innerWidth < 768 ) {
      this.scene = new ScrollMagic.Scene({ triggerElement: SELECTORS.trigger, triggerHook: 'onLeave' })
        .setPin(SELECTORS.pin, {spacerClass: SELECTORS.spacer});
      this.scene.addTo( this.controller );
    }
  }
}

if(document.querySelector(SELECTORS.pin)) {
  new ScrollPin()
}