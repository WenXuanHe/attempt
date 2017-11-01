var layoutStr = "[1|1|1|1]-[1|1|1]-[1|1|1]-[1|1|1]-";
var myJson = {
        "purpose_grade": "高级web前端工程师",
        "purpose_type": "全职",
        "purpose_city": "北京",
        "purpose_availableTime": "一个月之内",
        "purpose_pay": "20k",
        "education1_time":"2011.9~2015.7",
        "education1_school": "成都信息工程大学",
        "education1_major":"电子科学与技术",
        "education1_describe": "学习了c语言，数据库，数据结构等软件编程基础；还有诸如单片机，模电，数电等硬件基础",
        "experience1_time":"2014.10-2017.3",
        "experience1_company":"四川我要去哪儿科技有限公司",
        "experience1_grade":"中级web前端工程师",
        "experience1_describe":"早期独立完成前端PC国内机票的预定，改签流程；随后率先主导公司移动端html5页面的开发，部署工作。同时整理开发过程遇到的问题，向全组推广移动端开发经验，帮助其他人迅速上手;后期独立负责移动端火车票预订流程的开发和维护，将整个流程的性能优化50%以上。",
        "experience2_time": "2017.3-至今",
        "experience2_company":"逸创云客服",
        "experience2_grade":"高级web前端工程师",
        "experience2_describe":"参与公司基于Ember的工单项目的重构，提升项目的可重用性和可扩展性；同时还参与基于react的聊天窗口组件的重构和维护，将聊天窗口组件兼容到ie8及其以上，解决大量ie下的bug，为公司大量使用ie的客户提供支持。"
}; 

var generPaper = function(layoutStr, json){
    this.json = json;
    this.index = 0;
    this.fragment = document.createDocumentFragment();
    this.getText = function(index){
        return this.json[Object.keys(this.json)[index]];
    }

    this.layoutStr.split(/(?=[-\\[])/g).forEach(function(element) {
        this.display(str);
    }, this);



}
generPaper.prototype.createEle = function(text){
    var div = document.createElement('div');
    div.innerHTML = text;
    return div;
}
generPaper.prototype.display = function(str){

    var sizeReg = /\d/g;
    var self = this;
    /**
     * 两种情况 
     * 1. -  独占一行
     * 2. [1...] 多个共占一行
     */
    if(str === "-"){
        this.fragment.appendChild(this.createEle(this.getText(this.index++)));
    }else{
        let contain = this.createEl();
        contain.style.display="flex";
        str.replace(sizeReg, function(size){
            let div = self.createEle(self.createEle(self.getText(self.index++))); 
            div.style.flex = size;
            contain.appendChild(div);
        });
        this.fragment.appendChild(contain);
    }

}

var paper = new generPaper(layoutStr, myJson);
document.body.appendChild(paper.fragment);