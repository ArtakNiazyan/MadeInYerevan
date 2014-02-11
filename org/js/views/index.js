(function() {
    define(['require', 'jquery', 'underscore', 'bb', 'i/item/c', 'i/instance/c','text!/html/index.html'], function(require, $, _, Backbone, Items,Instances) {
        return Backbone.View.extend({
            id: 'index',
            initialize: function(options) {
                var that = this;
                this.___ = options.___;
                this.items = new Items(null,{ s: this.___.so});
                this.instances = new Instances(null,{ s: this.___.so});
                var Home = require('text!/html/index.html');
                this.home = _.template(Home);
                that.render();
            },
            events: {
            },
            render:function(){
                var that       = this;
                that.$el.html(this.home({}))
                // console.log("instance ",that.___.i)
                // console.log("client   ",that.___.c)

                that.items.fetch({
                    success:function(){
                        var flag = true;
                        that.items.each(function(m){
                            if(flag && m.get("body.title") =="Haystack"){
                                flag = false;
                                m.destroy();
                            }

                            console.log(m.toJSON())
                        })
                        
                    },data:{"group":"startup"}
                })
             
            
            },signup:function(){
               var that       = this;
                that.items.create({"title":"Haystack"
                    ,"path":"haystack"
                    ,"body":{
                            "city":"Yerevan"
                            ,"founders":["Vache", "Andrew"]
                            ,"site":"https://haystack.im"
                        }
                    ,"group":"startup"
                    },{callback:function(json,m){
                        console.log("m:",m);
                    }});
            }
    });
});

}).call(this);

