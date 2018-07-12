/*
    Author: Anže Kožar (@nzkozar))
    Created: 11.7.2018
*/
var maze;
var steps = 0;
var noBump = true;
var isMoving = false;
var lastDir = 'ON';
var area = {
    'NORTH':'UNEXPLORED',
    'NORTH_EAST':'UNEXPLORED',
    'EAST':'UNEXPLORED',
    'SOUTH_EAST':'UNEXPLORED',
    'SOUTH':'UNEXPLORED',
    'SOUTH_WEST':'UNEXPLORED',
    'WEST':'UNEXPLORED',
    'NORTH_WEST':'UNEXPLORED',
}

setInterval(function(){
    //console.log('info refresh',maze);
    if(maze!=null && maze.secondsLeft>0)getMazeInfo(maze.id,false);
},3000)

//Keyboard shortcuts
document.onkeyup = function(e) {
  //console.log('key: '+e.which);
  if(e.which == 13){
    pickupCoin();
  }else if(e.which == 37) {
    handleMoveButtonClick('WEST');
  }else if(e.which == 38) {
    handleMoveButtonClick('NORTH');
  }else if(e.which == 39) {
    handleMoveButtonClick('EAST');
  }else if(e.which == 40) {
    handleMoveButtonClick('SOUTH');
  }
};

function getTiles(id){
	//GET - mazes/{id}/steps
    if(id!=undefined){
        makeApiCall('mazes/'+maze.id+'/steps','GET',[],'application/json',function(responseText){
            if(responseText!='' && isJson(responseText)){
                maze.tiles = JSON.parse(responseText);

                updateArea(lastDir);
                displayMazeInfo();
            }
        });
    }else{
        console.log('id is undefined');
    }
}

function createMaze(){
	//POST - mazes
	//level = STARTER/ADVANCED/EXPERT
	makeApiCall('mazes/','POST',[],'application/json',function(responseText){
        if(responseText!=''){  
            //console.log('Maze ID: '+responseText);
            var input = document.getElementById('mazeIdInput');
            input.value = responseText;
            getMazeInfo(responseText,true);
        }else{
            console.log('Error creating maze: '+responseText);
        }
	});
}

function handleGetExistingMaze(){
    var input = document.getElementById('mazeIdInput');
    if(!isNaN(input.value)){
        getMazeInfo(input.value,true);
    }
}

function getMazeInfo(id,getTilesOnSuccess){
    //GET - mazes/{id}
    if(id!=undefined){
        makeApiCall('mazes/'+id,'GET',null,'application/json',function(responseText){
            if(responseText!=''){
                maze = JSON.parse(responseText);
                displayMazeInfo();
                if(maze.status==='STARTED'){
                    if(getTilesOnSuccess){
                        getTiles(maze.id);
                    }
                }
            }
        });
    }else{
        console.log('id is undefined');
    }
}

function deleteMaze(){
	//DELETE - mazes/{id}
}

function handleMoveButtonClick(dir){
    if(maze!=null && maze.status==='STARTED' && maze.secondsLeft>0){
        console.log('nextTile: '+area[dir]);
        if(noBump && area[dir]==='WALL'){
            console.log('Bump prevented!');
        }else{
            step(dir);
        }
    }
}

function step(dir){
	//POST - mazes/{id}/steps
	// = NORTH, EAST, SOUTH, WEST, ON
    isMoving = true;
    //TODO display moving animation
    makeApiCall('mazes/'+maze.id+'/steps','POST',{direction:dir},'*/*',function(responseText){
        lastDir = dir;
        getMazeInfo(maze.id,true);
        steps++;
        isMoving = false;
    });
}

function pickupCoin(){
	//POST - mazes/{id}/coins
    if(maze!=null){
        makeApiCall('mazes/'+maze.id+'/coins','POST',null,'*/*',function(responseText){
            //console.log('coin picked up.');
            getMazeInfo(maze.id,true);
        });
    }
}

function makeApiCall(path,method,params,acceptHeader,callback){
	var baseUrl = 'https://coding-challanges.herokuapp.com/api/';
    var request = {
        'url':baseUrl+path,
        'authString': authString,
        'method':method,
        'accept':acceptHeader
    };
    
    if(params!=null){
		var paramString = '';
		var i = 0;
		for(var key in params) {
			paramString += key+'='+params[key];
			if(i<params.length-1)paramString+='&';
			i++;
		}
        if(paramString!='')request.paramString=paramString;
	}

    //console.log('request:',request);
    httpPostAsync('request.php',JSON.stringify(request),function(response){
        //console.log('API response: ',response);
        if(isJson(response)){
            var response = JSON.parse(response);
            if(response.httpCode>=200 && response.httpCode<300){
                callback(response.body);
            }else{
                console.log('API call unsuccessfull: ',response);
            }
        }else{
            console.log('Response is not JSON!');
        }
    });
}

function httpPostAsync(theUrl,jsonString,callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4){
            if(xmlHttp.status == 200){
                callback(xmlHttp.responseText);
            }else{
                console.log('Request failed '+xmlHttp.status+': ',xmlHttp);
            }
        }
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(jsonString);
}

function displayMazeInfo(){
    if(maze!=null){
        var statusOutput = document.getElementById('infoDiv_output');
        var displayText='<table>';
        displayText+='<tr><th>Step count:</th><td>'+steps+'</td></tr>';
        for(var key in maze){
            if(maze[key]!=null){
                if(typeof(maze[key])==='object'){
                    /*
                    displayText+='<tr><th>'+key+':</th><td><table>';
                    var object = maze[key];
                    for(var key1 in object){
                        displayText+='<tr><th>'+key1+':</th><td>'+object[key1]+'</td></tr>';
                    }
                    displayText+='</table></td></tr>';*/
                }else{
                    displayText+='<tr><th>'+key+'</th>:<td>'+maze[key]+'</td></tr>';
                }
            }
        }

        displayText+='</table>';
        statusOutput.innerHTML=displayText;
    }
}

function updateArea(dir){
    if(dir==='NORTH'){
        //copy
        area['SOUTH_WEST'] = area['WEST'];
        area['SOUTH_EAST'] = area['EAST'];
        //clear
        area['NORTH_WEST'] = 'UNEXPLORED';
        area['NORTH_EAST'] = 'UNEXPLORED';
    }else if(dir==='SOUTH'){
        //copy
        area['NORTH_WEST'] = area['WEST'];
        area['NORTH_EAST'] = area['EAST'];
        //clear
        area['SOUTH_WEST'] = 'UNEXPLORED';
        area['SOUTH_EAST'] = 'UNEXPLORED';
    }else if(dir==='WEST'){
        //copy
        area['NORTH_EAST'] = area['NORTH'];
        area['SOUTH_EAST'] = area['SOUTH'];
        //clear
        area['NORTH_WEST'] = 'UNEXPLORED';
        area['SOUTH_WEST'] = 'UNEXPLORED';
    }else if(dir==='EAST'){
        //copy
        area['NORTH_WEST'] = area['NORTH'];
        area['SOUTH_WEST'] = area['SOUTH'];
        //clear
        area['NORTH_EAST'] = 'UNEXPLORED';
        area['SOUTH_EAST'] = 'UNEXPLORED';
    }

    for(var key in maze.tiles){
        area[key] = maze.tiles[key];
    }

    //SMART CORNER FILL
    if(area['NORTH']==='WALL' && area['WEST']==='WALL' && area['NORTH_WEST']==='UNEXPLORED')area['NORTH_WEST']='WALL';
    if(area['NORTH']==='WALL' && area['EAST']==='WALL' && area['NORTH_EAST']==='UNEXPLORED')area['NORTH_EAST']='WALL';
    if(area['SOUTH']==='WALL' && area['WEST']==='WALL' && area['SOUTH_WEST']==='UNEXPLORED')area['SOUTH_WEST']='WALL';
    if(area['SOUTH']==='WALL' && area['EAST']==='WALL' && area['SOUTH_EAST']==='UNEXPLORED')area['SOUTH_EAST']='WALL';

    for(var dir in area){
        var ele = document.getElementById('view_'+dir);
        ele.removeAttribute('class');
        ele.classList.add('mazeTile');
        ele.classList.add('mazeTile_'+area[dir]);
        //TODO disable buttons
    }
}

function prettyUpJson(json){
    if(isJson(json)){
        return json.replace(/":/g,'"</b>:')
                    .replace(/,"/g,',<br>"')
                    .replace(/{/g,'{<br>')
                    .replace(/}/g,'<br>}')
                    .replace(/<br>"/g,'<br>&emsp;<b>"');
    }else{
        return json;
    }
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}