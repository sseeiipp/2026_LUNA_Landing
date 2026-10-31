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
  // 캐시된 페이지는 첫 화면을 그리기 전에 ready가 먼저 와서 페이드 인이 건너뛰어진다.
  // 투명한 상태로 한 번 그린 다음에 loaded를 붙여서 매번 0.5초 페이드 인이 보이게 한다.
  const scroll = document.getElementById('scroll');
  if(scroll) getComputedStyle(scroll).opacity;
  requestAnimationFrame(() => requestAnimationFrame(() => $('#scroll').addClass('loaded')));
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
