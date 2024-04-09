import { throttle, drawEcharts } from '../modules/utils.js';
import { createEvent } from '../modules/event.js';

class Global {
  constructor() {
    this.init();
    createEvent();
  }

  init() {
    const html = $('html');
    $('.menu-item.toggle').on('click', () => {
      html.addClass('active-mask');
      this.switchSidebar(1);
    });
    window.lazyLoadInstance = new LazyLoad({ elements_selector: 'img', threshold: 0, data_src: 'lazy-src' });
    $('.adsorption .switch-model').on('click', () => {
      const mode = (localStorage.getItem('Butterfly-data-theme') || 'light') === 'light' ? 'dark' : 'light';
      window.eventCore.emit('changeTheme', mode);
      const isLight = mode === 'light';
      drawEcharts(isLight ? 'light' : 'dark', 1);
      $('html').attr('data-theme', isLight ? 'light' : 'dark');
      localStorage.setItem('Butterfly-data-theme', isLight ? 'light' : 'dark');
      window.dataTheme = mode;
    });
    $('.adsorption .back-top').on('click', () => {
      $('html').animate({ scrollTop: 0 }, 300);
    });
    $('.global-mask').on('click', () => {
      html.removeClass('active-mask');
      this.switchSidebar(0);
    });
    this.sidebar();
    this.scroll();
    this.runDay();
    this.removelrc();
  }

  switchSidebar(tp) {
    const sidebar = $('.sidebar');
    sidebar.css({ "transform": `translate3d(${tp === 1 ? '-100%' : '0'}, 0, 0)` });
  }

  sidebar() {
    const menus = $('.sidebar-menus .menu-item');
    menus.each(function () {
      const t = $(this);
      if (t.hasClass('relative')) {
        $(this).on('click', () => {
          t.toggleClass('active').children('.menu-child').stop().toggle("fast");
        });
      }
    });
  }

  scroll() {
    const nav = $('.header .nav');
    const adsorption = $('.adsorption');
    const postSticky = $('.post .aside .post-sticky');
    let scrollNum = 0;
    const fn = throttle((e) => {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > 56) {
        const isScrollDown = scrollNum <= scrollTop;
        if (isScrollDown) {
          if (nav.hasClass('visible')) {
            nav.addClass('hidden').removeClass('visible');
          }
          if (postSticky) postSticky.css('top', '');
          if (!adsorption.hasClass('active')) adsorption.addClass('active');
        } else {
          if (!nav.hasClass('visible')) {
            nav.addClass('visible').removeClass('hidden');
          }
          if (postSticky) postSticky.css('top', '70px');
        }
        if (!nav.hasClass('style')) nav.addClass('style');
      } else {
        if (scrollTop === 0) {
          nav.removeClass('style visible hidden');
          if (adsorption.hasClass('active')) adsorption.removeClass('active');
        }
      }
      scrollNum = scrollTop;
    }, 200);
    window.addEventListener('scroll', fn);
  }

  runDay() {
    const dom = $('.aside-web-info .run-day');
    if (!dom) return;
    const dataRunDay = dom.attr('data-runday');
    if (!dataRunDay) return;
    const runDay = new Date();
    if (runDay.toString() === 'Invalid Date') {
      dom.html('<span style="color:#fd0000">建站时间配置错误</span>');
      return;
    }
    const date = runDay.getTime() - new Date(dataRunDay).getTime();
    const day = parseInt((date / (1000 * 24 * 60 * 60)).toString());
    dom.html(`${day} 天`);
  }

  removelrc() {
    const lrcIcon = document.querySelector(".aplayer-icon-lrc");
    if (!lrcIcon) return;
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          observer.disconnect();
          setTimeout(() => {
            lrcIcon.click();
          }, 1);
        }
      }
    });
    const observerConfig = {
      childList: true,
      subtree: true,
    };
    observer.observe(document, observerConfig);
  }
}

document.addEventListener("DOMContentLoaded", () => window.GlobalClass = new Global());
