import { Scene, Color, Euler, WebGLRenderer, OrthographicCamera, PCFShadowMap } from 'three';
import SplineLoader from '@splinetool/loader';

class Home {
  constructor() {
    this.tags = [{
      name: ['하랑', '워커홀릭', '달그락', '청포도', 'Upcycling It', 'Co-Study in Covid World', 'TTV'],
    }, {
      name: ['MOME MATE', '매일메일', '쉿', '욕설감지기', '글적글적', '블루펜슬', '너의 우산', 'My Little Farm'],
    }, {
      name: ['TTV', 'CHAIN POST', 'CANETIS', 'For Moon', 'Witch', 'Dr. Daily', '바람', '워커홀릭'],
    }];
    [this.canvasWidth, this.canvasHeight] = [600, 600];

    this.init();
  }

  init = () => {
    this.initScrollMagic();
    this.setTags();
    this.init3d();
    this.initEventListener();
  }

  setTags = () => {
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
    if(this.eventX == undefined || this.eventY == undefined) return;
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

  init3d = () => {
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
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });
  }

  initEventListener = () => {
    $(document).on('touchstart touchmove touchend touchcancel', this.onMove);
    $(document).on('mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave', this.onMove);
    $('#scroll').on('scroll', this.onMove);
    $(window).resize(this.setTags);
  }
}; new Home();