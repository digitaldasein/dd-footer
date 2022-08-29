// SPDX-FileCopyrightText: 2022 Digital Dasein <https://digitaldasein.org/>
// SPDX-FileCopyrightText: 2022 Gerben Peeters <gerben@digitaldasein.org>
// SPDX-FileCopyrightText: 2022 Senne Van Baelen <senne@digitaldasein.org>
//
// SPDX-License-Identifier: MIT

import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { DdFooter } from '../src/DdFooter.js';
import '../src/dd-footer.js';

/*---------------------------------------------------------------------*/
/* Config                                                              */
/*---------------------------------------------------------------------*/

/*---------------------------------------------------------------------*/
/* Utils                                                               */
/*---------------------------------------------------------------------*/

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*---------------------------------------------------------------------*/
/* Test                                                                */
/*---------------------------------------------------------------------*/

describe('DdFooter', () => {
  it('set properties', async () => {
    const el = await fixture<DdFooter>(html` <dd-footer
      text-left="left"
      img-left="test/logo.jpeg"
      text-center="center"
      img-center="test/logo.jpeg"
      text-right="right"
      img-right="test/logo.jpeg"
      align-v="bottom"
    >
    </dd-footer>`);
    expect(el.textLeft).to.equal('left');
    expect(el.textCenter).to.equal('center');
    expect(el.textRight).to.equal('right');
  });

  it('Get config from JSON file', async () => {
    const response = await fetch('./test/config.json');
    const jsonConfig = await response.json();

    const el = await fixture<DdFooter>(html`
      <dd-footer config-path="/test/config.json"></dd-footer>
    `);

    // wait to make sure data is fetched
    await timeout(100);
    const footerTitle = el.shadowRoot!.querySelector(
      '.dd-footer-center .footer-text'
    )!.innerHTML;
    expect(footerTitle).to.include(jsonConfig.title);
  });

  it('Return error (as textCenter) if JSON file does not exist', async () => {
    const el = await fixture<DdFooter>(html`
      <dd-footer config-path="/test/nonconfig.json"></dd-footer>
    `);

    // wait to make sure data is fetched
    await timeout(100);
    const footerTitle = el.shadowRoot!.querySelector(
      '.dd-footer-center > .footer-text'
    )!.innerHTML;
    expect(footerTitle).to.include('ERROR');
  });

  it('Return error (as textCenter) if JSON cannot be parsed', async () => {
    const el = await fixture<DdFooter>(html`
      <dd-footer config-path="/test/wrongconfig.json"></dd-footer>
    `);
    // wait to make sure data is fetched
    await timeout(100);
    const footerTitle = el.shadowRoot!.querySelector(
      '.dd-footer-center > .footer-text'
    )!.innerHTML;
    expect(footerTitle).to.include('ERROR');
  });

  it('Inject content from selector', async () => {
    const el = await fixture<DdFooter>(html`
      <div
        class="my-parent-class"
        footer-text-left="leftText"
        footer-text-center="leftCenter"
        footer-text-right="leftRight"
        footer-img-left="test/logo.jpeg"
        footer-img-center="test/logo.jpeg"
        footer-img-right="test/logo.jpeg"
        footer-img-left-link="http://test.org"
        footer-img-right-link="http://test.org"
        footer-img-center-link="http://test.org"
        footer-align-v="top"
        title="title"
        author="author"
        date="date"
        url-logo="http://url.org"
        img-src="test/logo.jpeg"
      >
        <dd-footer from-selector=".my-parent-class"></dd-footer>
      </div>
    `);

    // not sure how to assert this one, as it seems tricky to get injected DOM
    // this merely covers the functions and branches without any assertion
  });

  it('Align top', async () => {
    await fixture<DdFooter>(html`
      <dd-footer align-v="top" text-left="leftText"></dd-footer>
    `);
  });

  /*
  it('Copy footer content to selector', async () => {
    const parentNode = document.createElement('div');
    parentNode.innerHTML = `
      <div>
        <section class=".slide">
            <h2>Slide 1</h2>
        </section>
        <section class=".slide">
            <h2>Slide 2</h2>
        </section>
      </div>
    `;
    const el = await fixture<DdFooter>(html`
        <dd-footer align-v="top" text-left="leftText" to-selector="section"></dd-footer>
    `, { parentNode });

    // not sure how to assert this one, as it seems tricky to get injected DOM
    // this merely covers the functions and branches without any assertion
  });
  */

  it('passes the a11y audit', async () => {
    const el = await fixture<DdFooter>(html`<dd-footer></dd-footer>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
