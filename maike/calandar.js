

var calandar = function(year, month, day, el){
    this.year = year;
    this.month = month;
    this.day = day;
    this.fragment = document.createDocumentFragment();
    this.html = null;
    this.el = el;
    this.init();
    this.bindClick();
}

calandar.prototype.init = function(){
     // 通过获取上月最后一月的方式获取当月多少天
     var curMonthDays = new Date(year, month+1, 0).getDate();
    for(var i = 1; i <= curMonthDays; i++){
        var li = document.createElement('li');
        li.innerText = i;
        li.setAttribute("data-day", i);
        if(day === i) {
            li.style.border="1px solid red";
        }
        this.fragment.appendChild(li);
    }

    this.html = document.createElement('ul');
    this.html.appendChild(this.fragment);
    if(this.el.nextSibling){
        this.el.nextSibling.insertBefore(this.html);
    }else{
        this.el.parentNode().appendChild(this.html);
    }   
}

calandar.prototype.bindClick = function(){
    this.html.addEventListener('click', function(e){
        var day = e.originTarget.getAttribute('data-day');
        alert(`${this.year}-${this.month}-${day}`);
    });
}
