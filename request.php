<?php
	$input = json_decode(file_get_contents('php://input'));

	
	
	if(object_properties_exist(['url','method','authString'],$input)){
		$data = null;
		$contentType='application/json';
		if($input->method === 'POST'){
			if(property_exists($input, 'paramString') ){
				$data=$input->paramString;
				$contentType='application/x-www-form-urlencoded';
			}
		}

		$headersArray=[
				"Authorization: Basic ".$input->authString,
				"Content-Type: ".$contentType,
				"Accept: ".$input->accept
			];

		$response=null;
		$result = array();
		$result['url']=$input->url;
		$result['headers']=$headersArray;
		$result['params']=$data;
		try{
			$response = makeRequestCurl($input->url,$input->method,$headersArray,$data);
			$result['httpCode'] = $response['httpCode'];
			$result['body'] = $response['response'];
		}catch(Exception $e){
			var_dump($e.getMessage());
		}

		echo(json_encode($result));
		
	}

	function makeRequestCurl($url,$method,$headers,$data){
    	$ch = curl_init();
    	curl_setopt($ch, CURLOPT_URL, $url);
    	curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    	curl_setopt($ch, CURLOPT_TIMEOUT,10);

    	if($method === 'POST'){
	    	curl_setopt($ch, CURLOPT_POST, true);
	    	if($data!=null)curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

	    }

    	$time = microtime(true);
		$response=curl_exec($ch);
		$time = microtime(true)-$time;

		$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

		curl_close($ch);
		return ['httpCode'=>$httpcode,'response'=>$response, 'time'=>$time];
    }

    function object_properties_exist($properties, $object){
    	$doAllExist = true;
    	foreach ($properties as $property) {
    		if(!property_exists($object,$property)){
    			$doAllExist = false;
    			break;
    		}
    	}
    	return $doAllExist;
    }

    function array_keys_exist($keys,$array){
    	$doAllExist = true;
    	foreach ($keys as $key) {
    		if(!array_key_exists($key, $array)){
    			$doAllExist = false;
    			break;
    		}
    	}
    	return $doAllExist;
    }
?>