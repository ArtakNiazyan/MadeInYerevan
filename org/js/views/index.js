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
                this.items.on("remove",that.removeStartup,that)
            },
            events: {
                'click .startups li .delete': "deleteStartup"
            },
            render:function(){
                var that       = this;
                that.$el.html(this.home({}))
                // console.log("instance ",that.___.i)
                // console.log("client   ",that.___.c)

                that.items.fetch({
                    success:function(){
                        that.items.each(function(m){
                            console.log(m.toJSON())
                            that.$("ul.startups").append("<li data-id='"+m.id+"'><span class='title'>"+m.get("title")+"</span> <a href='"+m.get('body.site')+"' target='_blank'> -> </a><button class='delete'>x</button></li>")
                        })
                    },data:{"group":"startup"}
                })
             
            
            },deleteStartup:function(e){
                var that = this;
                var id =  $(e.currentTarget).parent().data("id");
                that.items.get(id).destroy();
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
            },removeStartup:function(m){
                this.$("li[data-id='"+m.id+"']").remove();
            }
    });
});

}).call(this);

(function()) {
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
                this.items.on("remove",that.removeStartup,that)
            },
            events: {
                'click .startups li .delete': "deleteStartup"
            },
            render:function(){
                var that       = this;
                that.$el.html(this.home({}))
                // console.log("instance ",that.___.i)
                // console.log("client   ",that.___.c)

                that.items.fetch({
                    success:function(){
                        that.items.each(function(m){
                            console.log(m.toJSON())
                            that.$("ul.startups").append("<li data-id='"+m.id+"'><span class='title'>"+m.get("title")+"</span> <a href='"+m.get('body.site')+"' target='_blank'> -> </a><button class='delete'>x</button></li>")
                        })
                    },data:{"group":"startup"}
                })
             
            
            },deleteStartup:function(e){
                var that = this;
                var id =  $(e.currentTarget).parent().data("id");
                that.items.get(id).destroy();
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
            },removeStartup:function(m){
                this.$("li[data-id='"+m.id+"']").remove();
            }
    });

});
}.call(this);

