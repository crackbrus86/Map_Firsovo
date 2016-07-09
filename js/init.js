(function($, undefined){
  var dir = "../wp-content/plugins/map_firsovo/";
  var r = Raphael('fmap', 730, 384),
  // create canvas of interactive map
  // attributes = {
  //   fill: 'rgba(252, 240, 116, 0.7)',
  //   stroke: '#3899E6',
  //   'stroke-width': 1,
  //   'stroke-linejoin': 'round'
  // },
     
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
      var  attributes = SetAttributes(paths[country].element_status);
      obj.attr(attributes);
      arr[obj.id] = country;
      obj.node.id = paths[country].element_uid;
      id++;

      obj.hover(function(){
        this.animate({
          fill: 'rgba(255, 255, 255, 0.7)',
        }, 300);
      }, function(){
          var a = paths[this.id].element_status;
          this.animate({
            fill: SetAttributes(a).fill,
          }, 300);
        })
      //show tool type with title
      obj.mouseover(function(){
        var point = this.getBBox(0);
        $('#fmap').next('.point').remove();
        $('#fmap').after($('<div />').addClass('point'));
        $('.point')
          .html(paths[this.id].element_name)
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
          .html('<p class="path-title">'+paths[this.id].element_name+'</p>')
          .prepend($('<a />').attr('href', '#').addClass('close').addClass('fa').addClass('fa-times-circle'))
          .append(checkStatus(paths[this.id].element_status))
          .append(checkSquare(paths[this.id].element_place))
          .append(checkCadasterNumber(paths[this.id].element_cadaster_number))
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

  function SetAttributes(status){
    switch (status){
      case 'none':
      attributes = {
        fill: 'rgba(95, 95, 95, 0.7)',
        stroke: '#647b4f',
        'stroke-width': 1,
        'stroke-linejoin': 'round'
      };
      break
      case 'free':
        attributes = {
          fill: 'rgba(131, 212, 122, 0.7)',
          stroke: '#3899E6',
          'stroke-width': 1,
          'stroke-linejoin': 'round'
        };
        break
      case 'reserved':
        attributes = {
          fill: 'rgba(247, 62, 253, 0.7)',
          stroke: '#3899E6',
          'stroke-width': 1,
          'stroke-linejoin': 'round'
        };
        break        
      case 'busy':
        attributes = {
          fill: 'rgba(239, 127, 26, 0.7)',
          stroke: '#3899E6',
          'stroke-width': 1,
          'stroke-linejoin': 'round'
        };
        break    
      case 'discount':
        attributes = {
          fill: 'rgba(249, 0, 0, 0.7)',
          stroke: '#3899E6',
          'stroke-width': 1,
          'stroke-linejoin': 'round'
        };
        break                
      default:
        attributes = {
          fill: 'rgba(95, 95, 95, 0.7)',
          stroke: '#647b4f',
          'stroke-width': 1,
          'stroke-linejoin': 'round'
        };
        break             
    }
    return attributes;
  }

  function parseGetParams() { 
     var $_GET = {}; 
     var __GET = window.location.search.substring(1).split("&"); 
     for(var i=0; i<__GET.length; i++) { 
        var getVar = __GET[i].split("="); 
        $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1]; 
     } 
     return $_GET; 
  }


  function checkStatus(status){
    var status_label;
    switch (status){
      case 'none':
        status_label = 'Вторая очередь';
        break
      case 'free':
        status_label = 'Свободен';
        break
      case 'busy':
        status_label = 'Занят';
        break
      case 'reserved':
        status_label = 'Забронирован';
        break
      case 'discount':
        status_label = 'Акция';
        break
      default:
        status_label = 'Вторая очередь';
        break
    }
    var str = '<p class="path-status">'+status_label+'</p>';
    return str;
  }

  function checkSquare(square){
    var str = '<p class="path-square">Площадь '+square+'</p>';
    if(square > 0 || square !== '')
      return str;
  }

  function checkCadasterNumber(cadaster_number){
    var str = '<p class="cn-pre">Смотреть на кадастровой карте</p><p class="path-cn">'+cadaster_number+'</p>';
    if(cadaster_number !== '')
      return str;
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


function handleUpdate(modal, button){
  $(modal).find(button).live('click', function(){
    updatePath();
  });
}

  function updatePath(){
    var form = $( ".point-edit form" ).serialize();
    $('.point-edit').remove();
    $.ajax({
       type: "POST",
       url: dir + "/set_path.php",
       data: form,
       success: function(data){
        if(data === "true") alert( "Участок обновлен!");
        window.location.reload();
        // console.log(data);
       }
     });
  }  

  $(document).ready(function(){
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
            $.get(dir + "/get_path.php", "euid=" + target, function(dat){
                var pathData = $.parseJSON(dat) ;

            var leftX = event.offsetX - 20;
            var topY = event.offsetY + 30;
            $('.point-edit').remove();
            $('.point').remove();
            $('#fmap').after($('<div />').addClass('point-edit'));
            $('.point-edit')
            .html('<p class="modal-title">Редактировать участок</p>')
            .prepend($('<a />').attr('href', '#').addClass('close-edit').addClass('fa').addClass('fa-times-circle'))
            .append($('<form />')
              .append('<p><label for="m-path-name">Название участка:</label></p>')
              .append('<p><input type="text" id="m-path-name" name="m-path-name" value="'+pathData[0].element_name+'" /></p>')
              .append('<p><label for="m-path-square">Площадь участка:</label></p>')
              .append('<p><input type="text" id="m-path-square" name="m-path-square" value="'+pathData[0].element_place+'" /></p>')
              .append('<p><label for="m-path-cost">Стоимость участка:</label></p>')
              .append('<p><input type="text" id="m-path-cost" name="m-path-cost" value="'+pathData[0].element_price+'" /></p>')  
              .append('<p><label for="m-path-new-cost">Новая цена:</label></p>')
              .append('<p><input type="text" id="m-path-new-cost" name="m-path-new-cost" value="'+pathData[0].element_price_new+'" /></p>')  
              .append('<p><label for="m-path-status">Статус:</label></p>')
              .append('<p><select id="m-path-status" name="m-path-status">'+'<option value="none" selected>Без статуса</option>'+
                '<option value="busy">Занят</option>'+
                '<option value="reserved">Забронирован</option>'+
                '<option value="free">Свободный</option>'+
                '<option value="discount">Акция</option>'+
                '</select></p>')
              .append('<p><label for="m-path-cn">Кадастровый номер:</label></p>')
              .append('<p><input type="text" id="m-path-cn" name="m-path-cn" value="'+pathData[0].element_cadaster_number+'" /></p>')   
              .append('<p><input type="hidden" id="m-path-id" name="m-path-id" value="' + target + '" /></p>')   
            )
              .append('<span class="path-save fa fa-floppy-o" title="Сохранить" />') 
              .append('<span class="path-cancel fa fa-times" title="Отмена" />')             
            .css({
              left: leftX+'px',
              top: topY+'px'
            })
            .fadeIn();   
            //check path status
            if(!pathData[0].element_status || pathData[0].element_status === 'none'){
              $("#m-path-status option[value='none']").attr("selected","selected");
            }else{
              $("#m-path-status option[value='"+pathData[0].element_status+"']").attr("selected","selected");
            }            

            });


             //close edit modal
            closeModal('.point-edit', '.close-edit');
            closeModal('.point-edit', '.path-cancel');
          }
        });
        handleUpdate('.point-edit', '.path-save');
      }
    });
  });

})(jQuery);
