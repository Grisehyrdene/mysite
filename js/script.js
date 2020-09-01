window.addEventListener('DOMContentLoaded', () => {


    // tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {

        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {

            item.classList.remove('tabheader__item_active');

        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target,
            contains = target.classList.contains('tabheader__item');
        if (target && contains) {

            tabs.forEach((item, index) => {

                /* target возвращает элемент, на который в данный момент мы нажали.
                * потом при помощи функции forEach, мы перебираем весь массив, при этом,
                * в index запоминается номер элемента. И если они совпали, то
                * скрывается весь предыдущий контент и вызывается функция, которая
                * показывает элемент по индексу.
                * */

                if (target === item) {
                    hideTabContent();
                    showTabContent(index);
                }
            });

        }

    });

    // timer
    const deadline = '2020-08-29';

    function getTimeRemaining(endtime) {

        if ((Date.parse(endtime) - Date.parse(new Date())) <= 0) {
            return {
                'total': 0,
                days: 0, hours: 0, minutes: 0, seconds: 0
            }
        }

        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor(t / (1000 * 60 * 60) % 24),
            minutes = Math.floor(t / (1000 * 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            days, hours, minutes, seconds
        }

    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);


    // Modal

    // Открыть окно
    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        // Запрещает двигаться заднему фону
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    // Закрыть окно
    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        // Разрешает двигаться заднему фону
        document.body.style.overflow = '';
    }

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    // Здесь мы перебираем все кнопки и навешиваем на них обработчики событий
    modalTrigger.forEach(element => {
        element.addEventListener('click', () => {
            openModal();
        });
    });




    // Добавляем функционал закрытия окна при клике за пределами модального окна
    modal.addEventListener('click', event => {
        if (event.target === modal || event.target.getAttribute('data-close') === '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {

        if (event.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }

    });

    const modalTimerId = setTimeout(openModal, 1500);

    function showModalByScroll() {
        if (window.pageYOffsest + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);


// menu


    class Menu {
        constructor(src,alt,title, content, price,parentSelector, ...classes) {
            this.title = title;
            this.content = content;
            this.price = price;
            this.src = src;
            this.alt = alt;
            this.transfer = 27;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {

            const element = document.createElement('div');
            if (this.classes.length === 0){
                this.element = "menu__item";
                element.classList.add(this.element);
            }
            else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `

     <img src=${this.src}  alt=${this.alt}>
          <h3 class="menu__item-subtitle">${this.title}</h3>
              <div class="menu__item-descr">${this.content}</div>
              <div class="menu__item-divider"></div>
              <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
     <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                    
            `;
            this.parent.append(element);
        }


    }

    const getResource = async (url) =>{
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${await (res.status)}`);
        }

        return await res.json();
    };


    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) =>{
                new Menu(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
      'loading':"img/spinner/spinner.svg",
      'success':"Спасибо, скоро мы с Вами свяжемся.",
       'fail': "Что-то пошло не так"
    };

    forms.forEach(item =>{
        bindPostData(item);
    });


    const postData = async (url, data) =>{

        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body:  JSON.stringify(data)
        });

        return await res.json();
    };


    function bindPostData(form){
        form.addEventListener('submit', (event)=>{
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;


            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = Object.fromEntries(formData.entries());


            postData('http://localhost:3000/requests', json)
                .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(()=>{
                showThanksModal(message.fail);
            }).finally(()=>{
                form.reset();
            });

        });
    }

    function showThanksModal(message){
        const previousModalDialog = document.querySelector('.modal__dialog');

            previousModalDialog.classList.add('hide');
            openModal();

            const thanksModal = document.createElement('div');
            thanksModal.classList.add('modal__dialog');
            thanksModal.innerHTML = `
            
            <div class="modal__content">
            
            <div class="modal__close" data-close >×</div>
            <div class="modal__title">${message}</div>
            
            </div>
            `;

            document.querySelector('.modal').append(thanksModal);
            setTimeout(()=>{
                thanksModal.remove();
                previousModalDialog.classList.add('show');
                previousModalDialog.classList.remove('hide');
                closeModal();
            },4000);

    }

    // slider

    const sliders = document.querySelectorAll('.offer__slide'),
        next = document.querySelector('.offer__slider-next'),
        prev = document.querySelector('.offer__slider-prev'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slideWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slideWrapper).width;

    let slideIndex = 1;
    let offset = 0;







slidesField.style.width = 100 * sliders.length + "%";
slidesField.style.display = 'flex';
slidesField.style.transition = '0.5s all';


slideWrapper.style.overflow = 'hidden';



sliders.forEach(slide =>{
    slide.style.width = width;
});


next.addEventListener('click', ()=>{
    // удаляем px и преобразуем в число
    if (offset === +width.slice(0, width.length - 2) * (sliders.length - 1)){ // width = 500px
        offset = 0;
    }else {
        offset += +width.slice(0, width.length - 2);
    }

   slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex === sliders.length){
        slideIndex = 1;
    }else {
        slideIndex += 1;
    }

    if(sliders.length < 10){
        current.textContent = `0${slideIndex}`;
    }else {
        current.textContent = slideIndex;
    }

});

    prev.addEventListener('click', () => {

        if (offset === 0) {
            offset = +width.slice(0, width.length - 2) * (sliders.length - 1);

        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex === 1){
            slideIndex = sliders.length;
        }else {
            slideIndex -= 1;
        }

        if(sliders.length < 10){
            current.textContent = `0${slideIndex}`;
        }else {
            current.textContent = slideIndex + 1;
        }

    });

/*
    showSliders(1);

    if(sliders.length < 10){
        total.textContent = `0${sliders.length}`;
    }else {
        total.textContent = sliders.length;
    }


   function showSliders(n){
       if (n < 1){
           slideIndex = sliders.length;
       }
       if (n > sliders.length){
           slideIndex = 1;
       }

       // скрыть все слайды на странице.
       sliders.forEach(slide => slide.style.display = 'none');

       sliders[slideIndex - 1].style.display = 'block';

       if (slideIndex < 10){
           current.textContent = `0${slideIndex}`;
       }else {
           current.textContent = slideIndex;
       }

   }

   function plusSlides(n){
       showSliders(slideIndex += n);
   }

    next.addEventListener('click', ()=>{
        plusSlides(1);
    })

    prev.addEventListener('click', ()=>{
        plusSlides(-1);
    })

*/


});




