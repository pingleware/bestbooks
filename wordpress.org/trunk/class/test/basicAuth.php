<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>
<script src="//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script type="text/javascript">
    jQuery(document).ready(function($){
        $.ajax({
          type: 'POST',
          url: 'http://localhost/federalbusinessopps.com/wp-json/bestbooks/v2/headers',
          data: {},
          crossDomain: true,
          beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent('pingle:password'))));
            xhr.setRequestHeader('Content-Type', 'text/plain; charset=windows-1252');
          },
          success: function(results) {
              console.log(results);
          }
        });
    });
</script>