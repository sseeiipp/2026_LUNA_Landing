let showWidth = 0;
let showHeight = 0;
let checkScale = true;
const getVW = (width) => showWidth * width / 100;
const getVH = (height) => showHeight * height / 100;
const setScaleWithWidth = (scaleWidth) => {
  const scale = $(window).width() / scaleWidth;
  setScale(scale);
};
const setScale = (scale) => {
  $('body').css('transform', `scale(${scale})`);
  $('body').css('width', `${1 / scale * 100}%`);
  $('body').css('height', `${1 / scale * 100}%`);
  checkScale = false;
  window.dispatchEvent(new Event('resize'));
};
const resize = () => {
  [showWidth, showHeight] = [$('body').width(), $('body').height()];
  $('#app').width(showWidth); $('#app').height(Math.ceil(showHeight));
  $('#content #page[type="full"]').height(showHeight - $('#navbar').height());
  $('#content #page[type="min"]').css('min-height', `${showHeight - $('#navbar').height()}px`);
  for(const vw of $('.vw')) {
    $(vw).width(getVW($(vw).attr('vw')));
  }

  if(checkScale) {
    if(showWidth <= 750) {
      setScaleWithWidth(750);
    } else {
      setScale(1);
    }
  } else {
    checkScale = true;
  }
}; resize();
$(window).resize(resize).trigger('resize');
$(document).ready(() => {
  $('#scroll').addClass('loaded');
  if(["member", "project"].includes(slug)) {
    $('#navbar').addClass('glass');
    $('#scroll').scroll(() => {
      if($('#scroll').scrollTop()) {
        $('#navbar').removeClass('glass');
      } else {
        $('#navbar').addClass('glass');
      }
    });
  }
});
