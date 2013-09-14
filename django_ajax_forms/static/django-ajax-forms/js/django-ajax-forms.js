(function (root, factory) {
root.DAF = root.DAF || {};
if (typeof define === 'function' && define.amd){
    define(['jquery'], function($){
    return root.DAF.DjangoAjaxForm = factory($);
    });
}else{
    root.DAF.DjangoAjaxForm = factory(root.$);
}}(this, function($){
    //from Django docs
    var getCookie = function(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    var csrfSafeMethod = function(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    };

    var DjangoAjaxForm = function(options){

        var $target;
        var target;
        var $submit;

        var defaults = {
            fail: $.noop,
            cleanUp: $.noop,
            clearInputs: $.noop,
            done: $.noop,
            alwaysFunction: $.noop
        };

        options = options || {};
        options = $.extend(defaults, options);

        this.formSubmit = function(e, formOverride){
            e.preventDefault();
            $target = $(e.target);
            target = $target[0];
            $submit = $target.find('button[name=submit]');

            var formDefaults = {
                url: target.action,
                context: $submit,
                type: target.method,
                data: $target.serialize(),
                dataType: 'json',
                crossDomain: false,
                beforeSend: function(req, settings){
                    if(!csrfSafeMethod(settings.type)){
                        req.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                    }
                }
            };

            formOverride = $.extend(formDefaults, formOverride);

            var formSubmit = $.ajax(formOverride);

            formSubmit.done(function(d){
                options.cleanUp.apply($target);
                options.clearInputs.apply($target);
                options.done.apply($target, [d]);
            });

            formSubmit.fail(function(jqxhr){
                options.cleanUp.apply($target);
                var err;
                try{
                    err = JSON.parse(jqxhr.responseText);
                }catch(ex){
                    err = jqxhr.responseText;
                }
                options.fail.apply($target, [err, jqxhr]);
            });

            formSubmit.always(function(d){
                options.alwaysFunction.apply($target, [d]);
            });
        };

        this.addEvent = function(el, event, selector, formOverride){
            var $el = $(el);
            event = event + ".DAF";
            var that = this;
            $el.on(event, selector, function(e){
                that.formSubmit(e, formOverride);
            });

            return this;
        };

        this.removeEvent = function(el, event){
            var $el = $(el);
            event = event + ".DAF";
            $el.off(event);

            return this;
        };
    };

    return DjangoAjaxForm;
}));

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
(function (root, factory) {
root.DAF = root.DAF || {};
if (typeof define === 'function' && define.amd){
    define(['../template/ajaxforms.js'], function(templates){
    return root.DAF.formTemplateUtils = factory(templates);
    });
}else{
    root.DAF.formTemplateUtils = factory(root.DAF.Templates);
}}(this, function(templates){

    var failFn = function(err, jqxhr){
        for (var field in err)
        {

            var f = this.find('#id_' + field);
            if (err[field] instanceof  Array)
            {
                for(var error in err[field])
                {
                    if (f.length > 0)
                    {
                        f.before(templates.failTemplate({ error: err[field][error]}));
                    }else{
                        this.prepend(templates.failTemplate({ error: err[field][error]}));
                    }
                }
            }else{
                this.prepend(templates.failTemplate({error: err[field]}));
            }

        }
    };

    var doneFn= function(d){
        this.append(templates.doneTemplate({name: d.name}));
    };

    var formTemplateUtils = {
        fail: failFn,
        done: doneFn
    };

    return formTemplateUtils;
}));