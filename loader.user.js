// ==UserScript==
// @name        fuyuakeJump
// @author      mtcode
// @include     http*://bgm.tv/*
// @include     http*://bangumi.tv/*
// @include     http*://chii.in/*
// ==/UserScript==

(async function () {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = 'https://cdn.jsdelivr.net/gh/koorinyaa/fuyuake@master/userscript.user.js'
  script.async = true
  document.body.appendChild(script)
})()