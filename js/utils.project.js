import { loadProjects, imageUrl } from '/js/db.js';

const projects = await loadProjects();
// 아이콘이 없는 프로젝트는 루나 로고로 대신한다. 로고는 칸의 64% 크기로 보여 준다.
const LOGO = '/logo/logo-512x512.png';

class Project {
  constructor() {
    this.init();
  }

  init = () => {
    this.setProjects();
    this.initEventListener();
  }

  setProjects = () => {
    for(const category of Object.keys(projects).sort().reverse()) {
      $('#page.project #category #mix').append(`<div id="item" idx="${category}">${category}년</div>`);
    }

    $('#page.project #category #mix #item').on('click', (e) => {
      const category = $(e.currentTarget).attr('idx');
      this.setProject(category);
    });
    $('#page.project #category #mix #item:first-child').trigger('click');
    // 첫 화면 제목은 올해가 아니라 프로젝트가 있는 가장 최근 연도로 보여 준다.
    $('#page.main #number').text(Object.keys(projects).sort().reverse()[0]);
  }

  setProject = (category) => {
    $('#page.project #category #mix #item').removeClass('active');
    $(`#page.project #category #item[idx="${category}"]`).addClass('active');
    $('#page.project #title #number').text(category);
    $('#page.project #project').empty();

    for(const [name, data] of Object.entries(projects[category])) {
      $('#page.project #project').append(`
        <div id="item" idx="${name}">
          ${data.image ? `<div id="image" style="background-image: url('${imageUrl(data.image)}');"></div>` : `<div id="image" style="background-image:url('${LOGO}');background-size:64%"></div>`}
          <div id=text>
            <div id="name">${name}</div>
            <div id="description">${data.description}</div>
          </div>
        </div>
      `);
    }
    this.resizeItem();
    // 사진 파일이 저장소에 없는 프로젝트도 루나 로고로 대신 보여 준다.
    $('#page.project #project #item').each((_, item) => {
      const data = projects[category][$(item).attr('idx')];
      if(!data.image) return;
      const image = new Image();
      image.onerror = () => $(item).find('#image').css('background-image', `url('${LOGO}')`);
      image.src = imageUrl(data.image);
    });
  }

  resizeItem = () => {
    $('#page.project #project #item').css('max-width', `${$('#page.project #project #item:first-child').width()}px`);
  }

  initEventListener = () => {
    $(window).resize(this.resizeItem);
  }
}; new Project();