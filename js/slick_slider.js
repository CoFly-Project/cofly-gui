$('.portfolio-slides').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: true,
  dots: true
  
});


$('.portfolio-slides').slickLightbox({
  itemSelector        : 'a',
  navigateByKeyboard  : true
});