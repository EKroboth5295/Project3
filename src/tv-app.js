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

      channels: { type: Object }
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
      }
      .right-item {
        grid-column: 2;
        width: 200px;
        margin-left: 110px;
        margin-top: 15px;
        text-align: center;
      }
      .listing {
        margin: 10px;
      }
      .slideclicker {
        display: flex;
        flex-direction: row;
        text-align: center;
        gap: 375px;
        margin-bottom: 20px;
      }
      .previous-slide {
        font-size: 20px;
        background-color: #eeeeee;
        width: 200px;
        height: 50px;
        padding-top: 22px;
      }
      .next-slide {
        font-size: 20px;
        background-color: #eeeeee;
        width: 200px;
        height: 50px;
        padding-top: 22px;
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
        <tv-channel title="MrBeast Youtube" presenter="MrBeast">
          Worlds Most Dangerous Escape Room!
        </tv-channel>
      </div>
      <div class="right-item">
        <h2>${this.name}</h2>
        ${
          this.listings.map(
            (item) => html`
              <tv-channel
                title="${item.title}"
                presenter="${item.metadata.author}"
                @click="${this.itemClick}"
                class="listing"
              >
              </tv-channel>
            `
          )
        }
      </div>
      <!-- dialog -->
      <sl-dialog label="Dialog" class="dialog">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Close</sl-button>
      </sl-dialog>
    </div>
    <div class="slideclicker">
      <div class = "previous-slide"> Previous Slide</div>
      <div class = "next-slide"> Next Slide</div>
    </div>

    `;
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    console.log(e.target);
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
