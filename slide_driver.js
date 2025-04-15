document.addEventListener('DOMContentLoaded', function() {
    // 获取所有幻灯片（注意：这里只查找类名为 fp-slides-items 的元素）
    var slides = document.querySelectorAll('.fp-slides-items');
    var currentSlide = 0;
    var slideCount = slides.length;
    
    // 获取所有“下一页”和“上一页”按钮（注意：这里用 querySelectorAll 查找所有的按钮）
    var nextButtons = document.querySelectorAll('.fp-next');
    var prevButtons = document.querySelectorAll('.fp-prev');
    
    // 获取分页指示器容器
    var fpPager = document.querySelector('.fp-pager');

    // 根据幻灯片数量动态生成分页指示器
    if (fpPager) {
        for (var i = 0; i < slideCount; i++) {
            var bullet = document.createElement('span');
            bullet.className = 'fp-page';
            bullet.dataset.index = i;
            bullet.style.cursor = 'pointer';
            bullet.style.marginRight = '5px';
            bullet.addEventListener('click', function() {
                currentSlide = parseInt(this.dataset.index, 10);
                showSlide(currentSlide);
            });
            fpPager.appendChild(bullet);
        }
    }

    // 更新分页指示器的样式，使当前页显示为 active
    function updatePager() {
        var bullets = document.querySelectorAll('.fp-page');
        bullets.forEach(function(bullet, i) {
            if (i === currentSlide) {
                bullet.classList.add('active');
                // 也可以手动设置样式，如改变背景色
                bullet.style.backgroundColor = '#333';
            } else {
                bullet.classList.remove('active');
                bullet.style.backgroundColor = '';
            }
        });
    }

    // 根据索引显示相应幻灯片，并隐藏其它幻灯片
    function showSlide(index) {
        slides.forEach(function(slide, i) {
            slide.style.display = i === index ? 'block' : 'none';
        });
        updatePager();
    }

    // 切换到下一页
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        showSlide(currentSlide);
    }

    // 切换到上一页
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        showSlide(currentSlide);
    }

    // 为“下一页”按钮绑定点击事件
    nextButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
        });
    });
    
    // 为“上一页”按钮绑定点击事件
    prevButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
        });
    });

    // 首次加载时显示第一张幻灯片
    showSlide(currentSlide);

    // 如果需要自动播放幻灯片，可以启用下面这段代码；这里设置每5秒自动切换一次
    setInterval(nextSlide, 5000);
});
