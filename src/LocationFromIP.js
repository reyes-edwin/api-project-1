// dependencies / things imported
import { LitElement, html, css } from 'lit';
import { UserIP } from './UserIP.js';

export class LocationFromIP extends LitElement {
  static get tag() {
    return 'location-from-ip';
  }

  // set the values to null.
  constructor() {
    super();
    this.locationEndpoint = 'https://freegeoip.app/json/';
    this.long = null;
    this.lat = null;
  }

  static get properties() {
    return {
      long: { type: Number },
      lat: { type: Number },
    };
  }

  // This was a little confusing.
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getGEOIPData();
  }

  // can you go more in details with async?
  async getGEOIPData() {
    const IPClass = new UserIP();
    // don't know what await means. Does it mean it's waiting for the IP address
    const userIPData = await IPClass.updateUserIP();
    return fetch(this.locationEndpoint + userIPData.ip)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        console.log(data);
        this.lat = data.latitude;
        this.long = data.longitude;
        return data;
      });
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        iframe {
          height: 500px;
          width: 500px;
        }
      `,
    ];
  }

  render() {
    // this function runs every time a properties() declared variable changes
    // this means you can make new variables and then bind them this way if you like
    const url = `https://maps.google.com/maps?q=${this.lat},${this.long}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    return html`<iframe title="Where you are" src="${url}"></iframe>
      <br />
      <input @input=${this.changeLat} .value="${this.lat}" />
      <input @input=${this.changeLong} .value="${this.long}" />
      <button @click=${this.resetCoordinates}>Reset</button>`;
  }

  resetCoordinates() {
    this.getGEOIPData();
  }

  changeLat(event) {
    const input = event.target;
    this.lat = input.value;
  }

  changeLong(event) {
    const input = event.target;
    this.long = input.value;
  }
}

customElements.define(LocationFromIP.tag, LocationFromIP);
