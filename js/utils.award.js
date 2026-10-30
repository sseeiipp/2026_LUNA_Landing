import awards from '/data/award.js';

class Award {
  constructor() {
    this.init();
  }

  init = () => {
    this.setAwards();
    this.initEventListener();
  }

  setAwards = () => {
    for(const category of Object.keys(awards).sort().reverse()) {
      $('#page.award #category #mix').append(`<div id="item" idx="${category}">${category}년</div>`);
    }

    $('#page.award #category #mix #item').on('click', (e) => {
      const category = $(e.currentTarget).attr('idx');
      this.setAward(category);
    });
    $('#page.award #category #mix #item:first-child').trigger('click');
  }

  setAward = (category) => {
    $('#page.award #category #mix #item').removeClass('active');
    $(`#page.award #category #item[idx="${category}"]`).addClass('active');
    $('#page.award #title #number').text(category);
    $('#page.award #award').empty();

    for(const [name, data] of Object.entries(awards[category])) {
      $('#page.award #award').append(`
        <div id="item" idx="${name}">
          <div id="image" style="background-image: url('/img/award/award/${data.image}');"></div>
          <div id=text>
            <div id="name">${name}</div>
            <div id="prize">${data.prize}</div>
            <div id="team">${data.team} - ${data.members}</div>
            <div id="date">${data.date}</div>
          </div>
        </div>
      `);
    }
    this.resizeItem();
  }

  resizeItem = () => {
    $('#page.award #award #item').css('max-width', `${$('#page.award #award #item:first-child').width()}px`);
  }

  initEventListener = () => {
    $(window).resize(this.resizeItem);
  }
}; new Award();