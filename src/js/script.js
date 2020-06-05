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

    sliderRight.addEventListener('click', () => {
        if(offset == (+widthSlide.slice(0, widthSlide.length-2)*(sliderImgs.length-1))){
            offset = 0;
        } else {
            offset += +widthSlide.slice(0, widthSlide.length-2)
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == sliderImgs.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (sliderImgs.length < 10) {
            currentNumSlider.textContent =  `0${slideIndex}`;
        } else {
            currentNumSlider.textContent =  slideIndex;
        }

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

        if (sliderImgs.length < 10) {
            currentNumSlider.textContent =  `0${slideIndex}`;
        } else {
            currentNumSlider.textContent =  slideIndex;
        }

    });
    


    //обычный слайдер

    // let slideIndex = 1;

    // showCurrentSlider(slideIndex);

    // if (sliderImgs.length < 10) {
    //     totalNumSlider.textContent =  `0${sliderImgs.length}`;
    // } else {
    //     totalNumSlider.textContent =  sliderImgs.length;
    // }


    // function showCurrentSlider(n) {
    //     if(n > sliderImgs.length){slideIndex = 1;}

    //     if (n < 1){ slideIndex = sliderImgs.length; }

    //     sliderImgs.forEach((item, i) => {
    //             if(i == slideIndex -1){
    //             item.classList.add('show');
    //             item.classList.remove('hide');
    //             } else {
    //                 item.classList.remove('show');
    //                 item.classList.add('hide');
    //             }
    //         });

    //     if (sliderImgs.length < 10) {
    //         currentNumSlider.textContent =  `0${slideIndex}`;
    //     } else {
    //         currentNumSlider.textContent =  slideIndex;
    //     }
    // }

    // function changeSlider(i){
    //     showCurrentSlider(slideIndex += i);
    // }

    
    // sliderRight.addEventListener('click', () =>{
    //     changeSlider(1);
    //     });
    // sliderLeft.addEventListener('click', () =>{
    //     changeSlider(-1);
    //     });
         
    //мой первый вариант слайдера

    // let index = 0;
    // document.querySelector('#total').textContent = "0" + totalNumSlider;

    // function showCurrentSlider(){
    //     sliderImgs.forEach((item, i) => {
    //     if(i == index){
    //     item.classList.add('show');
    //     item.classList.remove('hide');
    //     currentNumSlider.textContent = '0'+ (index+1);
    //     } else {
    //         item.classList.remove('show');
    //         item.classList.add('hide');
    //     }
    //     });
    // }

    // showCurrentSlider();

    

    // sliderRight.addEventListener('click', () => {
    //     console.log(index);
    //     index += 1;
    //     if(index > totalNumSlider-1){
    //         index = 0;
    //     }
    //     showCurrentSlider();
    // });

    // sliderLeft.addEventListener('click', () => {
    //     console.log(index);
    //     index -= 1;
    //     if(index < 0){
    //         index = totalNumSlider-1;
    //     }
    //     showCurrentSlider();
    // });


});