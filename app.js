var swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    initialSlide: 2,
    speed: 600,
    preventClicks: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 0,
        stretch: 80,
        depth: 350,
        modifier: 1,
        slidesShadows: true,
    },

    on: {
        click(event) {
            const index = this.clickedIndex;
            swiper.slideTo(index);

            document.querySelectorAll('.swiper-slide').forEach(slide => {
                slide.classList.remove('selected');
            });

            const selectedSlide = document.querySelectorAll('.swiper-slide')[index];
            if (selectedSlide) {
                selectedSlide.classList.add('selected');
            }
        }
    },

    pagination: {
        el: ".swiper-pagination",
    },
});

swiper.on('slideChange', () => {
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.classList.remove('selected');
    });

    const activeSlide = document.querySelectorAll('.swiper-slide')[swiper.realIndex];
    if (activeSlide) {
        activeSlide.classList.add('selected');
    }
});

function storeSelectedSign() {
    const activeIndex = swiper.realIndex;
    const activeSlide = document.querySelectorAll('.swiper-slide')[activeIndex];

    if (!activeSlide) {
        console.warn("No active slide found.");
        alert("Please select a zodiac sign before continuing!");
        return;
    }

    const span = activeSlide.querySelector('.title span');

    if (span) {
        const signName = span.textContent.trim();
        localStorage.setItem('selectedZodiac', signName);
        console.log("Stored:", signName);

        // Redirect only after successful storage
        window.location.href = 'quiz.html';
    } else {
        console.warn("No zodiac sign found on selected slide.");
        alert("Please select a zodiac sign before continuing!");
    }
}

const startBtn = document.getElementById('startQuizBtn');
startBtn.addEventListener('click', storeSelectedSign);
