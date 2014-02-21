(function() {
    define(['require', 'jquery', 'underscore', 'bb', 'i/item/c', 'i/instance/c','text!/html/index.html','text!/html/startupsSingle.html'], function(require, $, _, Backbone, Items,Instances) {
        return Backbone.View.extend({
            id: 'index',
            initialize: function(options) {
                var that = this;
                this.___ = options.___;
                this.items = new Items(null,{ s: this.___.so});
                console.log(this.items);
                this.items.on('create', this.updateStartups, this);
                this.items.on("remove",that.removeStartup,that);
                this.instances = new Instances(null,{ s: this.___.so});
                
                var Home = require('text!/html/index.html');
                this.home = _.template(Home);
                
                var StartupSingle = require('text!/html/startupsSingle.html');
                this.startupSingle = _.template(StartupSingle);
                
                that.render();
                

            },
            events: {
                'click .startups li .delete': "deleteStartup"
                , 'click .join': "openOverlay"
                , 'click .cancel': "hideOverlay"
                , 'click .add': "signup"
                , 'click .add_founder': "add_founder"
                , 'click .remove_founder': "remove_founder"
            },

            openOverlay: function(){
                var that = this;
                that.$(".overlay").addClass("showme");

            },
            hideOverlay: function(){
                var that = this;
                that.$(".overlay").removeClass("showme");

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
                            that.$("ul.startups").append(
                                that.startupSingle(m.toJSON())
                            );
                        });

                    }
                    , data: {"group":"startup"}                    
                });
             
            
            },
            updateStartups : function (){
                console.log("sdsd");
                that.items.fetch({
                    success:function(){

                        that.items.each(function(m){                                            
                    console.log("asdsd", m);
                            that.$("ul.startups").append(
                                that.startupSingle(m.toJSON())
                            );
                        });
                    }
                    , data: {"group":"startup"}                    
                });
            },
            deleteStartup:function(e){
                var that = this;
                var id =  $(e.currentTarget).parent().attr("id");
                that.items.get(id).destroy();
            },signup:function(){
                var that       = this;                

                var founders = [];

                $(".founders li").each(function(){
                    founders.push($(this).children("h3").html());
                });

                var itemObj = {
                    "title":($("#company_name").val()),
                    "body":{
                        "founders" : founders,
                        "city" : ($("#city").val()),
                        "url" : ($("#url").val())

                    },
                    "group":"startup"
                };
                
                // console.log(itemObj);
                that.items.create(itemObj,{
                    callback:function(json,m){
                        console.log("m:",m);
                    }
                });
            },removeStartup:function(m){
                this.$("li[data-id='"+m.id+"']").remove();
            },add_founder:function(){
                var that = this;
                if ($('.founder_input').val().length>2){
                    $(".founders").append(
                        "<li><h3>"+$('.founder_input').val()+"</h3><button class='remove_founder'>-</button></li>"
                    );
                }
                else{
                    $('.founder_input').attr("placeholder","please add more shit");
                }
                $('.founder_input').val("");
            },remove_founder: function(e){
                $(e.currentTarget).parent().remove();
            }

    });
});

}).call(this);
