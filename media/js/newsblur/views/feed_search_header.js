NEWSBLUR.Views.FeedSearchHeader = Backbone.View.extend({
    
    el: ".NB-search-header",
    
    className: "NB-search-header",
    
    events: {
        "click .NB-search-header-save": "save_search"
    },
    
    unload: function() {
        this.$el.addClass("NB-hidden");
    },
    
    render: function() {
        this.showing_fake_folder = NEWSBLUR.reader.flags['river_view'] && 
            NEWSBLUR.reader.active_folder && 
            (NEWSBLUR.reader.active_folder.get('fake') || !NEWSBLUR.reader.active_folder.get('folder_title'));
        
        if (NEWSBLUR.reader.flags.search || NEWSBLUR.reader.flags.searching) {
            this.$el.removeClass("NB-hidden");

            var $title = this.make_title();
            this.$(".NB-search-header-title").html($title);

            var saved = this.is_saved() ? 'Saved' : 'Save Search';
            this.$(".NB-search-header-save").text(saved);
        } else {
            this.unload();
        }
    },
    
    make_title: function() {
        var feed_title;
        if (NEWSBLUR.reader.flags['starred_view'] ||
            NEWSBLUR.reader.active_feed == "read" || 
            this.showing_fake_folder) {
            feed_title = NEWSBLUR.reader.active_fake_folder_title();
        } else if (NEWSBLUR.reader.active_folder) {
            feed_title = NEWSBLUR.reader.active_folder.get('folder_title');
        } else if (NEWSBLUR.reader.active_feed) {
            feed_title = NEWSBLUR.assets.get_feed(NEWSBLUR.reader.active_feed).get('feed_title');
        }
        var $view = $(_.template('<div>\
            Searching \
            <b><%= feed_title %></b> for "<b><%= query %></b>"\
        </div>', {
            feed_title: feed_title,
            query: NEWSBLUR.reader.flags.search
        }));
        
        return $view;
    },
    
    is_saved: function() {
        return !!NEWSBLUR.assets.get_searches_feeds(this.saved_feed_id(), NEWSBLUR.reader.flags.search);
    },
    
    saved_feed_id: function() {
        var feed_id = NEWSBLUR.reader.active_feed;
        if (_.isNumber(feed_id)) {
            feed_id = "feed:" + feed_id;
        }
        return feed_id;
    },
    
    // ==========
    // = Events =
    // ==========
    
    save_search: function(e) {
        var feed_id = this.saved_feed_id();
        if (this.is_saved()) {
            NEWSBLUR.assets.delete_saved_search(feed_id, NEWSBLUR.reader.flags.search, function(e) {
                console.log(['Saved searches', e]);
            });
        } else {
            NEWSBLUR.assets.save_search(feed_id, NEWSBLUR.reader.flags.search, function(e) {
                console.log(['Saved searches', e]);
            });
        }
    }
    
});