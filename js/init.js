(function($, undefined){
  var dir = "../wp-content/plugins/map_firsovo/";
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
  $.when($.ajax( dir + "/get_paths.php")).done(function( data ) {

    var paths = $.parseJSON( data );
    // console.log(paths);
    var id = 0;
    // loop all paths from appropriate object, show they and add parameters 
    for (var country in paths) {
      var obj = r.path(paths[country].d);
      obj.attr(attributes);
      arr[obj.id] = country;
      obj.node.id = paths[country].element_uid;
      id++;

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
            top: point.y + 70,
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
      closeModal('.point', '.close');
    }
   
  });

  function parseGetParams() { 
     var $_GET = {}; 
     var __GET = window.location.search.substring(1).split("&"); 
     for(var i=0; i<__GET.length; i++) { 
        var getVar = __GET[i].split("="); 
        $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1]; 
     } 
     return $_GET; 
  }

  function closeModal(modal, button){
    $(modal).find(button).live('click', function(){
          var t = $(this),
          parent = t.parent(modal);
          parent.fadeOut(function(){
            parent.remove();
          });
          return false;
    });
  }  

  $(document).ready(function(){
    //close edit modal
    closeModal('.point-edit', '.close-edit');
    //get array with GET parameters
    var getArr = parseGetParams();
    //check user permission, disable standart right click
    $.get(dir + "/get_permissions.php", getArr, function(data){
      if(data == 'true'){
        document.oncontextmenu = function() {return false;};
        //handle right click on path
        $(document).mousedown(function(event) {
          if (event.which === 3 && event.target.nodeName === 'path')  {
            var target = event.target.id;
            var leftX = event.offsetX - 20;
            var topY = event.offsetY + 30;
            $('.point-edit').remove();
            $('.point').remove();
            $('#fmap').after($('<div />').addClass('point-edit'));
            $('.point-edit')
            .html('Edit ' + target)
            .prepend($('<a />').attr('href', '#').addClass('close-edit').addClass('fa').addClass('fa-times-circle'))
            .css({
              left: leftX+'px',
              top: topY+'px'
            })
            .fadeIn();              
          }
        });
      }
    });
  });

})(jQuery);
