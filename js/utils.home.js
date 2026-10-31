import { loadProjects, countRows } from '/js/db.js';

// 3D 라이브러리(three, Spline)는 크고 실행이 오래 걸려서(휴대폰에서 2초 가까이), 먼저 불러오면 글자와 화면이 그만큼 늦게 그려진다.
// 화면이 한 번 그려진 다음에 동적 import로 불러온다.
const afterFirstPaint = new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve)));
const threeLoaded = afterFirstPaint.then(() => Promise.all([import('three'), import('@splinetool/loader')]));

// 3D 모델이 DB 응답을 기다리지 않도록 데이터는 따로 받아 온다.
const projectsLoaded = loadProjects();

class Home {
  constructor() {
    this.tags = [];
    [this.canvasWidth, this.canvasHeight] = [600, 600];

    this.init();
  }

  init = () => {
    this.initScrollMagic();
    this.init3d();
    this.initEventListener();
    projectsLoaded.then((projects) => {
      // 프로젝트 데이터에서 태그를 만든다. 최신 프로젝트가 앞에 오도록 세 줄에 번갈아 나눈다.
      const names = [...new Set(Object.keys(projects).sort().reverse()
        .flatMap((year) => Object.keys(projects[year]).map((name) => name.trim())))];
      this.tags = [0, 1, 2].map((line) => ({
        name: names.filter((_, index) => index % 3 === line),
      }));
      this.setTags();
      $('.count-projects').text(Object.values(projects).reduce((sum, year) => sum + Object.keys(year).length, 0));
    });
    countRows('awards').then((count) => $('.count-awards').text(count));
  }

  setTags = () => {
    if(!this.tags.length) return;
    for(const [index, data] of this.tags.entries()) {
      const $target = $(`#page.project #tags #line[idx="${index}"] #mix`).empty();
      let count = 0;
      while($target.width() <= $('#app').width() + $('#app').height() / 4) {
        $target.append(`<div id="tag" style="${count % 3 + 1}">${data.name[count % data.name.length]}</div>`);
        count += 1;
      }
    }
    $('#page.project #line').css('transform', `translateX(${($('#app').width() - $('#navbar #inner').width()) / -2}px)`);
  }

  onMove = (e) => {
    if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
      var touch = e.touches[0] || e.changedTouches[0];
      this.eventX = touch.pageX;
      this.eventY = touch.pageY;
    } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
      this.eventX = e.clientX;
      this.eventY = e.clientY;
    }
    if(this.eventX == undefined || this.eventY == undefined || !this.renderer) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = this.eventX - rect.left - this.canvasWidth / 2;
    const y = this.eventY - rect.top - this.canvasHeight / 2;
    this.scene.rotation.y = x / 4000;
    this.scene.rotation.x = y / 4000;
  };

  initScrollMagic = () => {
    this.controller = new ScrollMagic.Controller({container: "#scroll"});

    const projectTimeline = new TimelineMax();
    const projectScroll = new ScrollMagic.Scene({
      triggerElement: `#page.project`,
      duration: '200%',
      triggerHook: 1,
    }).addTo(this.controller).setTween(projectTimeline);
    [0, 1, 2].map((index) => {
      projectTimeline.add(TweenMax.staggerFromTo(`#page.project #tags #line[idx="${index}"] #mix`, 1, {
        ease: Linear.easeNone,
        transform: (index % 2) ? 'translateX(0)' : 'translateX(0)'
      }, {
        ease: Linear.easeNone,
        transform: (index % 2) ? 'translateX(25vh)' : 'translateX(-25vh)'
      }), 0);
    });

    const awardTimeline = new TimelineMax();
    const awardScroll = new ScrollMagic.Scene({
      triggerElement: `#page.award`,
      duration: '200%',
      triggerHook: 1,
    }).addTo(this.controller).setTween(awardTimeline);
    awardTimeline.add(TweenMax.staggerFromTo(`#page.award #image #main`, 1, {
      ease: Linear.easeNone,
      transform: 'translateY(100px)'
    }, {
      ease: Linear.easeNone,
      transform: 'translateY(-100px)'
    }), 0).add(TweenMax.staggerFromTo(`#page.award #image #shadow`, 1, {
      ease: Linear.easeNone,
      transform: 'translateY(-100px)'
    }, {
      ease: Linear.easeNone,
      transform: 'translateY(100px)'
    }), 0);
  }

  init3d = async () => {
    const [{ Scene, Color, Euler, WebGLRenderer, OrthographicCamera, PCFShadowMap }, { default: SplineLoader }] = await threeLoaded;
    this.camera = new OrthographicCamera(this.canvasWidth / - 2, this.canvasWidth / 2, this.canvasHeight / 2, this.canvasHeight / - 2,  -100000, 100000);
    this.camera.position.set(-53.17, -10.09, 572.1);
    this.camera.quaternion.setFromEuler(new Euler(0, 0, 0));

    this.scene = new Scene();
    this.scene.background = new Color('#FAFAFF');

    const loader = new SplineLoader();
    loader.load('/model/luna.splinecode', (splineScene) => this.scene.add(splineScene));

    this.renderer = new WebGLRenderer({ canvas: document.getElementById('luna3d'), antialias: true, alpha: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.renderer.setClearColor( 0x000000, 0 );
    this.setPixelRatio();
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });
  }

  // 화면 배율(body scale)과 기기 픽셀 밀도에 맞춰 선명하게 그린다.
  setPixelRatio = () => {
    if(!this.renderer) return;
    const scale = document.body.getBoundingClientRect().width / document.body.offsetWidth || 1;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio * scale, 4));
  }

  initEventListener = () => {
    $(document).on('touchstart touchmove touchend touchcancel', this.onMove);
    $(document).on('mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave', this.onMove);
    $('#scroll').on('scroll', this.onMove);
    $(window).resize(this.setTags);
    $(window).resize(this.setPixelRatio);
  }
}; new Home();