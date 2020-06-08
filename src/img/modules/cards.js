function cards(){
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

}

module.exports = cards;