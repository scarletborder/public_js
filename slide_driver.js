console.log('slide sloader')
document.addEventListener('DOMContentLoaded', function() {
    console.log('slide drive')
    // 初始化变量
    const slider = document.querySelector('.fp-slider');
    const slides = document.querySelectorAll('.fp-slides-items');
    const nextBtn = document.querySelectorAll('.fp-next');
    const prevBtn = document.querySelectorAll('.fp-prev');
    const pagerContainer = document.querySelector('.fp-pager');
    
    let currentSlide = 0;
    let slideInterval;
    const autoPlayDelay = 5000; // 自动轮播间隔，5秒
    
    // 初始化分页指示器
    function initPager() {
        pagerContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const pager = document.createElement('a');
            pager.href = '#';
            pager.dataset.index = index;
            pager.addEventListener('click', function(e) {
                e.preventDefault();
                goToSlide(parseInt(this.dataset.index));
            });
            pagerContainer.appendChild(pager);
        });
    }
    
    // 显示指定幻灯片
    function showSlide(index) {
        // 隐藏所有幻灯片
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // 显示当前幻灯片
        slides[index].style.display = 'block';
        
        // 更新分页指示器
        const pagers = pagerContainer.querySelectorAll('a');
        pagers.forEach((pager, idx) => {
            pager.classList.toggle('active', idx === index);
        });
        
        // 更新当前幻灯片索引
        currentSlide = index;
    }
    
    // 跳转到指定幻灯片
    function goToSlide(index) {
        // 确保索引在有效范围内
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        // 使用平移动画切换幻灯片
        const slideContainer = document.querySelector('.fp-slides-container');
        slideContainer.style.transform = `translateX(-${index * 930}px)`; // 每张幻灯片宽度为930px

        resetTimer(); // 重置自动播放计时器
    }
    
    // 下一张幻灯片
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // 上一张幻灯片
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // 开始自动播放
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    // 停止自动播放
    function stopAutoPlay() {
        clearInterval(slideInterval);
    }
    
    // 重置自动播放计时器
    function resetTimer() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // 添加事件监听器
    nextBtn.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
            resetTimer(); // 重置定时器
        });
    });
    
    prevBtn.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
            resetTimer(); // 重置定时器
        });
    });
    
    // 鼠标悬停时暂停自动播放
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    
    // 触摸事件处理（移动端支持）
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });
    
    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });
    
    function handleSwipe() {
        const threshold = 50; // 最小滑动距离
        if (touchEndX < touchStartX - threshold) {
            // 左滑 -> 下一张
            nextSlide();
        } else if (touchEndX > touchStartX + threshold) {
            // 右滑 -> 上一张
            prevSlide();
        }
    }
    
    // 初始化
    initPager();
    showSlide(0);
    startAutoPlay();
});
