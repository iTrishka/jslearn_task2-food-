function slider(){
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

}

module.exports = slider;