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
  fetch(
    "https://cdn.jsdelivr.net/gh/koorinyaa/fuyuake@master/userscript.user.js",
    {
      cache: "reload",
    },
  ).catch(() => {});

  const pathName = window.location.pathname;

  // 按钮样式常量
  const BUTTON_CLASS =
    "whitespace-nowrap font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 text-xs rounded-md bgm-bg text-white font-semibold shadow-sm hover:opacity-90";

  // 工具函数：等待元素出现并执行回调
  const waitForElement = (selector, callback, continuous = false) => {
    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        callback(elements);
        if (!continuous) observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 如果元素已存在，立即执行
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      callback(elements);
      if (!continuous) observer.disconnect();
    }
  };

  // 工具函数：添加按钮（防重复）
  const addButton = (containerSelector, buttonId, buttonText, onClick) => {
    const $container = $(containerSelector);
    if ($container.find(`#${buttonId}`).length > 0) return;

    const $button = $(
      `<button id="${buttonId}" class="${BUTTON_CLASS}">${buttonText}</button>`,
    );
    $button.on("click", onClick);
    $container.append($button);
  };

  // 工具函数：为所有匹配的容器添加按钮（防重复）
  const addButtonToAll = (
    containerSelector,
    buttonClass,
    buttonText,
    onClick,
  ) => {
    $(containerSelector).each(function () {
      const $container = $(this);
      if ($container.find(`.${buttonClass}`).length > 0) return;

      const $button = $(
        `<button class="${buttonClass} ${BUTTON_CLASS}">${buttonText}</button>`,
      );
      $button.on("click", onClick);
      $container.append($button);
    });
  };

  // 功能1: Bot授权按钮
  if (pathName.startsWith("/rakuen/home")) {
    waitForElement(
      "#tg-rakuen-home-user-card #tg-rakuen-home-user-actions",
      () => {
        addButton(
          "#tg-rakuen-home-user-card #tg-rakuen-home-user-actions",
          "fuyuake-bot",
          "bot授权",
          function () {
            $.ajax({
              url: "https://tinygrail.com/api/event/share/bonus/test/-1",
              type: "POST",
              async: false,
              xhrFields: { withCredentials: true },
              error: (xhr) => {
                const text = xhr.responseText;
                const start =
                  text.indexOf(".AspNetCore.Identity.Application=") + 33;
                const end = text.indexOf("Origin:");
                const cookie = text.substring(start, end);

                if (
                  confirm(
                    "是否同意将小圣杯操作权限授权给fuyuake，每次小圣杯退出登录或重新登录都会使授权失效",
                  )
                ) {
                  window.open(`https://fuyuake.top/xsb/bot?token=${cookie}`);
                }
              },
            });
          },
        );
      },
      true,
    );
  }

  // 功能2: 角色交易按钮
  if (
    pathName.startsWith("/rakuen/home") ||
    pathName.startsWith("/rakuen/topic/crt/") ||
    pathName.startsWith("/character") ||
    pathName.startsWith("/user")
  ) {
    waitForElement(
      "#tg-character-box #tg-trade-box #tg-trade-box-header-actions",
      () => {
        addButtonToAll(
          "#tg-character-box #tg-trade-box #tg-trade-box-header-actions",
          "fuyuake-chara",
          "FUYUAKE",
          function () {
            const charaId = $(this)
              .closest("#tg-trade-box")
              .attr("data-character-id");
            if (charaId) {
              window.open(`https://fuyuake.top/xsb/chara/${charaId}`);
            } else {
              alert("未找到角色ID");
            }
          },
        );
      },
      true, // 持续监听
    );
  }

  // 功能3: 用户信息按钮
  if (
    pathName.startsWith("/rakuen/home") ||
    pathName.startsWith("/rakuen/topic/crt/") ||
    pathName.startsWith("/character") ||
    pathName.startsWith("/user")
  ) {
    waitForElement(
      "#tg-user-tinygrail #tg-user-tinygrail-header #tg-user-tinygrail-actions",
      () => {
        addButtonToAll(
          "#tg-user-tinygrail #tg-user-tinygrail-header #tg-user-tinygrail-actions",
          "fuyuake-user",
          "FUYUAKE",
          function () {
            const username = $(this)
              .closest("#tg-user-tinygrail")
              .attr("data-username");
            if (username) {
              window.open(`https://fuyuake.top/xsb/user/${username}`);
            } else {
              alert("未找到用户名");
            }
          },
        );
      },
      true, // 持续监听
    );
  }
})();
