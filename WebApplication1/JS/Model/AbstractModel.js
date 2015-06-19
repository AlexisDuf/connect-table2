function AbstractModel() {
    this.views = new Array();
}

AbstractModel.prototype.fireEvent= function(functionName, ev){
    for (var i =0; i < this.views.length; i++){
        if(this.views[i][functionName] != undefined){
            this.views[i][functionName](ev);
        }
    }
}