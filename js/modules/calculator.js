function calculator (){
    const result = document.querySelector('.calculating__result span');

    let sex = 'female', height, weight, age, ratio = 1.375;

    if (localStorage.getItem('sex')){
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', sex);
    }

    if (localStorage.getItem('ratio')){
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = '1.375';
        localStorage.setItem('ratio', ratio);
    }


    function initLocalSettings(selector, activeClass){
        const elements = document.querySelectorAll(selector);
        elements.forEach(element =>{
            element.classList.remove(activeClass);
            if (element.getAttribute('id') === localStorage.getItem('sex')){

                element.classList.add(activeClass);

            }
            if (element.getAttribute('data-ratio') === localStorage.getItem('ratio')){

                element.classList.add(activeClass);

            }


        });
    }
    initLocalSettings("#gender div", "calculating__choose-item_active");
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calculateTotal(){

        if (!sex || !height || !weight || !age || !ratio){
            result.textContent = "0";
            return ;
        }

        if (sex === 'female'){
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height)-(4.3 * age)) * ratio) + [] ;
        }else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height)-(5.7 * age)) * ratio) + [] ;
        }

    }
    calculateTotal();

    function getStaticInformation(selector, activeClass){
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem =>{
            elem.addEventListener('click', (event)=>{

                if(event.target.getAttribute('data-ratio')){
                    ratio = +event.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio)
                }else {

                    sex = event.target.getAttribute('id');
                    localStorage.setItem('sex', sex);

                }

                elements.forEach(element =>{
                    element.classList.remove(activeClass);
                });

                event.target.classList.add(activeClass);
                calculateTotal();
            });



        });

    }

    getStaticInformation("#gender div", "calculating__choose-item_active");
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector){

        const input = document.querySelector(selector);

        input.addEventListener('input', ()=>{

            if (input.value.match(/\D/g)){
                input.style.border = '1px solid red';
            }else {
                input.style.border = 'none';
            }


            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
        });
        calculateTotal();

    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');

}

module.exports = calculator;