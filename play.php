<!--
    Author: Anže Kožar (@nzkozar))
    Created: 11.7.2018
-->
<?php 
	if(array_key_exists('u',$_POST) && array_key_exists('p',$_POST)){
		$authString = base64_encode($_POST['u'].':'.$_POST['p']);
	}else{
		header('Location: /;');
	}
?>
<!DOCTYPE html>
<html>
<head>
	<title>Cretan Maze</title>

	<meta name="viewport" content="width=device-width, initial-scale=1.0">


	<link rel="stylesheet" href="css/styles.css">
	<script src="js/controller.js"></script>

	<script type="text/javascript">
		<?php 
			if($authString!=null){
				echo 'var authString = \''.$authString.'\';';
			}
		?>

		function init(){
			//console.log('init()');

		}

	</script>
</head> 
<body onload="init()">
	
	<div>
		<div class="floatingSection pageTitle">Escape the Cretan Maze (<a href="https://coding-challanges.herokuapp.com/challanges/maze" target="_blank">source</a>)</div>
		<div class="floatingSection" id="infoDiv">
			<table>
				<tr>
					<td id="mazeInfoText">
						<button onclick="createMaze()">Start a new maze</button><br>
						or<br>
						<input type="number" id="mazeIdInput" /> <button onclick="handleGetExistingMaze()">Get existing maze</button>
					</td>
				</tr>

				<tr>
					<td id="infoDiv_output">
						
					</td>
				</tr>

				<tr>
					<td id="infoDiv_output_raw">
						
					</td>
				</tr>
			</table>
		</div>
		<table class="viewMapTable floatingSection" cellspacing="0" cellpadding="0">
			<tr>
				<td class="mazeTile" id="view_NORTH_WEST"></td>
				<td class="mazeTile" id="view_NORTH"></td>
				<td class="mazeTile" id="view_NORTH_EAST"></td>
			</tr>

			<tr>
				<td class="mazeTile" id="view_WEST"></td>
				<td class="mazeTile" id="view_ON"></td>
				<td class="mazeTile" id="view_EAST"></td>
			</tr>
			<tr>
				<td class="mazeTile" id="view_SOUTH_WEST"></td>
				<td class="mazeTile" id="view_SOUTH"></td>
				<td class="mazeTile" id="view_SOUTH_EAST"></td>
			</tr>
			<tr><td colspan="3">&nbsp;</td></tr>
			<tr>
				<td></td>
				<td class="mazeControllButton" onclick="handleMoveButtonClick('NORTH')" title="Move north">&#x25B2;</td>
				<td></td>
			</tr>
			<tr>
				<td class="mazeControllButton" onclick="handleMoveButtonClick('WEST')" title="Move west">&#x25C0;</td>
				<td class="mazeControllButton" onclick="pickupCoin()" title="Pick up">&#x25A0;</td>
				<td class="mazeControllButton" onclick="handleMoveButtonClick('EAST')" title="Move east">&#x25B6;</td>
			</tr>
			<tr>
				<td></td>
				<td class="mazeControllButton" onclick="handleMoveButtonClick('SOUTH')" title="Move south">&#x25BC;</td>
				<td></td>
			</tr>
		</table>
	</div>

</body>
</html>