const prev = document.querySelector('.btn-prev');
const next = document.querySelector('.btn-next');
const elements = document.querySelector('.elements');
const dots = document.querySelector('.dots');
const progress = document.querySelector('.progress');

// налаштування слайдера
const settings = {
    withDots: false, // false - без точок
    autoChange: false, // false - без автозміни слайдів
    autoChangeTime: 5, // сек - час для зміни слайду
    progressBarType: 'dots', // full або dots - тип прогрес-бару
    progressBarHeight: '5px', // висота прогрес-бару
    progressBarColor: 'rgb(255, 0, 0)', // колір прогрес-бару
    startFrom: 0, // початковий слайдер
}
// ===

let pw = 0;
let timerId = null;
// ширина слайду
let width = elements.offsetWidth;
elements.style.transform = 'translateX(-' + (settings.startFrom * width  )  +'px)';


if (settings.withDots) {
    drawDots();

    [...dots.children].forEach((element, index) => {
        element.addEventListener('click', () => {
            settings.startFrom = index - 1;
            swap();
        });
    });
}

if (settings.autoChange) {
    progressDraw();
}


window.addEventListener('resize', () => {
    width = elements.offsetWidth;
    elements.style.transform = 'translateX(-' + settings.startFrom * width + 'px)';

    if (settings.autoChange) {
        progressDraw();
    }
})

prev.addEventListener('click', () => {
    swap('prev');
});

next.addEventListener('click', () => {
    swap('next');
});



// переключити слайди
function swap(direction) {
    clearInterval(timerId);
    
    if (direction === 'prev') {                                                
        if (settings.startFrom === 0) {                                        
            settings.startFrom = elements.children.length - 1;                 
        } else {                                                                
            settings.startFrom--;                                             
        }
    } else {                                                                  
        if (settings.startFrom === elements.children.length -1) {                  
                settings.startFrom = 0;                                      
        } else {
        settings.startFrom++;                                                   
        }
    }

    

    elements.style.transform = 'translateX(-' + settings.startFrom * width  + 'px)';

    if (settings.withDots) {
        const prw = document.querySelectorAll('.li-progress');

        for (let i = 0; i < dots.children.length; i++) {
            dots.children[i].classList.remove('active');
            prw[i].style.width = 0;
        }
        dots.children[settings.startFrom].classList.add('active');
    }

    if (settings.autoChange) {
        progressDraw();
    }
}

// змінює прогрес
function progressDraw() {
    pw = 0;
    clearInterval(timerId);

    const pb = document.querySelector('#progress-inner');
    const liProgress = document.querySelector('#li-progress-' + settings.startFrom);

    if (settings.progressBarType === 'full') {
        progress.style.backgroundColor = settings.progressBarColor;
        progress.style.zIndex = 100;
    } else if (settings.progressBarType === 'dots') {
        pb.style.backgroundColor = settings.progressBarColor;
        pb.style.height = settings.progressBarHeight;

        liProgress.style.backgroundColor = settings.progressBarColor;
    }

    timerId = setInterval(() => {
        pw++;

        if (settings.progressBarType === 'full') {
            progress.style.width = pw + '%';
        } else if (settings.progressBarType === 'dots') {
            liProgress.style.width = pw + '%';
        }

        if (pw === 100) {
            swap();
            pw = 0;
        }
    }, (settings.autoChangeTime * 1000) / 100);
}

// добавити точки
function drawDots() {
    for (let i = 0; i < elements.children.length; i++) {
        const li = document.createElement('li');
        const pr = document.createElement('div');
        li.style.backgroundImage = 'url(./img/' + (i + 1) + '.jpg)';
        pr.classList.add('li-progress');
        pr.id = 'li-progress-' + i;

        if (i === settings.startFrom) {
            li.classList.add('active');
        }
        li.appendChild(pr);
        dots.appendChild(li)
    }
}