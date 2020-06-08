function timer(){
        //timer
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
    

}

module.exports = timer;

