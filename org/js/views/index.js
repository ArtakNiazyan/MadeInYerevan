(function() {
    define(['require', 'jquery', 'underscore', 'bb', 'i/item/c', 'i/instance/c','text!/html/index.html','text!/html/startupsSingle.html'], function(require, $, _, Backbone, Items,Instances) {
        return Backbone.View.extend({
            id: 'index',
            initialize: function(options) {
                var that = this;
                this.___ = options.___;
                this.items = new Items(null,{ s: this.___.so});
                console.log(this.items);
                this.items.on("create", this.updateStartups, this);
                this.items.on("delete", this.deleteStartup,  this);                
                this.instances = new Instances(null,{ s: this.___.so});
                
                var Home = require('text!/html/index.html');
                this.home = _.template(Home);
                
                var StartupSingle = require('text!/html/startupsSingle.html');
                this.startupSingle = _.template(StartupSingle);                
                that.render();            

            },
            events: {                  
                  'click .add': "createStartup"
                , 'submit form': "fileUpload"
                , 'click .startups li .delete': "deleteStartup"
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
            },createStartup:function(){
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
                        "url" : ($("#url").val()),
                        "logo": ($("#logos img").attr("src"))
                    },
                    "group":"startup"
                };

                

                that.items.create(itemObj,{
                    callback:function(json,m){
                        console.log("createStartup",(new Date()),m);
                    }
                });
            }, fileUpload : function(e){
                
                e.preventDefault();

                var that = this;  
                var formData = new FormData(this.$("form")[0]);
                 
                $.ajax({
                    url: '/file/aws/upload',
                    type: 'POST',
                    data: formData,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (returndata) {
                        var returndata = JSON.parse(returndata);
                        if (returndata.filename.length > 2){
                            that.$("#logos").html('<img src="https://dev-madeinyerevan.lsq.io/fileaws/upload/'+returndata.filepath+'" data-filename="'+returndata.filename+'">');
                        }
                    }
                });
            },updateStartups : function (){                
                var that = this;
                that.items.fetch({
                    success:function(itemsCallback){
                        if((itemsCallback.length>1)){                                
                            that.items.each(function(m){
                                if (!($('#'+m.id).length > 0)) { 
                                    that.$("ul.startups").append(
                                        that.startupSingle(m.toJSON())
                                    );
                                }
                            });                            
                        } else {                            
                            that.items.each(function(m){
                                console.log("only one append");
                                that.$("ul.startups").append(
                                    that.startupSingle(m.toJSON())
                                );
                            });                            
                        }
                        
                    }, 
                    data: {"group":"startup"}                   
                });
            },deleteStartup:function(e){
                var that = this;
                var id =  $(e.currentTarget).parent().attr("id");
                that.items.get(id).destroy();            
                that.$("#"+id).remove();            
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