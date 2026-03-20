// ==UserScript==
// @name        fuyuakeJump
// @author      mtcode
// @include     http*://bgm.tv/*
// @include     http*://bangumi.tv/*
// @include     http*://chii.in/*
// ==/UserScript==
(function () {
  "use strict";

  // 后台更新缓存
  fetch("https://cdn.jsdelivr.net/gh/koorinyaa/fuyuake@master/userscript.user.js", {
    cache: "reload"
  }).catch(() => {});

  const pathName = window.location.pathname;

  const launchObserver = ({
    parentNode,
    selector,
    failCallback = null,
    successCallback = null,
    stopWhenSuccess = true,
    config = { childList: true, subtree: true },
  }) => {
    if (!parentNode) return;
    const observeFunc = (mutationList) => {
      if (!document.querySelector(selector)) {
        if (failCallback) failCallback();
        return;
      }
      if (stopWhenSuccess) observer.disconnect();

      // 提供筛选变动节点并返回符合条件的元素数组的功能
      mutationList.itemFilter = (fn, type = "addedNodes") =>
        mutationList
          .map((i) => Array.from(i[type]).filter(fn))
          .reduce((arr, val) => arr.concat(val), []);

      if (successCallback) successCallback(mutationList);
    };
    const observer = new MutationObserver(observeFunc);
    observer.observe(parentNode, config);
  };

  if (pathName.startsWith("/rakuen/home")) {
    launchObserver({
      parentNode: document.body,
      selector: "#tg-rakuen-home-user-card #tg-rakuen-home-user-actions",
      successCallback: () => {
        $("#tg-rakuen-home-user-card #tg-rakuen-home-user-actions").append(
          `<button id="fuyuake-bot" class="whitespace-nowrap font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 text-xs rounded-md bgm-bg text-white font-semibold shadow-sm hover:opacity-90 ">bot授权</button>`,
        );
        $("#fuyuake-bot").on("click", function () {
          let cookie = "";
          $.ajax({
            url: `https://tinygrail.com/api/event/share/bonus/test/-1`,
            type: "POST",
            async: false,
            xhrFields: {
              withCredentials: true,
            },
            error: (xhr) => {
              const responseText = xhr.responseText;
              cookie = responseText.substring(
                responseText.indexOf(".AspNetCore.Identity.Application=") + 33,
                responseText.indexOf("Origin:"),
              );
              let r = confirm(
                "是否同意将小圣杯操作权限授权给fuyuake，每次小圣杯退出登录或重新登录都会使授权失效",
              );
              if (r === true) {
                window.open(`https://fuyuake.top/xsb/bot?token=${cookie}`);
              }
            },
          });
        });
      },
    });
  }

  if (
    pathName.startsWith("/rakuen/home") ||
    pathName.startsWith("/rakuen/topic/crt/") ||
    pathName.startsWith("/character")
  ) {
    launchObserver({
      parentNode: document.body,
      stopWhenSuccess: false,
      selector:
        "#tg-character-box #tg-trade-box #tg-trade-box-header #tg-trade-box-header-actions",
      successCallback: () => {
        const $target = $(
          "#tg-character-box #tg-trade-box #tg-trade-box-header #tg-trade-box-header-actions",
        );
        // 检查按钮是否已存在，避免重复添加
        if ($target.find("#fuyuake-chara").length === 0) {
          $target.append(
            `<button id="fuyuake-chara" class="whitespace-nowrap font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 text-xs rounded-md bgm-bg text-white font-semibold shadow-sm hover:opacity-90 ">FUYUAKE</button>`,
          );

          // 绑定点击事件
          $("#fuyuake-chara").on("click", function () {
            const charaId = $(this)
              .closest("#tg-trade-box")
              .attr("data-character-id");
            if (charaId) {
              window.open(`https://fuyuake.top/xsb/chara/${charaId}`);
            } else {
              alert("未找到角色ID");
            }
          });
        }
      },
    });
  }

  if (pathName.startsWith("/rakuen/home") || pathName.startsWith("/user")) {
    launchObserver({
      parentNode: document.body,
      stopWhenSuccess: false,
      selector:
        "#tg-user-tinygrail #tg-user-tinygrail-header #tg-user-tinygrail-actions",
      successCallback: () => {
        const $target = $(
          "#tg-user-tinygrail #tg-user-tinygrail-header #tg-user-tinygrail-actions",
        );
        // 检查按钮是否已存在，避免重复添加
        if ($target.find("#fuyuake-user").length === 0) {
          $target.append(
            `<button id="fuyuake-user" class="whitespace-nowrap font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 text-xs rounded-md bgm-bg text-white font-semibold shadow-sm hover:opacity-90 ">FUYUAKE</button>`,
          );

          // 绑定点击事件
          $("#fuyuake-user").on("click", function () {
            const username = $(this)
              .closest("#tg-user-tinygrail")
              .attr("data-username");
            if (username) {
              window.open(`https://fuyuake.top/xsb/user/${username}`);
            } else {
              alert("未找到用户名");
            }
          });
        }
      },
    });
  }
})();
