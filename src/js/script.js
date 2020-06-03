// 'use strict';

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
        constructor(name, text, img, alt, price, parentSelector){
            this.name = name;
            this.text = text;
            this.img = img;
            this.alt = alt;
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
                    <img src="img/tabs/${this.img}" alt="${this.alt}">
                    <h3 class="menu__item-subtitle">Меню "${this.name}"</h3>
                    <div class="menu__item-descr">"${this.text}"</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;

            this.parent.append(div);
        }
    }

    const fitMenuText = 'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!';

    const premMenuText = 'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!';

    const postMenuText = 'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.';



    // const fitmMenu = new Card('Фитнес', fitMenuText, 'elite.jpg', 'fit', 229, '.menu-container');
    // fitmMenu.createCards();
    // const premMenu = new Card('Премиум', premMenuText, 'elite.jpg','elit', 550, '.menu-container');
    // premMenu.createCards();
    // const postMenu = new Card('Постный', postMenuText, 'post.jpg', 'post', 480, '.menu-container');
    // postMenu.createCards();

    new Card(
        'Фитнес', 
        fitMenuText, 
        'elite.jpg', 
        'fit', 
        9, 
        '.menu .container'
        ).createCards();

    new Card('Премиум', premMenuText, 'elite.jpg','elit', 550, '.menu .container').createCards();
    new Card('Постный', postMenuText, 'post.jpg', 'post', 480, '.menu .container').createCards();

//  отправка запрсоов

const forms1 = document.querySelectorAll("form");

const message = {
    loading: "img/form/spinner.svg",
    sucsess: "Спасибо! В ближайшее время мы вам перезвоним!",
    failure: "Что-то пошло не так"
};

forms1.forEach(item => {
    postData(item);
    console.log(item);
});

function postData(form) {
    form.addEventListener('submit', (e) =>{
        console.log('Кнопка нажата');
        e.preventDefault();

        let statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.style.cssText = `
            display: block;
            margin: 0 auto
        `;
        form.insertAdjacentElement('afterend', statusMessage);
        // statusMessage.classList.add('status');
        // statusMessage.textContent = message.loading;
        // form.append(statusMessage);

        const req = new XMLHttpRequest();
        req.open("POST", "js/server.php");
        req.setRequestHeader("Content-type", "application/json");

        const formData = new FormData(form);
        const object = {};

        formData.forEach((value, key) =>{
            object[key] = value;
        });

        const json = JSON.stringify(object);

        req.send(json);
        req.addEventListener('load', () => {
            if(req.status == 200){
                console.log(req.response);
                showThanksModal(message.sucsess);
                statusMessage.remove();
                form.reset();
                // statusMessage.textContent = message.sucsess;
                // form.reset();
                // setTimeout(() => statusMessage.remove(), 2000);
            }else 
            { showThanksModal(message.failure);
            }
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

});
