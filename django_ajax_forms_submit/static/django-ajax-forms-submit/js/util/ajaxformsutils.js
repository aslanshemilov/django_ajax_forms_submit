(function (root, factory) {
root.DAF = root.DAF || {};
if (typeof define === 'function' && define.amd){
    define([], function(){
    return root.DAF.FormUtils = factory();
    });
}else{
    root.DAF.FormUtils = factory();
}}(this, function(){

    var cleanUpFn = function(){
        this.find('.alert').remove();
    };

    var clearInputs = function(){
        this.find(':input')
            .not(':button, :submit, :reset, :hidden')
            .val('')
            .removeAttr('checked')
            .removeAttr('selected');
    };

    var formUtils = {
        cleanUp: cleanUpFn,
        clearInputs: clearInputs
    };

    return formUtils;
//});
}));