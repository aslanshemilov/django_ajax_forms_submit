(function (root, factory) {
root.DAF = root.DAF || {};
if (typeof define === 'function' && define.amd){
    define(['underscore'], function(_){
    return root.DAF.Templates = factory(_);
    });
}else{
    root.DAF.Templates = factory(root._);
}}(this, function($){

//define(['underscore'], function(_){
    var failTemplate = _.template('<li class="alert alert-error"><%= error %></li>');
    var doneTemplate = _.template('<li class="alert alert-success"><%= name%> has been created </li>');

    var templates = {
        failTemplate: failTemplate,
        doneTemplate: doneTemplate
    };

    return templates;
//});
}));