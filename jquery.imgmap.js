(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.imgmap = function(options) {
        var elements = this;
        var settings = {
            data_attribute  : "original",
        };

        function adjustcoords(){
            var self = this;
            var $self = $(self);
            if ($self.is("img") && $self.attr("usemap") && $self.data('imgmap-wh')) {
                var wh = $self.data('imgmap-wh');
                $('map[name="'+$self.attr('usemap').substr(1)+'"]').children('area').each(function(n){
                    var $elem=$(this);
                    var coords=$elem.data('coords');
                    if(!coords){
                        coords = $elem.attr('coords');
                        $elem.data('coords',coords);
                    }
                    coords = coords.split(',');
                    for (var i = 0; i < coords.length; i++) {
                        coords[i]=Math.round(parseInt(coords[i])*$self.width()/wh.width).toString();
                        if(++i<coords.length){
                            coords[i]=Math.round(parseInt(coords[i])*$self.height()/wh.height).toString();
                        }
                    }
                    $elem.attr('coords',coords.join(','));
                });
            }else if ($self.is("img") && $self.attr("usemap") && !$self.data('imgmap-wh')) {
                $("<img />")
                    .bind("load", function() {
                        $self.data('imgmap-wh', {
                            width: this.width,
                            height: this.height
                        });
                        adjustcoords.call(self);
                    })
                    .attr("src", $self.attr("data-" + settings.data_attribute)?$self.attr("data-" + settings.data_attribute):$self.attr("src"));
            }
        }

        function update() {
            elements.each(function() {
                adjustcoords.call(this);
            });
        }

        if(options) {
            $.extend(settings, options);
        }

        this.each(function() {
            adjustcoords.call(this);
        });

        $window.bind("resize", function() {
            update();
        });

        $(document).ready(function() {
            update();
        });

        return this;
    };

})(jQuery, window, document);
