// SPDX-FileCopyrightText: 2022 Digital Dasein <https://digital-dasein.gitlab.io/>
// SPDX-FileCopyrightText: 2022 Gerben Peeters <gerben@digitaldasein.org>
// SPDX-FileCopyrightText: 2022 Senne Van Baelen <senne@digitaldasein.org>
//
// SPDX-License-Identifier: MIT

import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

/*---------------------------------------------------------------------*/
/* Config                                                              */
/*---------------------------------------------------------------------*/

const DEFAULT_ATTRIBUTES = {
  "textLeft" : "",
  "imgLeft" : "",
  "imgLeftLink" : "",
  "textCenter" : "",
  "imgCenter" : "",
  "imgCenterLink" : "",
  "textRight" : "",
  "imgRight" : "",
  "imgRightLink" : "",
  "configPath" : "",
  "alignVertical": "center",
  "toSelector" : "dd-slide",
  "fromSelector" : "dd-slide-collection",
}


/*---------------------------------------------------------------------*/
/* Utils                                                               */
/*---------------------------------------------------------------------*/

async function getJsonConfig (url:string)  {
  /* first check head to see if file exists (no need to fetch whole file if
   * when looping over multiple possible filepaths */
  const _checkFileExists = async (urlCheck:string) => {
    const response = await fetch(urlCheck, { method: "HEAD" });
    if ( response.status !== 404 ) {
      return true;
    }

    console.error(`JSON config does not exist at '${urlCheck}'`);
    return false;
  }

  const bFile = await _checkFileExists(url);

  if ( bFile ) {
    try {
      const response = await fetch(url);
      const json = await response.json();
      return json;
    }
    catch (err: any){
      console.error(`Error while reading config file at ${url} \n\n ${err}`)
    }
  }

  return {
    "error": "Could not parse JSON config, see console for errors"
  };
}


export class DdFooter extends LitElement {
  static styles = css`

    :host {
      --footer-height: var(--dd-footer-height, 40px);
      --footer-img-height: var(--dd-footer-img-height, var(--dd-footer-height));
      --footer-align-v: var(--dd-footer-align-v, center);
      --footer-align-flex-v: var(--dd-footer-align-flex-v, center);
      --footer-padding-side: var(--dd-footer-padding-side, 0px);
      --footer-padding-bottom: var(--dd-footer-padding-bottom, 0px);
      --footer-padding-text: var(--dd-footer-padding-text, 0 2px 0 2px);
      --footer-font-size: var(--dd-footer-font-size, 16px);
      --footer-bottom: var(--dd-footer-bottom, var(--progress-size));
      --footer-bg-color: var(--dd-footer-bg-color);
    }

    .footer-link {
      z-index:10;
    }

    .dd-footer {
      width: 100%;
      position: absolute;
      padding-bottom: var(--footer-bottom);
      bottom:0;
      left:0;
      display: grid;
      grid-template-areas:
        "left center right";
      grid-template-columns: 1fr auto 1fr;
      align-items:var(--footer-align-v);
      height: var(--footer-height);
      justify-content: space-between;
      z-index:10;
      font-size: var(--footer-font-size);
      background-color:var(--footer-bg-color);
    }

    .dd-footer-item {
      display:flex;
    }

    .dd-footer-left {
      grid-area: left;
      padding-left: var(--footer-padding-side);
      padding-bottom: var(--footer-padding-bottom);
      text-align:left;
      align-items:center;
    }

    .dd-footer-center {
      grid-area: center;
      padding-bottom: var(--footer-padding-bottom);
      text-align:center;
    }

    .dd-footer-right {
      grid-area: right;
      padding-bottom: var(--footer-padding-bottom);
      padding-right: var(--footer-padding-side);
      text-align:right;
      justify-content:flex-end;
    }

    .footer-text {
      align-self:var(--footer-align-flex-v);
      padding:var(--footer-padding-text);
    }

    img.footer-img {
      height: var(--footer-img-height, var(--footer-height));
      display:block;
    }
  `;

  @property( {type:String, attribute: 'text-left' })
  textLeft = DEFAULT_ATTRIBUTES.textLeft;

  @property( {type:String, attribute: 'img-left' })
  imgLeft = DEFAULT_ATTRIBUTES.imgLeft;

  @property( {type:String, attribute: 'img-left-link' })
  imgLeftLink = DEFAULT_ATTRIBUTES.imgLeftLink;

  @property( {type:String, attribute: 'text-center' })
  textCenter = DEFAULT_ATTRIBUTES.textCenter;

  @property( {type:String, attribute: 'img-center' })
  imgCenter = DEFAULT_ATTRIBUTES.imgCenter;

  @property( {type:String, attribute: 'img-center-link' })
  imgCenterLink = DEFAULT_ATTRIBUTES.imgCenterLink;

  @property( {type:String, attribute: 'text-right' })
  textRight = DEFAULT_ATTRIBUTES.textRight;

  @property( {type:String, attribute: 'img-right' })
  imgRight = DEFAULT_ATTRIBUTES.imgRight;

  @property( {type:String, attribute: 'img-right-link' })
  imgRightLink = DEFAULT_ATTRIBUTES.imgRightLink;

  @property( {type:String, attribute: 'config-path' })
  configPath = DEFAULT_ATTRIBUTES.configPath;

  @property( {type:String, attribute: 'align-v' })
  alignVertical = DEFAULT_ATTRIBUTES.alignVertical;

  @property( {type:String, attribute: 'to-selector' })
  toSelector = DEFAULT_ATTRIBUTES.toSelector;

  @property( {type:String, attribute: 'from-selector' })
  fromSelector = DEFAULT_ATTRIBUTES.fromSelector;


  /* Make the footer of the page */
  makeFooter(){
    let displayImgLeft = "none";
    let displayImgCenter = "none";
    let displayImgRight = "none";

    if ( this.imgLeft )
      displayImgLeft = "inline";
    if ( this.imgCenter )
      displayImgCenter = "inline";
    if ( this.imgRight )
      displayImgRight = "inline";

    return `
      <div class="dd-footer">
        <div class="dd-footer-item dd-footer-left">
            <a class="footer-link" style="display:${displayImgLeft};"
                                   href="${this.imgLeftLink}"
                                   target="_blank">
              <img class="footer-img footer-img-left"  src="${this.imgLeft}" alt="imgLeft"></a>
            <div class="footer-text" style="display:inline-block;">${this.textLeft}</div>
        </div>

        <div class="dd-footer-item dd-footer-center">
            <a class="footer-link" style="display:${displayImgCenter};"
                                   href="${this.imgCenterLink}"
                                   target="_blank">
              <img class="footer-img" footer-img-center" src="${this.imgCenter}" alt="imgCenter">
            </a>
            <div class="footer-text" style="display:inline-block;">${this.textCenter}</div>
        </div>

        <div class="dd-footer-item dd-footer-right">
            <div class="footer-text" style="display:inline-block;">${this.textRight}</div>
            <a class="footer-link" style="display:${displayImgRight};"
                                   href="${this.imgRightLink}"
                                   target="_blank">
              <img class="footer-img footer-img-right" src="${this.imgRight}" alt="imgRight">
            </a>
        </div>

      </div>
    `;
  }

  async setPropsFromJson(){
    const jsonObj = await getJsonConfig(this.configPath);
    if ( jsonObj.error )
        this.textCenter = `<i><b>[ERROR]</b>${jsonObj.error} </i>`;
    else {
      if ( !this.textCenter ){
        if ( jsonObj.title )
          this.textCenter = `<b>${jsonObj.title}</b>`;
        if ( jsonObj.mainTitle )
          this.textCenter = `<b>${jsonObj.mainTitle}</b>`;
        // if ( jsonObj.subTitle )
        //  this.subTitle = jsonObj.subTitle
        if ( jsonObj.author )
          this.textCenter += ` &ndash; <i>${jsonObj.author}</i>`;
        if ( jsonObj.date )
          this.textCenter += ` &ndash; ${jsonObj.date}`;
      }
      // if ( jsonObj.url )
      //  this.url = jsonObj.url
      if ( jsonObj.urlLogo && !this.imgLeftLink )
        this.imgLeftLink = jsonObj.urlLogo
      if ( jsonObj.imgSrc && !this.imgLeft )
        this.imgLeft = jsonObj.imgSrc
      // if ( jsonObj.organisation )
      //  this.organisation = jsonObj.organisation
    }
  }

  setVerticalAlignment(elem:HTMLElement){
    if ( this.alignVertical === "center" ){
      elem.style.setProperty('--footer-align-v', 'center');
      elem.style.setProperty('--footer-align-flex-v', 'center');
    }
    else if ( this.alignVertical === "top" ){
      elem.style.setProperty('--footer-align-v', 'start');
      elem.style.setProperty('--footer-align-flex-v', 'flex-start');
    }
    else if ( this.alignVertical === "bottom" ){
      elem.style.setProperty('--footer-align-v', 'end');
      elem.style.setProperty('--footer-align-flex-v', 'flex-end');
    }
  }

  /* tricky to test DOMContentLoaded stuff */
  /* c8 ignore next 75 */
  private _injectIntoSelector = () => {
    const injectElements = document.querySelectorAll(this.toSelector);

    if ( injectElements.length > 0 ){
      this.style.display = "none";
    } else return;

    for ( const elem of injectElements ) {
      const newFooterElem = document.createElement('dd-footer');
      newFooterElem.setAttribute("text-left", this.textLeft);
      newFooterElem.setAttribute("img-left", this.imgLeft);
      newFooterElem.setAttribute("img-left-link", this.imgLeftLink);
      newFooterElem.setAttribute("text-center", this.textCenter);
      newFooterElem.setAttribute("img-center", this.imgCenter);
      newFooterElem.setAttribute("img-center-link", this.imgCenterLink);
      newFooterElem.setAttribute("text-right", this.textRight);
      newFooterElem.setAttribute("img-right", this.imgRight);
      newFooterElem.setAttribute("img-right-link", this.imgRightLink);
      newFooterElem.setAttribute("align-v", this.alignVertical);
      newFooterElem.setAttribute("config-path", this.configPath);
      newFooterElem.setAttribute("to-selector", "");
      newFooterElem.setAttribute("from-selector", "");

      this.setVerticalAlignment(newFooterElem);

      elem.append(newFooterElem);
    };
  }

  private _injectFromSelector = () => {
    const injectFromElem = document.querySelector(this.fromSelector);

    if ( !injectFromElem )
      return

    // relevant dd-slide-collection attributes
    if ( injectFromElem!.getAttribute('main-title') )
      this.textCenter = `<b>${injectFromElem!.getAttribute('main-title')}</b>`;

    if ( injectFromElem!.getAttribute('author') )
      this.textCenter += ` &ndash; <i>${injectFromElem!.getAttribute('author')}</i>`;

    if ( injectFromElem!.getAttribute('date') )
      this.textCenter += ` &ndash; ${injectFromElem!.getAttribute('date') }`;

    if ( injectFromElem!.getAttribute('url-logo') )
      this.imgLeftLink = injectFromElem!.getAttribute('url-logo') as string;

    if ( injectFromElem!.getAttribute('img-src') )
      this.imgLeft = injectFromElem!.getAttribute('img-src') as string;

    // additional options (with priority)
    if ( injectFromElem!.getAttribute('footer-text-left') )
      this.textLeft = injectFromElem!.getAttribute('footer-text-left') as string;
    if ( injectFromElem!.getAttribute('footer-img-left') )
      this.imgLeft = injectFromElem!.getAttribute('footer-img-left') as string;
    if ( injectFromElem!.getAttribute('footer-img-left-link') )
      this.imgLeftLink = injectFromElem!.getAttribute('footer-img-left-link') as string;
    if ( injectFromElem!.getAttribute('footer-text-center') )
      this.textCenter = injectFromElem!.getAttribute('footer-text-center') as string;
    if ( injectFromElem!.getAttribute('footer-img-center') )
      this.imgCenter = injectFromElem!.getAttribute('footer-img-center') as string;
    if ( injectFromElem!.getAttribute('footer-img-center-link') )
      this.imgCenterLink = injectFromElem!.getAttribute('footer-img-center-link') as string;
    if ( injectFromElem!.getAttribute('footer-text-right') )
      this.textRight = injectFromElem!.getAttribute('footer-text-right') as string;
    if ( injectFromElem!.getAttribute('footer-img-right') )
      this.imgRight = injectFromElem!.getAttribute('footer-img-right') as string;
    if ( injectFromElem!.getAttribute('footer-img-right-link') )
      this.imgRightLink = injectFromElem!.getAttribute('footer-img-right-link') as string;
    if ( injectFromElem!.getAttribute('footer-align-v') )
      this.alignVertical = injectFromElem!.getAttribute('footer-align-v') as string;
  }


  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("DOMContentLoaded", this._injectFromSelector );
    document.addEventListener("DOMContentLoaded", this._injectIntoSelector );
  }

  disconnectedCallback() {
    window.removeEventListener('DOMContentLoaded', this._injectIntoSelector);
    window.removeEventListener('DOMContentLoaded', this._injectFromSelector);
    super.disconnectedCallback();
  }

  render( ) {

    let htmlContent = "";

    this.setVerticalAlignment(this);

    if ( this.configPath )
      this.setPropsFromJson();

    htmlContent += this.makeFooter();

    return html`${unsafeHTML(htmlContent)}`;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    "dd-footer": DdFooter,
  }
}
