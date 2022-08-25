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
  textLeft: '',
  imgLeft: '',
  imgLeftLink: '',
  textCenter: '',
  imgCenter: '',
  imgCenterLink: '',
  textRight: '',
  imgRight: '',
  imgRightLink: '',
  configPath: '',
  alignVertical: 'center',
  toSelector: 'dd-slide',
  fromSelector: 'dd-slide-collection',
};

/*---------------------------------------------------------------------*/
/* Utils                                                               */
/*---------------------------------------------------------------------*/

async function getJsonConfig(url: string) {
  /* first check head to see if file exists (no need to fetch whole file if
   * when looping over multiple possible filepaths */
  const _checkFileExists = async (urlCheck: string) => {
    const response = await fetch(urlCheck, { method: 'HEAD' });
    if (response.status !== 404) {
      return true;
    }

    console.error(`JSON config does not exist at '${urlCheck}'`);
    return false;
  };

  const bFile = await _checkFileExists(url);

  if (bFile) {
    try {
      const response = await fetch(url);
      const json = await response.json();
      return json;
    } catch (err: any) {
      console.error(`Error while reading config file at ${url} \n\n ${err}`);
    }
  }

  return {
    error: 'Could not parse JSON config, see console for errors',
  };
}

/**
 * Main class for HTML web component **`dd-footer`**
 *
 * For **styling** this component, check out {@link DdFooter.styles |
 * the styles section}.
 *
 * <u>**Important note**</u>: all lit-component properties (interpreted here as
 * `other properties`) that are documented here have a **corresponding
 * HTML attribute**. The _non-attribute_ properties are consired private,
 * and are ingored in the documentation.
 *
 * The `dd-footer` element is rendered as a 1x3 grid (3 columns), where each
 * column has a nested flexbox that contains a HTML (~text) field and a
 * image field, both optional. It has the following structure:
 *
 * ```
 * | ft-img-left, ft-text-left | ft-img-center, ft-text-center | ft-text-right, ft-img-right |
 * ```
 *
 * (text fields accept HTML markup)
 *
 * @example
 * A simple footer
 *
 * ```html
 * <html>
 *   [...]
 *   <dd-footer text-left="<b>boldLeft</b>"
 *              img-left="logo.jpeg"
 *              text-center="center"
 *              text-right="right">
 *   </dd-footer>
 *   [...]
 * </html>
 * ```
 *
 * An interesting feature of `dd-footer` inside the `dd-component`
 * ecosystem, is that it can inherit relevant attributes from a HTML selector
 * with the {@link DdFooter.fromSelector | `from-selector` attribute}
 * (defaults to `dd-slide-collection`). For example to obtain a footer as in
 * by inheriting from the `dd-slide-collection` element:
 *
 * ```html
 * <html>
 *   [...]
 *   <dd-slide-collection main-title="MyTitle"
 *                        date="2022-07-12"
 *                        author="Senne Van Baelen"
 *                        organisation="Digital Dasein"
 *                        img-src="./assets/img/logo.jpeg"
 *                        ... (other attr)>
 *      <dd-footer></dd-footer>
 *      <!--
 *      which is the equivalent for:
 *      <dd-footer from-selector="dd-slide-collection"></dd-footer>
 *      -->
 *   </dd-slide-collection>
 *   [...]
 * </html>
 * ```
 *
 * Furthermore, say you want one specific footer on each slide or section, without
 * having to add the HTML element each time, you could assign a `to-selector`
 * attribute to the footer, which will render the footer in each element that
 * corresponds to the associated selector (defaults to `dd-slide`), and will
 * _not_ display the footer where you defined it.
 *
 */

export class DdFooter extends LitElement {
  /**
   *
   * To style the `dd-footer` component, use the following **CSS host
   * variables** (including their default values):
   *
   * |  <div style="width:200px">CSS variable</div>   | <div style="width:100px">Default</div>   | Description |
   * |:-----------------------------------------------|:-----------------------------------------|:------------|
   * |**`--dd-footer-height`**         |`30px`                           | height of the footer|
   * |**`--dd-footer-img-height`**     |`var(--dd-footer-height)`        | height of the footer image/logo |
   * |**`--dd-footer-padding-side`**   |`0px`                            | padding on both sides of the footer |
   * |**`--dd-footer-padding-bottom`** |`0px`                            | padding on the footer bottom |
   * |**`--dd-footer-padding-text`**   |`0 2px 0 2px`                    | padding on the footer text elements |
   * |**`--dd-footer-font-size`**      |`14px`                           | footer font-size |
   * |**`--dd-footer-bottom`**         |`var(--progress-height, 0em)`    | bottom margin on footer (defaults to height of progress bar, which if not available, is 0 |
   * |**`--dd-footer-color-bg`**       |`none`                           | background color of footer |
   *
   * The variables can be set anywhere in your HTML context (e.g. in `:root`,
   * up until the `dd-slide-collection` component itself).
   *
   */

  static styles = css`
    :host {
      --footer-height: var(--dd-footer-height, 30px);
      --footer-img-height: var(--dd-footer-img-height, var(--dd-footer-height));
      --footer-align-v: var(--dd-footer-align-v, center);
      --footer-align-flex-v: var(--dd-footer-align-flex-v, center);
      --footer-padding-side: var(--dd-footer-padding-side, 0px);
      --footer-padding-bottom: var(--dd-footer-padding-bottom, 0px);
      --footer-padding-text: var(--dd-footer-padding-text, 0 2px 0 2px);
      --footer-font-size: var(--dd-footer-font-size, 14px);
      --footer-bottom: var(--dd-footer-bottom, var(--progress-height));
      --footer-color-bg: var(--dd-footer-color-bg);
    }

    .footer-link {
      z-index: 10;
    }

    .dd-footer {
      width: 100%;
      position: absolute;
      padding-bottom: var(--footer-bottom);
      bottom: 0;
      left: 0;
      display: grid;
      grid-template-areas: 'left center right';
      grid-template-columns: 1fr auto 1fr;
      align-items: var(--footer-align-v);
      height: var(--footer-height);
      justify-content: space-between;
      z-index: 10;
      font-size: var(--footer-font-size);
      background-color: var(--footer-color-bg);
      line-height: normal;
    }

    .dd-footer-item {
      display: flex;
    }

    .dd-footer-left {
      grid-area: left;
      padding-left: var(--footer-padding-side);
      padding-bottom: var(--footer-padding-bottom);
      text-align: left;
      align-items: center;
    }

    .dd-footer-center {
      grid-area: center;
      padding-bottom: var(--footer-padding-bottom);
      text-align: center;
    }

    .dd-footer-right {
      grid-area: right;
      padding-bottom: var(--footer-padding-bottom);
      padding-right: var(--footer-padding-side);
      text-align: right;
      justify-content: flex-end;
    }

    .footer-text {
      align-self: var(--footer-align-flex-v);
      padding: var(--footer-padding-text);
    }

    img.footer-img {
      height: var(--footer-img-height, var(--footer-height));
      display: block;
    }
  `;

  /**
   * Footer text left (accepts HTML markup)
   *
   * **Corresponding attribute:** `text-left`
   *
   * **Default value:** `""` (empty string)
   */
  @property({ type: String, attribute: 'text-left' })
  textLeft = DEFAULT_ATTRIBUTES.textLeft;

  /**
   * Footer image source left
   *
   * **Corresponding attribute:** `img-left`
   *
   * **Default value:** `""` (empty string)
   */
  @property({ type: String, attribute: 'img-left' })
  imgLeft = DEFAULT_ATTRIBUTES.imgLeft;

  /**
   * Footer image hyperlink left
   *
   * **Corresponding attribute:** `img-left-link`
   *
   * **Default value:** `""` (empty string)
   */
  @property({ type: String, attribute: 'img-left-link' })
  imgLeftLink = DEFAULT_ATTRIBUTES.imgLeftLink;

  /**
   * Footer text center (accepts HTML markup)
   *
   * **Corresponding attribute:** `text-center`
   *
   * **Default value:** `""` (empty string)
   */
  @property({ type: String, attribute: 'text-center' })
  textCenter = DEFAULT_ATTRIBUTES.textCenter;

  /**
   * Footer image source center
   *
   * **Corresponding attribute:** `img-center`
   *
   * **Default value:** `""` (empty string)
   */
  @property({ type: String, attribute: 'img-center' })
  imgCenter = DEFAULT_ATTRIBUTES.imgCenter;

  /**
   * Footer image hyperlink center
   *
   * **Corresponding attribute:** `img-center-link`
   *
   * **Default value:** `""` (empty string)
   */
  @property({ type: String, attribute: 'img-center-link' })
  imgCenterLink = DEFAULT_ATTRIBUTES.imgCenterLink;

  /**
   * Footer text right (accepts HTML markup)
   *
   * **Corresponding attribute:** `text-right`
   *
   * **Default value:** `""` (empty string)
   */
  @property({ type: String, attribute: 'text-right' })
  textRight = DEFAULT_ATTRIBUTES.textRight;

  /**
   * Footer image source right
   *
   * **Corresponding attribute:** `img-right`
   *
   * **Default value:** `""` (empty string)
   */
  @property({ type: String, attribute: 'img-right' })
  imgRight = DEFAULT_ATTRIBUTES.imgRight;

  /**
   * Footer image hyperlink right
   *
   * **Corresponding attribute:** `img-right-link`
   *
   * **Default value:** `""` (empty string)
   */
  @property({ type: String, attribute: 'img-right-link' })
  imgRightLink = DEFAULT_ATTRIBUTES.imgRightLink;

  /**
   * Path to JSON config file (corresponding inline attributes will
   * **overwrite** attributes defined in JSON config
   *
   * **Corresponding attribute:** `config-path`
   *
   * **Default value:** `""` (empty string)
   */
  @property({ type: String, attribute: 'config-path' })
  configPath = DEFAULT_ATTRIBUTES.configPath;

  /**
   * Vertical alignment of footer content.
   * Choose from {center, top, bottom}
   *
   * **Corresponding attribute:** `align-v`
   *
   * **Default value:** `center`
   */
  @property({ type: String, attribute: 'align-v' })
  alignVertical = DEFAULT_ATTRIBUTES.alignVertical;

  /**
   * HTML selector on which you want to render (display) the footer.
   * Setting this value will automatically not display the footer where it is
   * defined (except when the footer also contains the `to-selector` element).
   *
   * **Corresponding attribute:** `to-selector`
   *
   * **Default value:** `dd-slide`
   */
  @property({ type: String, attribute: 'to-selector' })
  toSelector = DEFAULT_ATTRIBUTES.toSelector;

  /**
   * HTML selector from which you want to inherit relevant attributes.
   * Setting the same attributes on `dd-footer` itself will overwrite
   * potentially inherited values.
   *
   * **Corresponding attribute:** `from-selector`
   *
   * **Default value:** `dd-slide-collection`
   */
  @property({ type: String, attribute: 'from-selector' })
  fromSelector = DEFAULT_ATTRIBUTES.fromSelector;

  /* Make the footer of the page */
  makeFooter() {
    let displayImgLeft = 'none';
    let displayImgCenter = 'none';
    let displayImgRight = 'none';

    if (this.imgLeft) displayImgLeft = 'inline';
    if (this.imgCenter) displayImgCenter = 'inline';
    if (this.imgRight) displayImgRight = 'inline';

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

  async setPropsFromJson() {
    const jsonObj = await getJsonConfig(this.configPath);
    if (jsonObj.error)
      this.textCenter = `<i><b>[ERROR]</b>${jsonObj.error} </i>`;
    else {
      if (!this.textCenter) {
        if (jsonObj.title) this.textCenter = `<b>${jsonObj.title}</b>`;
        if (jsonObj.mainTitle) this.textCenter = `<b>${jsonObj.mainTitle}</b>`;
        // if ( jsonObj.subTitle )
        //  this.subTitle = jsonObj.subTitle
        if (jsonObj.author)
          this.textCenter += ` &ndash; <i>${jsonObj.author}</i>`;
        if (jsonObj.date) this.textCenter += ` &ndash; ${jsonObj.date}`;
      }
      // if ( jsonObj.url )
      //  this.url = jsonObj.url
      if (jsonObj.urlLogo && !this.imgLeftLink)
        this.imgLeftLink = jsonObj.urlLogo;
      if (jsonObj.imgSrc && !this.imgLeft) this.imgLeft = jsonObj.imgSrc;
      // if ( jsonObj.organisation )
      //  this.organisation = jsonObj.organisation
    }
  }

  setVerticalAlignment(elem: HTMLElement) {
    if (this.alignVertical === 'center') {
      elem.style.setProperty('--footer-align-v', 'center');
      elem.style.setProperty('--footer-align-flex-v', 'center');
    } else if (this.alignVertical === 'top') {
      elem.style.setProperty('--footer-align-v', 'start');
      elem.style.setProperty('--footer-align-flex-v', 'flex-start');
    } else if (this.alignVertical === 'bottom') {
      elem.style.setProperty('--footer-align-v', 'end');
      elem.style.setProperty('--footer-align-flex-v', 'flex-end');
    }
  }

  /* tricky to test DOMContentLoaded stuff */
  /* c8 ignore next 80 */
  private _injectIntoSelector = () => {
    // no injection if footer inside dd-slide
    if (this.parentElement?.nodeName === 'DD-SLIDE') return;
    if (this.parentElement?.nodeName === 'SECTION') return;

    const injectElements = document.querySelectorAll(this.toSelector);

    if (injectElements.length > 0) {
      this.style.display = 'none';
    } else return;

    for (const elem of injectElements) {
      if (elem.querySelector('dd-footer')) {
        // currenly do nothing
      } else {
        const newFooterElem = document.createElement('dd-footer');
        newFooterElem.setAttribute('text-left', this.textLeft);
        newFooterElem.setAttribute('img-left', this.imgLeft);
        newFooterElem.setAttribute('img-left-link', this.imgLeftLink);
        newFooterElem.setAttribute('text-center', this.textCenter);
        newFooterElem.setAttribute('img-center', this.imgCenter);
        newFooterElem.setAttribute('img-center-link', this.imgCenterLink);
        newFooterElem.setAttribute('text-right', this.textRight);
        newFooterElem.setAttribute('img-right', this.imgRight);
        newFooterElem.setAttribute('img-right-link', this.imgRightLink);
        newFooterElem.setAttribute('align-v', this.alignVertical);
        newFooterElem.setAttribute('config-path', this.configPath);
        newFooterElem.setAttribute('to-selector', '');
        newFooterElem.setAttribute('from-selector', '');

        this.setVerticalAlignment(newFooterElem);

        elem.append(newFooterElem);
      }
    }
  };

  private _injectFromSelector = () => {
    // no injection if footer inside dd-slide
    if (this.parentElement?.nodeName === 'DD-SLIDE') return;
    if (this.parentElement?.nodeName === 'SECTION') return;

    const injectFromElem = document.querySelector(this.fromSelector);

    if (!injectFromElem) return;

    // relevant dd-slide-collection attributes
    if (this.getAttribute('text-center') == null) {
      if (injectFromElem!.getAttribute('main-title'))
        this.textCenter = `<b>${injectFromElem!.getAttribute(
          'main-title'
        )}</b>`;

      if (injectFromElem!.getAttribute('author'))
        this.textCenter += ` &ndash; <i>${injectFromElem!.getAttribute(
          'author'
        )}</i>`;

      if (injectFromElem!.getAttribute('date'))
        this.textCenter += ` &ndash; ${injectFromElem!.getAttribute('date')}`;
    }

    if (
      injectFromElem!.getAttribute('url-logo') &&
      this.getAttribute('img-left-link') == null
    )
      this.imgLeftLink = injectFromElem!.getAttribute('url-logo') as string;

    if (
      injectFromElem!.getAttribute('img-src') &&
      this.getAttribute('img-left') == null
    )
      this.imgLeft = injectFromElem!.getAttribute('img-src') as string;
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('DOMContentLoaded', this._injectFromSelector);
    document.addEventListener('DOMContentLoaded', this._injectIntoSelector);
  }

  disconnectedCallback() {
    window.removeEventListener('DOMContentLoaded', this._injectIntoSelector);
    window.removeEventListener('DOMContentLoaded', this._injectFromSelector);
    super.disconnectedCallback();
  }

  render() {
    let htmlContent = '';

    this.setVerticalAlignment(this);

    if (this.configPath) this.setPropsFromJson();

    htmlContent += this.makeFooter();

    return html`${unsafeHTML(htmlContent)}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dd-footer': DdFooter;
  }
}
