import projects from '/data/project.js';

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
  }

  setProject = (category) => {
    $('#page.project #category #mix #item').removeClass('active');
    $(`#page.project #category #item[idx="${category}"]`).addClass('active');
    $('#page.project #title #number').text(category);
    $('#page.project #project').empty();
    $('#page.main #number').text(category);

    for(const [name, data] of Object.entries(projects[category])) {
      $('#page.project #project').append(`
        <div id="item" idx="${name}">
          <div id="image" style="background-image: url('/img/project/project/${data.image}');"></div>
          <div id=text>
            <div id="name">${name}</div>
            <div id="description">${data.description}</div>
          </div>
        </div>
      `);
    }
    this.resizeItem();
  }

  resizeItem = () => {
    $('#page.project #project #item').css('max-width', `${$('#page.project #project #item:first-child').width()}px`);
  }

  initEventListener = () => {
    $(window).resize(this.resizeItem);
  }
}; new Project();