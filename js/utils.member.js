import members from '/data/members.js';

class Member {
  constructor() {
    this.init();
  }

  init = () => {
    this.setMembers();
    this.initEventListener();
  }

  setMembers = () => {
    for(const [category, data] of Object.entries(members)) {
      $('#page.member #category #mix').append(`<div id="item" idx="${category}">${category}</div>`);
    }

    $('#page.member #category #mix #item').on('click', (e) => {
      const category = $(e.currentTarget).attr('idx');
      this.setMember(category);
    });
    $('#page.member #category #mix #item:first-child').trigger('click');
  }

  setMember = (category) => {
    $('#page.member #category #mix #item').removeClass('active');
    $(`#page.member #category #item[idx="${category}"]`).addClass('active');
    $('#page.member #title').text(category);
    $('#page.member #member').empty();

    for(const [name, data] of Object.entries(members[category])) {
      $('#page.member #member').append(`
        <div id="item" idx="${name}">
          <div id="position">${data.position}</div>
          <div id="image" style="background-image: url(${data.image ? `/img/member/profile/user/${data.image}` : '/img/member/profile/default.svg'});"></div>
          <div id="name">${name}</div>
          <div id="class">${data.class}</div>
          <div id="description">${data.description}</div>
        </div>
      `);
    }

    this.resizeItem();
  }

  resizeItem = () => {
    $('#page.member #member #item').attr('style', '');
    $('#page.member #member').attr('style', '');
    $('#page.member #member').css('width', '100%');
    let count = Math.floor(($('#page.member #member').width() + 30) / ($('#page.member #member #item').width() + 30));

    if(count >= 3) {
      const margin = ($('#page.member #member').width() - $('#page.member #member #item').width() * 3) / 2;
      $('#page.member #member #item').css('margin-right', `${margin}px`);
      $('#page.member #member').css('margin-right', `-${margin}px`);
    } else if(count == 2) {
      const margin = ($('#page.member #member').width() - $('#page.member #member #item').width() * 2);
      if(margin / 4 >= 30) {
        $('#page.member #member #item').css('margin-left', `${margin / 4}px`);
        $('#page.member #member #item').css('margin-right', `${margin / 4}px`);
      } else {
        $('#page.member #member #item').css('margin-right', `${margin}px`);
        $('#page.member #member').css('margin-right', `-${margin}px`);
      }
    } else {
      $('#page.member #member #item').css('width', `100%`);
    }
    $('#page.member #member').css('width', 'unset');
  }

  initEventListener = () => {
    $(window).resize(this.resizeItem);
  }
}; new Member();