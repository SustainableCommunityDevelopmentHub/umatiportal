/* eslint-env jquery, browser */
$(document).ready(() => {

    $('#media').on('click', function () {
        $.ajax({
            url: '/account/mediaupdate',
            data: {
                mediatitle: $("input[name=mediatitle]").val(),
                mediaurl: $("input[name=mediaurl]").val()
            },
            dataType : 'json'
        });
    });

    $(".solidwaste").on('click', function(){
     window.location = "https://scdhub.org/cat/municipal-solid-waste-storage/";    
    });

    $(".drinkingwater").on('click', function(){
     window.location = "https://scdhub.org/cat/water-sources/";    
    });

    $(".wastewater").on('click', function(){
     window.location = "https://scdhub.org/cat/wastewater-collection/";    
    });


    $('#invite').on('click', function () {
        var Status = $(this).val();
        $.ajax({
            url: '/account/door1',
            data: {
                text: $("input[name=invite]").val(),
                Status: Status
            },
            dataType : 'json'
        });
    });

    $('.surplus').on('click', function () {
            var hreff = $(this).attr('href');
            $(this).parent().siblings().children().removeClass('active');
            $(this).addClass('active');
        $(this).load( hreff );
        return false;
    });

   $('.notifyreq').change(function() {
        var $checkbox = $(this);
        var hreff = $(this).attr('href');
        if ($checkbox.prop('checked')) {
          console.log("checked");
          $(this).load( hreff + "checked/" );
        } else {
          console.log("unchecked");
        $(this).load( hreff + "unchecked/");
        }
    });

    $('.pickup_deliver').on('click', function () {
            var hreff = $(this).attr('href');
            $(this).parent().siblings().children().removeClass('active');
            $(this).addClass('active');
        $(this).load( hreff );
        return false;
    });

    $('#invite').change(function(){
        container = document.getElementById(this);
        container.innerHTML=page_request.responseText;
        container.innerHTML=page_request.responseText;
      if (container.value == 'good vibes') {
          container.style.visibility = 'visible';
      }
    });

    $('.movetrash').click(function(e) {
	(this).parent.remove();
        e.preventDefault();
    });

    $(".toggle-trigger").click(function() {
    $(this).parent().nextAll('.toggle-wrap').first().toggle('slow');

    });

   $("umatidb").hover(function() {
        $(this).addClass("blue");
        }, function() {
        $(this).removeClass("blue");
   });

   $( ".umatidb" ).on( "click", function() {
        $(this).parent().remove();
        $(".email-head-sender").next().eq(0).remove();
        $(this).load("/account/messagestrashmoveajax/" + $(this).attr('href') + "/" + $(this).attr('newstatus') );
         return false;
      });

   $( ".umatidbr" ).on( "click", function() {
        $(this).parent().remove();
        $(".email-head-sender").next().eq(0).remove();
        $(this).load("/account/messagestrashremove/" + $(this).attr('href') + "/" + $(this).attr('newstatus') );
         return false;
      });

    $('body').ihavecookies(options);

        if ($.fn.ihavecookies.preference('marketing') === true) {
            console.log('Cookie policy has been accepted.');
        }

    $('#ihavecookiesBtn').on('click', function(){
            $('body').ihavecookies(options, 'reinit');
        });

    $('#upload').on('click', function () {
        var file_data = $('#file').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        $.ajax({
            url: '//localhost:8080/account/upload', // point to server-side controller method
            dataType: 'text', // what to expect back from the server
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function (response) {
                $('#msg').html(response); // display success response from the server
            },
            error: function (response) {
                $('#msg').html(response); // display error response from the server
            }
        });
    });
});
