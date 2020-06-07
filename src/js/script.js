'use strict';

document.addEventListener('DOMContentLoaded', () => {

    //tabs

    const tabs = document.querySelectorAll(".tabheader__item"),
          tabsParent = document.querySelector(".tabheader__items"),
          tabsContent = document.querySelectorAll(".tabcontent");



    function hideTabContent() {
        tabsContent.forEach((item) => {
            item.style.display = 'none';
        });

        tabs.forEach( item => {
            item.classList.remove("tabheader__item_active");       
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')){

            tabs.forEach((item, i) => {
                if(target == item ){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }

    });


    //taimer

    const deadline = "2020-05-30";

    function getDifTime(endTime) {
        const t = Date.parse(endTime) - Date.parse(new Date()),
              days = Math.floor(t /(1000*60*60*24)),
              hours = Math.floor(t /(1000*60*60) % 24),
              minutes = Math.floor((t /1000/60) % 60),
              seconds = Math.floor((t /1000) % 60);

        return {
            'total' : t,
            'days' : days,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function addZero(num){
        if(num >= 0 && num < 10){
            return `0${num}`;
        } else {return num; }
    }

    function setClock(selector, endTime){
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'), 
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock(){
            const t = getDifTime(endTime);

            days.innerHTML = addZero(t.days);
            hours.innerHTML = addZero(t.hours);
            minutes.innerHTML = addZero(t.minutes);
            seconds.innerHTML = addZero(t.seconds);


            if(t.total <= 0){
                clearInterval(timeInterval);
            }
        }

    }

    setClock('.timer', deadline);


    //Modal

    const modalTriger = document.querySelectorAll('[data-modal]'),
          popupContainer = document.querySelector(".modal");
          

    modalTriger.forEach((item) => {
        item.addEventListener('click', openPopup);
    });

    function openPopup(){
        popupContainer.classList.add('show');
        popupContainer.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }
          

    function closePopup(){
        popupContainer.classList.add('hide');
        popupContainer.classList.remove('show');
        document.body.style.overflow = '';
    }


    popupContainer.addEventListener('click', (e) =>{
        // e.preventDefault();
        if(e.target.getAttribute('data-close') == "" || e.target ===  popupContainer){
            closePopup();
        }
    }); 
    
    document.addEventListener('keydown', (e) => {
        if(e.code === "Escape" && popupContainer.classList.contains('show')){
            closePopup();
        }
    });

    const modalTimerId = setTimeout(openPopup, 300000);

    function showModalByScroll() {
        if( window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openPopup();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    //Использование карточек

    class Card {
        constructor(img, altimg, title, descr, price, parentSelector){
            this.title = title;
            this.descr = descr;
            this.img = img;
            this.altimg = altimg;
            this.price = price;
            this.parent= document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price*this.transfer;
        }

        createCards(){
            const div = document.createElement("div");
            div.innerHTML = `
                <div class="menu__item">
                    <img src="${this.img}" alt="${this.altimg}">
                    <h3 class="menu__item-subtitle">Меню "${this.title}"</h3>
                    <div class="menu__item-descr">"${this.descr}"</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;

            this.parent.append(div);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);
        
        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };

    getResource('http://localhost:3000/menu')
    .then(data => {
        data.forEach(({img, altimg, title, descr, price}) =>{
            new Card(img, altimg, title, descr, price, '.menu .container').createCards();

        });

    });
    

    //  отправка запрсоов

    const forms1 = document.querySelectorAll("form");

    const message = {
        loading: "img/form/spinner.svg",
        sucsess: "Спасибо! В ближайшее время мы вам перезвоним!",
        failure: "Что-то пошло не так"
    };

    forms1.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST", 
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };


    function bindPostData(form) {
        form.addEventListener('submit', (e) =>{
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.sucsess);
                statusMessage.remove();
            })
            .catch(()=>{
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });
        });      
    }

    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');
    
        prevModalDialog.classList.add('hide');
        openPopup();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
            <div class="modal__close" data-close></div>
            <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector(".modal").append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closePopup();
        }, 4000);
    }

    // создание слайдера 

    const sliderImgs = document.querySelectorAll('.offer__slide'),
          sliderRight = document.querySelector('.offer__slider-next'),
          sliderLeft = document.querySelector('.offer__slider-prev'),
          currentNumSlider = document.querySelector('#current'),
          totalNumSlider = document.querySelector('#total'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider_inner'),
          widthSlide = window.getComputedStyle(slidesWrapper).width;

    // 2ой способ

    let slideIndex = 1,
        offset = 0;


    if (sliderImgs.length < 10) {
            totalNumSlider.textContent =  `0${sliderImgs.length}`;
            currentNumSlider.textContent =  `0${slideIndex}`;
        } else {
            totalNumSlider.textContent =  sliderImgs.length;
            currentNumSlider.textContent =  sliderImgs.length;
        }
    
    slidesField.style.width = 100 * sliderImgs.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transform = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    sliderImgs.forEach(slide => {
        slide.style.width = widthSlide;
    });


    function addZeroSlider(){
        if (sliderImgs.length < 10) {
            currentNumSlider.textContent =  `0${slideIndex}`;
        } else {
            currentNumSlider.textContent =  slideIndex;
        }
    }
    
      sliderRight.addEventListener('click', () => {
        if(offset == (+widthSlide.slice(0, widthSlide.length-2)*(sliderImgs.length-1))){
            offset = 0;
        } else {
            offset += +widthSlide.slice(0, widthSlide.length-2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == sliderImgs.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        addZeroSlider();        
        pickDotSlider();

    });

    sliderLeft.addEventListener('click', () => {
        if(offset == 0){
            offset = (+widthSlide.slice(0, widthSlide.length-2)*(sliderImgs.length-1));
        } else {
            offset -= +widthSlide.slice(0, widthSlide.length-2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = sliderImgs.length;
        } else {
            slideIndex--;
        }

        addZeroSlider();
        pickDotSlider();

    });


    //навигация для слайдера

    slidesWrapper.style.position = "relative";

    const navSliderBox = document.createElement('div');
    navSliderBox.classList.add('carousel-indicators');
    navSliderBox.style.cssText = `position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
    `;

    // navSliderBox.innerHTML = `<div class = "carousel-indicators"></div>`;
    slidesWrapper.append(navSliderBox);


    for(let i = 0; i < sliderImgs.length; i++){
        const dotSlider = document.createElement('div');
        dotSlider.setAttribute('data-slide-to', i+1);
        dotSlider.style.cssText = `box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin-right: 3px;
        margin-left: 3px;
        cursor: pointer;
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: .5;
        transition: opacity .6s ease;
        `;
         navSliderBox.append(dotSlider);
    }

    const dotSliders = document.querySelectorAll("[data-slide-to]");
    pickDotSlider();
    console.log(dotSliders);


    function pickDotSlider(){
        dotSliders.forEach((dot, i) => {
            if(i == slideIndex-1){
                dot.style.opacity = '70';
            } else {
                dot.style.opacity = '.5';
            }
        });
    }

    dotSliders.forEach(dot =>{
        dot.addEventListener('click', (e) =>{
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;

            offset = +widthSlide.slice(0, widthSlide.length-2)*(slideTo-1);
            
            slidesField.style.transform = `translateX(-${offset}px)`;

            addZeroSlider();
            pickDotSlider();
        });
    });


    //calc

    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio; 

    if(localStorage.getItem('sex')){
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if(localStorage.getItem('ratio')){
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }



    function getTotalKcal(){
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

       if(sex === 'female'){
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age))*ratio);
       } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age))*ratio);
       }
    }

    getTotalKcal();

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(`${selector}`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e)=>{
                console.log(e);
                console.log(e.target);
                if(e.target.getAttribute('data-ratio')){
                    ratio = e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);

                getTotalKcal();
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');


    function getDynamicInformation(selector){
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = "1px solid red";
            } else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) {
                case "height":
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }

            getTotalKcal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
    

});