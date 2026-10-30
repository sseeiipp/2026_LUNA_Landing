import qnas from '/data/qna.js';

class Qna {
  constructor() {
    this.init();
  }

  init = () => {
    this.setQnas();
  }

  setQnas = () => {
    for(const [q, a] of Object.entries(qnas)) {
      $('#page.qna #inner').append(`
        <div id="item">
          <div id="q">
            <div id="mix">
              <div id="type">Q</div>
              <div id="text">${q}</div>
            </div>
          </div>
          <div id="a">
            <div id="mix">
              <div id="type">A</div>
              <div id="text">${a.replaceAll('\n', '<br/>')}</div>
            </div>
          </div>
        </div>
      `);
    }

    $('#page.qna #item #q').on('click', (e) => {
      $(e.currentTarget).parent('#item').toggleClass('active');
    });
  }
}; new Qna();