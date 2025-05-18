// 导入swiper
import Swiper from 'https://unpkg.com/swiper@8.4.7/swiper-bundle.esm.browser.min.js';

// 2. 你的数据
const slideLists = [
  {
    title: 'NTQQ liteloader插件教程',
    desp: '新手向, 通过学习一些最佳实践得出编写liteloaderQQNT插件的经验心得',
    link: '/2025/04/ntqq-liteloader-noobs-liteloader-explore.html',
    img: 'https://i.postimg.cc/59L5ksmK/1.png'
  },
  {
    title: 'simpleTex WebAPI',
    desp: '一个借用SimpleTex解决在线Tex文档识别的方案',
    link: '/2024/03/simpletex-webapi.html',
    img: 'https://i.postimg.cc/xTNQ2SB3/image.png'
  },
  {
    title: '标题三',
    desp: '这是第三张幻灯片的描述',
    link: '#',
    img: 'https://i.postimg.cc/qqs83FdM/image.png'
  }
];

// 3. 动态生成 slides
const wrapper = document.querySelector('.swiper-wrapper');
slideLists.forEach(({ title, desp, link, img }) => {
  const slideEl = document.createElement('div');
  slideEl.classList.add('swiper-slide');
  slideEl.innerHTML = `
    <a href="${link}">
      <div class="image-container">
        <img src="${img}" alt="${title}" />
      </div>
      <h5>${title}</h5>
      <p>${desp}</p>
    </a>
  `;
  wrapper.appendChild(slideEl);
});

// 4. 初始化 Swiper
const swiper = new Swiper('.mySwiper', {
  // 保证横向滚动
  direction: 'horizontal',
  // 一次只看一张
  slidesPerView: 1,
  // 循环模式
  loop: true,
  // 自动播放
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  // 导航按钮
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  // 动画速度（可选）
  speed: 600,
});

// 5. 点击前／后按钮时重置一次定时器
function resetAutoplay() {
  swiper.autoplay.stop();
  swiper.autoplay.start();
}

document
  .querySelector('.swiper-button-next')
  .addEventListener('click', resetAutoplay);
document
  .querySelector('.swiper-button-prev')
  .addEventListener('click', resetAutoplay);
