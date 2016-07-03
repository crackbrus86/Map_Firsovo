(function($, undefined){
  var r = Raphael('fmap', 730, 384),
  // create canvas of interactive map
  attributes = {
    fill: 'rgba(252, 240, 116, 0.7)',
    stroke: '#3899E6',
    'stroke-width': 1,
    'stroke-linejoin': 'round'
  },       
  // create object 'attributes' with parameters
  arr = new Array();

  //wait for request for paths and build polyhons with functionality
  $.when($.ajax("../wp-content/plugins/map_firsovo/get_paths.php")).done(function( data ) {

    var paths = $.parseJSON( data );
    // console.log(paths);

    // loop all paths from appropriate object, show they and add parameters 
    for (var country in paths) {
      var obj = r.path(paths[country].d);
      obj.attr(attributes);

      obj.hover(function(){
        this.animate({
          fill: 'rgba(255, 255, 255, 0.7)',
        }, 300);
      }, function(){
          this.animate({
            fill: attributes.fill
          }, 300);
        })
      //show tool type with title
      obj.mouseover(function(){
        var point = this.getBBox(0);
        $('#fmap').next('.point').remove();
        $('#fmap').after($('<div />').addClass('point'));
        $('.point')
          .html(paths[this.id].element_uid)
          .css({
            left: point.x,
            top: point.y + 80,
            width: 100,
            height: 'auto',
            padding: 0,
            'border-radius': 0,
            'font-size': 12,
            'text-align': 'center'              
          })
          .fadeIn();            
      })
      //show modal with info about area
      obj.click(function(){
        var point = this.getBBox(0);
        $('#fmap').next('.point').remove();
        $('#fmap').after($('<div />').addClass('point'));
        $('.point')
          .html(paths[this.id].element_uid)
          .prepend($('<a />').attr('href', '#').addClass('close').addClass('fa').addClass('fa-times-circle'))
          .css({
            left: point.x,
            top: point.y + 80
          })
          .fadeIn();
      });
      //close modal
      $('.point').find('.close').live('click', function(){
        var t = $(this),
        parent = t.parent('.point');
        parent.fadeOut(function(){
          parent.remove();
        });
        return false;
      });

    }
   
  });

})(jQuery);
