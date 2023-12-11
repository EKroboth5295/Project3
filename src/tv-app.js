// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./tv-channel.js";
import "@lrnwebcomponents/video-player/video-player.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.activeIndex = 0;
  }

  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeIndex: { type: Number },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
      }

      .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .left-item {
        grid-column: 1;
        margin-top: 50px;
        width: 775px;
      }
      .right-item {
        grid-column: 2;
        width: 250px;
        margin-left: 20px;
        margin-top: 50px;
        text-align: center;
        height: 492px;
        overflow-y: auto;
        padding: 10px;
        -webkit-overflow-scrolling: touch;
      }
      tv-channel {
        margin: 10px;
      }
      .slideclicker {
        display: flex;
        flex-direction: row;
        gap: 375px;
        margin-bottom: 20px;
      }
      .previous-slide {
        display: inline-block;
        font-size: 20px;
        width: 200px;
        height: 50px;
      }
      .next-slide {
        display: inline-block;
        font-size: 20px;
        width: 200px;
        height: 50px;
      }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
    <div class="container">
      <div class="grid-item">
        <div class="left-item">
          <video-player source="https://www.youtube.com/watch?v=3jS_yEK8qVI" accent-color="orange" dark track="https://haxtheweb.org/files/HAXshort.vtt"></video-player>
        </div>
        <tv-channel title="World's Most Dangerous Escape Room!" presenter="${this.listings.length > 0 ? this.listings[this.activeIndex].title : ''}">
          ${this.listings.length > 0 ? this.listings[this.activeIndex].description : ''}
        </tv-channel>
      </div>
      <div class="right-item">
        <h2>${this.name}</h2>
        ${
          this.listings.map(
            (item, index) => html`
              <tv-channel
                title="${item.title}"
                ?active="${index === this.activeIndex}"
                presenter="${item.metadata.author}"
                @click="${this.itemClick}"
                timecode="${item.metadata.timecode}"
                minutes="${item.metadata.minutes}"
                image="${item.metadata.image}"
                index="${index}"
              >
              </tv-channel>
            `
          )
        }
      </div>
      <!-- dialog -->
      <div class="slideclicker">
        <button class="previous-slide" @click="${this.prevSlide}">Previous Slide</button>
        <button class="next-slide" @click="${this.nextSlide}">Next Slide</button>
      </div>
    </div>
    `;
  }

  itemClick(e) {
    console.log(e.target);
    this.activeIndex= e.target.index;
    
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play();
   
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateListings(this[propName]);
      }

      if(propName === "activeIndex"){
        console.log(this.shadowRoot.querySelectorAll("tv-channel"));
        console.log(this.activeIndex)

        var activeChannel = this.shadowRoot.querySelector("tv-channel[index = '" + this.activeIndex + "' ] ");
       
        console.log(activeChannel);
        this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(activeChannel.timecode);
      }
      
    });
  }

  prevSlide() {
    this.activeIndex = Math.max(0, this.activeIndex - 1);
    
  }

  nextSlide() {
    this.activeIndex = Math.min(this.listings.length - 1, this.activeIndex + 1);  

  }


  connectedCallback() {
    super.connectedCallback();
    
    setInterval(() => {
      const currentTime = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').media.currentTime;
      if (this.activeIndex + 1 < this.listings.length &&
          currentTime >= this.listings[this.activeIndex + 1].metadata.timecode) {
        this.activeIndex++;
      }
    }, 1000);
  }

  async updateListings(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
      }
    });
  }
}

// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
