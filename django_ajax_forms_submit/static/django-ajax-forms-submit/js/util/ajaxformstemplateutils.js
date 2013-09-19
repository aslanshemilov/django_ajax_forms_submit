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
            if (jqxhr.status >= 500)
            {
                this.prepend(templates.failTemplate({error: 'Something went wrong'}));
                return;
            }

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