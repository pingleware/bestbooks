<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//$user = get_current_user();

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
<?php
/*
error_reporting(E_ALL); 
ini_set( 'display_errors','1');

$url = "http://localhost/federalbusinessopps.com/wp-json/bestbooks/v2/headers";
$username = "pingle";
$password = "heather";
$post_data = array(
        'fieldname1' => 'value1',
        'fieldname2' => 'value2'
  );

$options = array(
        CURLOPT_URL            => $url,
        CURLOPT_HEADER         => true,    
        CURLOPT_VERBOSE        => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,    // for https
        CURLOPT_USERPWD        => $username . ":" . $password,
        CURLOPT_HTTPAUTH       => CURLAUTH_DIGEST,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($post_data) 
);

$ch = curl_init();

curl_setopt_array( $ch, $options );

try {
  $raw_response  = curl_exec( $ch );

  // validate CURL status
  if(curl_errno($ch))
      throw new Exception(curl_error($ch), 500);

  // validate HTTP status code (user/password credential issues)
  $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  if ($status_code != 200)
      throw new Exception("Response with Status Code [" . $status_code . "].", 500);

} catch(Exception $ex) {
    if ($ch != null) curl_close($ch);
    throw new Exception($ex);
}

if ($ch != null) curl_close($ch);
echo '<pre>';
print_r($raw_response);
echo '</pre>';

function do_post_request($url, $data, $optional_headers = null)
{
  $params = array('http' => array(
              'method' => 'POST',
              'content' => $data
            ));
  if ($optional_headers !== null) {
    $params['http']['header'] = $optional_headers;
  }
  $ctx = stream_context_create($params);

  $fp = fopen($url, 'rb', false, $ctx);

  if (!$fp) {
    throw new Exception("Problem with $url");
  }
  $response = stream_get_contents($fp);
  if ($response === false) {
    throw new Exception("Problem reading data from $url");
  }
  return $response;
}
*/
?>