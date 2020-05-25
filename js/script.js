document.addEventListener('DOMContentLoaded', function(){
    var button = document.getElementById('go');
    var xmin = document.getElementById('minGran');
    var xmax = document.getElementById('maxGran');
    var blockForResult = document.getElementById('result');
    var h = document.getElementById('step'), y0 = document.getElementById('firstY');
    var inputWithFunction = document.getElementById('func');
    var methods = document.getElementsByClassName('mothods');
    var inputs = document.getElementsByClassName('inputs');
    var allFuncVers = document.getElementsByClassName('allFuncVers')[0];
    var table = document.getElementsByTagName('table')[0];
    var val = '';
    var totalFunc;

    for(var i = 0; i < inputs.length; i++){
        inputs[i].addEventListener('blur', function(){
            if(this.value == "" || this.value == " "){
                this.setAttribute('data-check', 'false');
            }
            else{
                this.setAttribute('data-check', 'true');
            }
            checkInputsField();
        })
    }
    for(var i = 0; i < methods.length; i++){
        methods[i].addEventListener('click', () => {
            checkRadioFuncField()
        })
    }
    function checkInputsField(){
        var count = 0;
        for(var i = 0; i < inputs.length; i++){
            if(inputs[i].getAttribute('data-check') == 'true'){
                count+= 1;
            }
        }
        if(count == 5){
            allFuncVers.style.display = 'flex';
        }
        else{
            allFuncVers.style.display = 'none';
        }
    }
    function checkRadioFuncField(){
        var checked = false;
        for(var i = 0; i < methods.length; i++){
            if(methods[i].checked){
                checked = true;
            }
        }
        if(checked){
            button.style.display = 'block';
        }
        else{
            button.style.display = 'none';
        }
    }
    inputWithFunction.addEventListener('blur', () => {
        val = inputWithFunction.value;
        var str1 = ['sin', 'cos', 'arcsin', 'arccos', 'arctg', 'arcctg', 'PI', 'ctg', 'tg'];
        var str2 = ['sin', 'cos', 'asin', 'acos', 'atan', 'atan2', 'PI', 'tan2', 'tan'];
        for(var i = 0; i < str1.length; i++){
            var reg = new RegExp(str1[i], 'gi');
            val = val.replace(reg, 'Math.' + str2[i]);
        }
        var reg2 = /\(+(\w|\W)+\)+\^\(+(\w|\W)+\)+/gi;
        if(reg2.test(val)){
            var arr = val.match(reg2);
            var arr1 = arr[0].split(/\^/g);
            val = val.replace(reg2, 'Math.pow(' + arr1[0] + ',' + arr1[1] + ')');
        }
        totalFunc = new Function('x', 'y', 'return '+ val);
    })
    
    function Eiler(xmin, xmax, y0, h, func){
        var x = [], y = [];
        x[0] = xmin; y[0] = y0;
        for(var i = 1; i <= ((xmax-xmin)/h)+1; i++){
            x[i] = x[i-1] + h;
            y[i] = y[i-1] + h * func(x[i-1], y[i-1]);
            blockForResult.innerHTML = `${blockForResult.innerHTML}x[${i-1}]  = ${x[i-1].toFixed(3)}, y[${i-1}] = ${y[i-1].toFixed(3)}<br>`;
        }
    }
    function EilerKoshi(xmin, xmax, y0, h, func){
        var x = [], y = [], y1 = [];
        x[0] = xmin; y[0] = y0;
        for(var i = 1; i <= ((xmax-xmin)/h)+1; i++){
            x[i] = x[i-1] + h;
            y1[i] = y[i-1] + h * func(x[i-1], y[i-1]);
            y[i] = y[i-1] + h*(func(x[i-1], y[i-1]) + func(x[i], y1[i]))/2;
            blockForResult.innerHTML = `${blockForResult.innerHTML}x[${i-1}]  = ${x[i-1].toFixed(3)}, y[${i-1}] = ${y[i-1].toFixed(3)}<br>`;
        }
    }
    function RungeKutta(xmin, xmax, y0, h, func){
        var x = [], y = [], k1 = [], k2 = [], k3 = [], k4 = [], y1 = [];
        x[0] = xmin; y[0] = y0;
        for(var i = 0; i <= ((xmax-xmin)/h); i++){
            if(i != 0){
                x[i] = x[i-1] + h;
            }
            y[i+1] = y[i] + h * func(x[i], y[i]);
            k1[i] = h * func(x[i], y[i]);
            k2[i] = h * func((x[i] + h/2), (y[i] + k1[i]/2));
            k3[i] = h * func((x[i] + h/2), (y[i] + k2[i]/2));
            k4[i] = h * func((x[i] + h), (y[i] + k3[i]));
            y1[i] = y[i] + (1/6)*(k1[i] + 2*k2[i] + 2*k3[i] + k4[i]);
            blockForResult.innerHTML = `${blockForResult.innerHTML}x[${i}]  = ${x[i].toFixed(3)}, y[${i}] = ${y1[i].toFixed(3)}<br>`;
        }
    }
    button.addEventListener('click', function(){
        var checkFunc = false;
        if(/x{1,}/gi.test(inputWithFunction.value) && /y{1,}/gi.test(inputWithFunction.value)){
            checkFunc = true;
        }
        else{
            checkFunc = false;
        }
        blockForResult.innerHTML = "";
        if(checkFunc){
            table.style.animationDuration = "1s";
            table.style.animationName = "toTop";
            table.style.webkitAnimationFillMode = "forwards";
            blockForResult.style.display = "block";
            if(methods[0].checked){
                Eiler(+xmin.value, +xmax.value, +y0.value, +h.value, totalFunc);
            }
            else if(methods[1].checked){
                EilerKoshi(+xmin.value, +xmax.value, +y0.value, +h.value, totalFunc);
            }
            else if(methods[2].checked){
                RungeKutta(+xmin.value, +xmax.value, +y0.value, +h.value, totalFunc);
            }
        }
        else{
            alert("В рівняні немає Х або Y");
            table.style.animationDuration = "1s";
            table.style.animationName = "toCenter";
            table.style.webkitAnimationFillMode = "forwards";
            button.style.display = 'none';
            blockForResult.style.display = "none";
        }
    })





})