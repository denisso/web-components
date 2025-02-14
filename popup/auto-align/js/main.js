import List from './list.js';
import throttle from './throttle.js';
// instead of a List, you can use querySelectorAll()
const list = new List();
const duration = 5000;
const popupTemplate = document.getElementById('popup-template');
const texts = [
  'Lorem, ipsum dolor sit amet consectetur, adipisicing elit.',
  'Voluptatum mollitia dicta ab dolorem iure similique fugiat sapiente ullam dignissimos maxime quo alias ea quasi magni magnam facilis aspernatur, asperiores temporibus. Provident quis totam, maiores recusandae ut expedita eligendi dolor sed, tempora, quo asperiores nobis, vitae error? Suscipit nihil nesciunt aliquam in, enim!',
];
let textIndx = 0;

const verticalGap = 16;

const verticalAlignPopups = () => {
  if (!list.tail) return;

  requestAnimationFrame(() => {
    // First rAF: calculate tY 1 reflow
    list.tail.value.tY = 0;
    for (
      let node = list.tail.prev,
        prevHeight = list.tail.value.popup.getBoundingClientRect().height;
      node;
      node = node.prev
    ) {
      node.value.tY = -(
        Math.abs(node.next.value.tY) +
        prevHeight +
        verticalGap
      );
      prevHeight = node.value.popup.getBoundingClientRect().height;
    }

    // Second rAF: for paint и composite
    requestAnimationFrame(() => {
      for (let node = list.tail; node; node = node.prev) {
        node.value.popup.style.transform = `translate(0, ${node.value.tY}px)`;
      }
    });
  });
};

window.addEventListener(
  'resize',
  throttle(() => verticalAlignPopups())
);

const moveRight = [
  [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }],
  {
    id: 'moveRight',
    duration,
    easing: 'linear',
    fill: 'forwards',
  },
];
const animations = new Set();

class Popup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const fragment = popupTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(fragment);
    this.popup = this.shadowRoot.querySelector('.popup');
    this.node = list.append({ popup: this.popup, tY: 0 });
    this.onMouseEnter = () => this.ppAnimations(false);
    this.onMouseLeave = () => this.ppAnimations(true);
    this.onClick = () => {
      this.ppAnimations(true);
      this.finished = true;
      this.animationEndHandler();
    };
    this.onTransitionEnd = this.cleanAndAlign.bind(this);
    this.addEventListener('mouseenter', this.onMouseEnter);
    this.addEventListener('mouseleave', this.onMouseLeave);
    this.finished = false;
    this.shadowRoot
      .querySelector('.close')
      .addEventListener('click', this.onClick);
  }
  // p = true - play otherwise pause
  ppAnimations(p) {
    if (this.finished) return;
    animations.forEach((a) => {
      if (a.playState == 'finised') return;
      p ? a.play() : a.pause();
    });
  }

  cleanAndAlign() {
    this.removeEventListener('mouseenter', this.onMouseEnter);
    this.removeEventListener('mouseleave', this.onMouseLeave);
    this.popup.removeEventListener('transitionend', this.onTransitionEnd);
    this.animation.cancel();
    animations.delete(this.animation);
    this.animation = null;
    this.remove();
    verticalAlignPopups();
  }
  animationEndHandler() {
    this.popup.addEventListener('transitionend', this.onTransitionEnd);
    this.shadowRoot
      .querySelector('.close')
      .removeEventListener('click', this.onClick);
    this.popup.style.transform = `translate(100%, ${this.node.value.tY}px)`;
    list.remove(this.node);

    this.node = null;
  }
  show() {
    this.animation = this.shadowRoot
      .querySelector('.line')
      .animate(...moveRight);
    animations.add(this.animation);
    this.animation.addEventListener('finish', (e) => {
      if (e.target.id !== 'moveRight') return;
      this.animationEndHandler();
    });
    this.popup.style.transform = `translateX(0)`;
    verticalAlignPopups();
  }
}
customElements.define('popup-element', Popup);

const createPopup = () => {
  const popup = document.createElement('popup-element');
  if (textIndx == texts.length) textIndx = 0;
  popup.shadowRoot.querySelector('.content').innerHTML = texts[textIndx++];
  document.body.appendChild(popup);
  requestAnimationFrame(() => {
    popup.show();
  });
};

const btnCreatePopup = document.getElementById('btnCreatePopup');
btnCreatePopup.addEventListener('click', createPopup);
