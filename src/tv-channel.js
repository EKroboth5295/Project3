// import stuff
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = '';
    this.video = '';
    this.timecode = 0;
    this.presenter = '';
    this.image = '';
    this.description = '';
    this.minutes = '';
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      video: { type: String },
      timecode: { type: Number },
      presenter: { type: String },
      image: { type: String },
      description: { type: String },
      index: { type: Number },
      active: { type: Boolean, reflect: true },
      minutes: { type: String }
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host([active]) {
        color: red;
        background-color: red;
      }
      :host {
        display: block;
        padding: 10px;
        background-color: #EEEE;
        transition: background-color ease;
      }
      .wrapper {
        padding: 13px;
        background-color: #eeeeee;
        background-size: cover;
      }
    `;
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper" style="background-image:url(${this.image});">
        <h3>${this.title}</h3>
        <h3>${this.video}</h3>
        <h4>${this.presenter}</h4>
        <h4>${this.minutes}</h4>
        <slot></slot>
      </div>
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
