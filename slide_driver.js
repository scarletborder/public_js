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

// 初始化 Swiper
function initSwiper() {
  // 动态插入幻灯片
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  
  slideLists.forEach(slide => {
    const slideElement = document.createElement('div');
    slideElement.className = 'swiper-slide';
    slideElement.innerHTML = `
      <a href="${slide.link}" class="block w-full h-full">
        <img src="${slide.img}" alt="${slide.title}" class="w-full h-full object-cover">
        <div class="absolute bottom-0 w-full h-[40%] bg-black bg-opacity-50 flex flex-col justify-center px-4">
          <h3 class="text-white text-2xl font-bold mb-2">${slide.title}</h3>
          <p class="text-white text-base">${slide.desp}</p>
        </div>
      </a>
    `;
    swiperWrapper.appendChild(slideElement);
  });

  // Swiper 配置
  const swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    speed: 800,
  });

  // 重置定时器
  function resetAutoplay() {
    swiper.autoplay.stop();
    swiper.autoplay.start();
  }

  // 点击导航按钮时重置定时器
  document.querySelector('.swiper-button-next').addEventListener('click', resetAutoplay);
  document.querySelector('.swiper-button-prev').addEventListener('click', resetAutoplay);
}

// 确保 DOM 加载完成
document.addEventListener('DOMContentLoaded', initSwiper);
