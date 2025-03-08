// ==UserScript==
// @name         ODUnspool
// @namespace    https://github.com/JarrettR/OverdriveUnspooler/
// @version      2025-01-06
// @description  try to take over the world!
// @author       Jarrett
// @match        https://*.listen.overdrive.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=overdrive.com
// @grant        GM_addStyle
// @grant unsafeWindow
// @sandbox JavaScript
// ==/UserScript==
/* global $, waitForKeyElements, BIF */
(function() {
    'use strict';

    if (!sessionStorage.getItem("SessionURLs")) {
      sessionStorage.setItem("SessionURLs", JSON.stringify([]));
    }
    // Inject script into the page's context
    const script = document.createElement('script');
  script.textContent = `
    (function () {
      // Wait for RequireJS to be available
      const checkRequire = setInterval(() => {
        if (typeof requirejs !== 'undefined') {
          clearInterval(checkRequire);



          // Access the specific module
          requirejs(['bifocal/themes/read/default/src/parts/audio-proxy-element'], function (elem) {
            try {
              //console.log(BIF.objects.compass.chapterManager.nextPlace(0));
              //console.log(BIF.objects.compass.at(0));
              //console.log(BIF.objects.compass.at(1));
              //console.log(BIF.objects.compass.at(2));

              // Hijack the seek() function
              const originalSeek = elem.prototype.seek;

              elem.prototype.seek = function (t, e) {
                console.log(t);
                console.log(e);
                let arr = JSON.parse(sessionStorage.getItem("SessionURLs"));
                arr.push(t);
                sessionStorage.setItem("SessionURLs", JSON.stringify(arr));

                //console.log(BIF.objects.compass.chapterManager.nextPlace(0.5884623671358805));
                //console.log(BIF.objects.compass);
                //console.log(this);

                //return originalSeek(t, e);
                return 0;
              };

              console.log("Successfully hijacked 'seek()' ");
            } catch (err) {
              console.error("Failed to hijack 'seek()':", err);
            }
          });
          requirejs(['bifocal/themes/listen/default/src/parts/spool'], function (elem) {
            try {
                console.log(elem);
                console.log(this);
                i = BIF.objects.compass.at(1);

                console.log(i);
                BIF.objects.spool.seekWithinBook(i.bookMilliseconds,0);
                i = BIF.objects.compass.at(2);
                BIF.objects.spool.seekWithinBook(i.bookMilliseconds,0);
            } catch (err) {
              console.error("Failed to 'seek()':", err);
            }
          });
        }
      }, 50);
    })();
  `;
    document.body.appendChild(script);

    function downloadButton (jNode) {
      var newNode = jNode.clone(true);
      var svg = "m 15,35.553711 c 0,-1.714315 1.343312,-3.104041 3.002358,-3.104041 h 6.998821 L 25.327644,9.5345085 38.869288,9.3997136 38.998821,32.44967 h 6.998821 C 47.655798,32.44967 49,33.837585 49,35.553711 v 2.255948 c 1e-5,1.65686 -1.34314,3.00001 -3,3.00001 -0.590802,0 -1.069742,-0.508539 -1.660501,-0.501451 -7.637541,0.09164 -11.896601,11.175845 -12.277481,11.180764 -0.314474,0.0041 -3.952531,-11.053179 -12.424836,-11.09988 -1.656838,-0.0091 -3.246892,0.511672 -4.151078,-0.876723 C 15.168879,39.025273 15,38.456498 15,37.875204 Z";

      var divClass = "<div class=\"nav-action-item\"><button class=\"halo\" type=\"button\"><svg viewBox=\"0 0 64 64\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" class=\"shibui-graphic icon\"> "
        + "<path d=\"" + svg + "\" stroke=\"#000000\" stroke-width=\"3\" fill=\"none\" class=\"icon-hollow\"></path> "
        + "</svg><div class=\"nav-action-item-label\"><span role=\"text\">Download</span></div></button></div>";

      var jDiv = $(divClass);
      jDiv.bind( "click", function() {
          console.log(JSON.parse(sessionStorage.getItem("SessionURLs")));
      });
      jDiv.insertAfter(jNode);
    }

  waitForKeyElements ("body > div.world > div.book-layer > div > nav > header > div.nav-action-bar > div > div.nav-action-bar-right > div:nth-child(4)", downloadButton);

})();
