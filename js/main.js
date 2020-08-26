// // search page
// function pageWidget(pages) {
//   const widgetWrap = $(
//     '<div class="widget_wrap"><ul class="widget_list"></ul></div>'
//   );
//   widgetWrap.prependTo('body');
//   for (let i = 0; i < pages.length; i++) {
//     if (pages[i][0] === '#') {
//       $(
//         `<li class="widget_item"><a class="widget_link" href="${pages[i]}">${pages[i]}</a></li>`
//       ).appendTo('.widget_list');
//     } else {
//       $(
//         `<li class="widget_item"><a class="widget_link"
//         href="${pages[i]}.html">${pages[i]}</a></li>`
//       ).appendTo('.widget_list');
//     }
//   }

//   const widgetStilization = $(
//     '<style>body {position:relative} .widget_list{max-height: calc(100vh - 40px); overflow: auto;} .widget_wrap{position:fixed;top:0;left:0;z-index:9999;padding:20px 20px;background:#222;border-bottom-right-radius:10px;-webkit-transition:all .3s ease;transition:all .3s ease;-webkit-transform:translate(-100%,0);-ms-transform:translate(-100%,0);transform:translate(-100%,0)}.widget_wrap:after{content:" ";position:absolute;top:0;left:100%;width:24px;height:24px;background:#222 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAABGdBTUEAALGPC/xhBQAAAAxQTFRF////////AAAA////BQBkwgAAAAN0Uk5TxMMAjAd+zwAAACNJREFUCNdjqP///y/DfyBg+LVq1Xoo8W8/CkFYAmwA0Kg/AFcANT5fe7l4AAAAAElFTkSuQmCC) no-repeat 50% 50%;cursor:pointer}.widget_wrap:hover{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0)}.widget_item{padding:0 0 10px}.widget_link{color:#fff;text-decoration:none;font-size:15px;}.widget_link:hover{text-decoration:underline} </style>'
//   );

//   widgetStilization.prependTo('.widget_wrap');
// }

// $(document).ready(function($) {
//   pageWidget(['index']);
// });

/* Init object fit polyfill */
/* To make it work, add 'font-family: 'object-fit: cover;';' to image */
// if (window.objectFitImages) {
//   window.objectFitImages();
// }

/* Init svg polyfill */
// if (window.svg4everybody) {
//   window.svg4everybody();
// }

$(document).ready(() => {
  // let resizeId;
  let wWidth = $(window).width();
  let navState = false;
  const $header = $('.page-header');
  const $nav = $header.find('.nav');
  const $parentLi = $nav.find('.menu-item-has-children');
  const $parentLinks = $parentLi.children('a');
  const $subMenu = $parentLi.children('.sub-menu');
  let isObserver = true;
  let observer;
  // let controller = new ScrollMagic.Controller();
  let isTouch;

  if (
    !('IntersectionObserver' in window) ||
    !('IntersectionObserverEntry' in window) ||
    !('isIntersecting' in window.IntersectionObserverEntry.prototype)
  ) {
    isObserver = false;
    $('html').removeClass('is-observer');
  }

  if (isObserver) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -15% 0px' }
    );
  }

  function isTouchDevice() {
    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    const mq = (query) => {
      return window.matchMedia(query).matches;
    };

    if (
      'ontouchstart' in window ||
      // eslint-disable-next-line no-undef
      (window.DocumentTouch && document instanceof DocumentTouch)
    ) {
      return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
      ''
    );
    return mq(query);
  }

  if (isTouchDevice()) {
    isTouch = true;
    $('html').addClass('is-touch');
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate, ...args) {
    let timeout;
    return function () {
      const context = this;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // function once(fn, context) {
  //   var result;

  //   return function() {
  //     if (fn) {
  //       result = fn.apply(context || this, arguments);
  //       fn = null;
  //     }

  //     return result;
  //   };
  // }

  // // Usage
  // var canOnlyFireOnce = once(function() {
  //   console.log('Fired!');
  // });

  function disableScrolling() {
    if ($(document).height() > $(window).height()) {
      const scrollTop = $('html').scrollTop()
        ? $('html').scrollTop()
        : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
      $('html').addClass('disable-scrolling').css('top', -scrollTop);
    }
  }

  function enableScrolling() {
    const scrollTop = parseInt($('html').css('top'), 10);
    $('html').removeClass('disable-scrolling');
    $('html,body').scrollTop(-scrollTop);
  }

  function updateNav() {
    $header.removeClass('is-opened');
    $parentLi.removeClass('is-active');
    $parentLinks.attr('aria-expanded', 'false');

    if (wWidth < 1280) {
      $subMenu.slideUp();
    } else {
      $subMenu.show();
    }
  }

  function handleNavTouch(e) {
    const $item = $(e.target);
    const $submenu = $item.siblings('.sub-menu');

    if ($item.parent().hasClass('is-active')) {
      $item.attr('aria-expanded', 'false').parent().removeClass('is-active');

      if (wWidth < 1280) {
        $submenu.slideUp();
      }
    } else {
      $parentLi.removeClass('is-active');
      $item.attr('aria-expanded', 'true').parent().addClass('is-active');

      if (wWidth < 1280) {
        $subMenu.slideUp();
        $submenu.slideDown();
      }
    }
  }

  function bindEvents() {
    $('.hamburger').on('click', () => {
      if (navState) {
        $header.removeClass('is-opened');
        enableScrolling();
      } else {
        $header.addClass('is-opened');
        disableScrolling();
      }

      navState = !navState;
    });

    $parentLinks.on('touchend', (e) => {
      e.preventDefault();
      handleNavTouch(e);
    });

    /* Navigation with tabbing */
    $(window).keyup((e) => {
      const code = e.keyCode ? e.keyCode : e.which;

      if (code === 9) {
        if ($parentLinks.filter(':focus').length) {
          handleNavTouch(e);
        } else if ($nav.find('>li>a:focus').length) {
          $parentLi.removeClass('is-active');

          if (wWidth < 1280) {
            $parentLi.children('.sub-menu').slideUp();
          }
        }
      }
    });
  }

  function initSM() {
    if (controller === null || controller === undefined) {
      // reinitialize ScrollMagic only if it is not already initialized
      controller = new ScrollMagic.Controller();
    }
  }

  const doneResizing = debounce(() => {
    const width = $(window).width();

    if (wWidth !== width) {
      wWidth = width;

      // if (controller !== null && controller !== undefined) {
      //   // completely destroy the controller
      //   controller = controller.destroy(true);
      //   initSM()
      // }
    }
  }, 500);  

  function sectionColor(color){
    const $year = $('.timeline__year');
    color == "white" ? $($year).css({
      "border-bottom": "solid black", 
      "border-width": "1px" , 
      "color": "black"}) 
      :  $($year).css({   
      "border-bottom": "solid white", 
      "border-width": "1px", 
      "color": "white"})
  }




  function initSixtySix(){
    console.log('66');
  }

  function initSixtySeven(){
    console.log('67');
  }

  //1960 section animations

  const tl_sixty = gsap.timeline({
    paused: true
  })

  const $sixty = $('.timeline__year') 
  const $sixtyDate = $('.sixty__date ')
  const $sixtyHeader = $('.sixty__header ')
  const $sixtyCopy = $('.sixty__copy ')
  const $sixtyImageOne = $('.sixty__slider-wrap')
  // const $sixtyImageTwo = $('.sixty__image-two')

  
  tl_sixty.to($sixty[1], {duration: 0.4, ease: "linear", width: "29px", delay: 0.3})
  tl_sixty.to($sixty[3], {duration: 0, ease: "linear", width: "18px"})
  tl_sixty.to($sixtyDate, {duration: 0.4, ease: "linear", opacity: 1, delay: 0.2})
  tl_sixty.to($sixtyHeader, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1})
  tl_sixty.to($sixtyCopy, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
  tl_sixty.to($sixtyImageOne, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.3")
  // tl_sixty.to($sixtyImageTwo, {duration: 0.665, ease: "power1.out", opacity: 1, y: 1}, "=-0.6")


//1966 section animations
const tl_sixtySix = gsap.timeline({
  paused: true
})

const $sixtySix = $('.timeline__year') 
const $sixtySixDate = $('.sixty-six__date ')
const $sixtySixHeader = $('.sixty-six__header ')
const $sixtySixCopy = $('.sixty-six__copy ')
const $sixtySixImageOne = $('.sixty-six__image-one')

tl_sixtySix.to($sixtySix[1], {duration: 0, ease: "linear", width: "18px"})
tl_sixtySix.to($sixtySix[5], {duration: 0, ease: "linear", width: "18px"})
tl_sixtySix.to($sixtySix[3], {duration: 0.3, ease: "linear", width: "29px", delay: 0.3})
tl_sixtySix.to($sixtySixDate, {duration: 0.4, ease: "linear", opacity: 1, delay: 0.2})
tl_sixtySix.to($sixtySixHeader, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
tl_sixtySix.to($sixtySixCopy, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
tl_sixtySix.to($sixtySixImageOne, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.3" )

//1967 section animations
const tl_sixtySeven = gsap.timeline({
  paused: true
})

const $sixtySeven = $('.timeline__year') 
const $sixtySevenDate = $('.sixty-seven__date ')
const $sixtySevenHeader = $('.sixty-seven__header ')
const $sixtySevenCopy = $('.sixty-seven__copy ')
const $sixtySevenImageOne = $('.sixty-seven__image-one')

tl_sixtySeven.to($sixtySeven[3], {duration: 0, ease: "linear", width: "18px"})
tl_sixtySeven.to($sixtySeven[7], {duration: 0, ease: "linear", width: "18px"})
tl_sixtySeven.to($sixtySeven[5], {duration: 0.3, ease: "linear", width: "29px", delay: 0.3})
tl_sixtySeven.to($sixtySevenDate, {duration: 0.4, ease: "linear", opacity: 1, delay: 0.2})
tl_sixtySeven.to($sixtySevenHeader, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
tl_sixtySeven.to($sixtySevenCopy, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
tl_sixtySeven.to($sixtySevenImageOne, {duration: 0.65, ease: "power1.out", opacity: 1, x: 1},"=-0.3" )

//1969 section animations
const tl_sixtyNine = gsap.timeline({
  paused: true
})

const $sixtyNine = $('.timeline__year') 
const $sixtyNineDate = $('.sixty-nine__date ')
const $sixtyNineHeader = $('.sixty-nine__header ')
const $sixtyNineCopy = $('.sixty-nine__copy ')
const $sixtyNineImageOne = $('.sixty-nine__image-one')

tl_sixtyNine.to($sixtyNine[11], {duration: 0, ease: "linear", width: "18px"})
tl_sixtyNine.to($sixtyNine[5], {duration: 0, ease: "linear", width: "18px"})
tl_sixtyNine.to($sixtyNine[7], {duration: 0.3, ease: "linear", width: "29px", delay: 0.3})
tl_sixtyNine.to($sixtyNineDate, {duration: 0.4, ease: "linear", opacity: 1, delay: 0.3})
tl_sixtyNine.to($sixtyNineHeader, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
tl_sixtyNine.to($sixtyNineCopy, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
tl_sixtyNine.to($sixtyNineImageOne, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.3" )

//1989 section animations
const tl_eightyNine = gsap.timeline({
  paused: true
})

const $eightyNine = $('.timeline__year') 
const $eightyNineDate = $('.eighty-nine__date ')
const $eightyNineHeader = $('.eighty-nine__header ')
const $eightyNineCopy = $('.eighty-nine__copy ')
const $eightyNineImageOne = $('.eighty-nine__image-one')
const $eightyNineDesktop = $('.eighty-nine__image-desktop')

tl_eightyNine.to($eightyNine[15], {duration: 0, ease: "linear", width: "18px"})
tl_eightyNine.to($eightyNine[7], {duration: 0, ease: "linear", width: "18px"})
tl_eightyNine.to($eightyNine[11], {duration: 0.3, ease: "linear", width: "29px", delay: 0.3})
tl_eightyNine.to($eightyNineDate, {duration: 0.4, ease: "linear", opacity: 1, delay: 0.3})
tl_eightyNine.to($eightyNineHeader, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
tl_eightyNine.to($eightyNineCopy, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
tl_eightyNine.to($eightyNineImageOne, {duration: 0.65, ease: "power1.out", opacity: 1, x: 1}, "=-0.3" )
// tl_eightyNine.to($eightyNineDesktop, {duration: 0.4, ease: "power1.out", opacity: 1, x: 1}, "=-0.4")

//2009 section animations

const tl_zeroNine = gsap.timeline({
  paused: true
})

const $zeroNine = $('.timeline__year') 
const $zeroNineDate = $('.zero-nine__date ')
const $zeroNineHeader = $('.zero-nine__header ')
const $zeroNineCopy = $('.zero-nine__copy ')
const $zeroNineImageOne = $('.zero-nine__image-one')

tl_zeroNine.to($zeroNine[21], {duration: 0, ease: "linear", width: "18px"})
tl_zeroNine.to($zeroNine[11], {duration: 0, ease: "linear", width: "18px"})
tl_zeroNine.to($zeroNine[15], {duration: 0.3, ease: "linear", width: "29px", delay: 0.3})
tl_zeroNine.to($zeroNineDate, {duration: 0.4, ease: "linear", opacity: 1, delay: 0.3})
tl_zeroNine.to($zeroNineHeader, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
tl_zeroNine.to($zeroNineCopy, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
tl_zeroNine.to($zeroNineImageOne, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.3" )


//2020 section animations

const tl_twenty = gsap.timeline({
  paused: true
})

const $twenty = $('.timeline__year') 
const $twentyDate = $('.twenty__date ')
const $twentyHeader = $('.twenty__header ')
const $twentyCopy = $('.twenty__copy ')
const $twentyButton = $('.twenty__btn')


tl_twenty.to($twenty[15], {duration: 0, ease: "linear", width: "18px"})
tl_twenty.to($twenty[21], {duration: 0.3, ease: "linear", width: "29px", delay: 0.3})
tl_twenty.to($twentyDate, {duration: 0.4, ease: "linear", opacity: 1, delay: 0.3})
tl_twenty.to($twentyButton, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
tl_twenty.to($twentyCopy, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")
tl_twenty.to($twentyHeader, {duration: 0.65, ease: "power1.out", opacity: 1, y: 1}, "=-0.4")




  function initFullPage(){
      const $timeline = $('.timeline');
      $timeline.hide()
   
      $('#fullpage').fullpage({
        autoScrolling:true,
        scrollHorizontally: true,
        onLeave: function(origin, destination, direction) {
          if (origin == 1 && direction == "down") { 
            console.log("1 left 60");
            sectionColor("black"); 
            $timeline.show();
            tl_sixty.restart()
          }

          else if (destination == 1) { 
            console.log("1");
            $timeline.hide();
            $('.hero-vid').get(0).play()
          }

          else if(destination == 2 && direction == "up"){         
             console.log("2 from 3 60"); 
             $timeline.show();
             sectionColor("black");
             tl_sixty.restart();
          }

          else if(destination == 3 && direction == "up"){         
            console.log("3 from 4 66"); 
            sectionColor("white");
            tl_sixtySix.restart();
            
          }

          else if(destination == 4 && direction == "up"){         
          console.log("4 from 5 67"); 
          sectionColor("black");
          tl_sixtySeven.restart();
          }

          else if(destination == 5 && direction == "up"){         
            console.log("5 from 6 69"); 
            sectionColor("white");
            tl_sixtyNine.restart();
            $('.sixty-nine-vid').get(0).play()
            
          }
          else if(destination == 6 && direction == "up"){         
            console.log("6 from 7 89"); 
            sectionColor("black");  
            tl_eightyNine.restart();  
          }
          else if(destination == 7 && direction == "up"){         
            console.log("7 from 8 09"); 
            sectionColor("white");
            tl_zeroNine.restart(); 
            $('.zero-nine-vid').get(0).play() 
            
          }


          //down

          else if(destination == 2 && direction == "down"){         
            console.log("2 from 1 nothing"); 
            sectionColor("black");
          }

          else if(destination == 3 && direction == "down"){         
            console.log("3 from 2 66"); 
            sectionColor("white");
            tl_sixtySix.restart();
            
          }

          else if(destination == 4 && direction == "down"){         
            console.log("4 from 3 67"); 
            sectionColor("black");
            tl_sixtySeven.restart();
          }
          
          else if(destination == 5 && direction == "down"){         
            console.log("5 from 4 69"); 
            sectionColor("white");
            tl_sixtyNine.restart();
            $('.sixty-nine-vid').get(0).play()
          }
          else if(destination == 6 && direction == "down"){         
            console.log("6 from 5  89"); 
            sectionColor("black"); 
            tl_eightyNine.restart();           
          }
          else if(destination == 7 && direction == "down"){         
            console.log("7 from 6 09"); 
            sectionColor("white");
            tl_zeroNine.restart(); 
            $('.zero-nine-vid').get(0).play() 
            
          }
          else if(destination == 8 && direction == "down"){         
            console.log("8 from 7  20"); 
            sectionColor("black"); 
            tl_twenty.restart();  
            $('.twenty-vid').get(0).play()           
          }
        }
      });
      
   }


   function initSlider(){
     $('.sixty__slider-wrap').slick({
      arrows:false
     })
   }

   function initHeroButton(){
   
     $('.home__arrow').click(function(){    
       console.log('clicked');
          $("#fullpage").fullpage.moveTo($(this).index() + 2);
      })
   }





  /* FUNCTION CALLS */
  /* ============= */
  bindEvents();
  initFullPage();
  initSlider();
  initHeroButton();


  if (isObserver) {
    $('.js-visibility').each((i, el) => {
      observer.observe(el);
    });
  }

  $(window).on('scroll', () => {});

  $(window).on('load', () => {




  });

  $(window).on('resize', doneResizing);
});
