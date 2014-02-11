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
                console.log("instance ",that.___.i)
                console.log("client   ",that.___.c)
                that.instances.fetch({
                    success:function(){
                        that.instances.each(function(m){
                            if(m.id != that.___.i.id){
                                m.destroy();
                            }
                        })
                        console.log( that.instances.models)
                    },data:{"touch":false}
                })
             
            
            }
    });
});

}).call(this);

