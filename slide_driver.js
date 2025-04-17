// 数据源
const slideLists = [
  { title: 'NTQQ liteloader插件教程', desp: '新手向,通过学习一些最佳实践得出编写liteloaderQQNT插件的经验心得',
       link: '/2025/04/ntqq-liteloader-noobs-liteloader-explore.html',
       img: 'https://i.postimg.cc/59L5ksmK/1.png' 
  },
  { title: 'simpleTex WebAPI', desp: '一个借用SimpleTex解决在线Tex文档识别的方案',
       link: '/2024/03/simpletex-webapi.html', 
       img: 'https://i.postimg.cc/xTNQ2SB3/image.png' 
  },
  { title: '标题三', desp: '这是第三张幻灯片的描述', 
       link: '#', 
       img: 'https://i.postimg.cc/qqs83FdM/image.png'
  }
];

// 1) 构建 DOM
const wrapper = document.querySelector('.swiper-wrapper');
slideLists.forEach(item => {
  const slide = document.createElement('div');
  slide.className = 'swiper-slide';
  slide.innerHTML = `
    <a href="${item.link}" style="display:block; width:100%; height:100%; position:relative;">
      <img src="${item.img}" alt="${item.title}">
      <div class="slide-overlay"></div>
      <div class="slide-content">
        <h2>${item.title}</h2>
        <p>${item.desp}</p>
      </div>
    </a>
  `;
  wrapper.appendChild(slide);
});

// 2) 初始化 Swiper
 const swiper = new Swiper('.swiper-container', {
    // —— 强制横向滑动
    direction: 'horizontal',

    // —— 每页只显示 1 张
    slidesPerView: 1,
    slidesPerGroup: 1,

    // —— 幻灯片之间不留空隙
    spaceBetween: 0,

    // —— 循环模式
    loop: true,

    // —— 切换动画持续时间（ms）
    speed: 600,

    // —— 自动播放，每 4 秒切换；点击后不会停，而是重置计时
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },

    // —— 前后按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });

// （Swiper 的 autoplay + disableOnInteraction 已经满足“点击重置定时器”的需求）
