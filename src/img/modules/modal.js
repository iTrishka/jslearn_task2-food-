function modal(){
    
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

}

module.exports = modal;