var url = "http://192.168.0.132";
var port = "9001";

function list_running_containers(){
	$.post('list_running_containers',function(req,res){
		result_area = document.getElementById('ans');
		while(result_area.firstChild){
		   	result_area.removeChild(result_area.firstChild);
		}
	    var obj = JSON.parse(req.message);
	    if(obj==""){
	        const para = document.createElement('p');
	        para.textContent = "No Container is alive";
	        result_area.appendChild(para);
		    result_area.style.color = "white";
	    }
	    else{
	        obj.forEach((message) => {
            	const li = document.createElement('li');
            	var result = message.Id.slice(0, 12).trim();
	           	li.textContent = message.Image + " , " + result;
	            result_area.appendChild(li);
	        })
	      	result_area.style.color = "white";
	    }
	});
}
function list_available_images(){
	$.post('list_available_images',function(req,res){
		result_area = document.getElementById('ans');
		while(result_area.firstChild){
		    result_area.removeChild(result_area.firstChild);
		}
	    var obj = JSON.parse(req.message);
	    const para = document.createElement('p');
	    para.textContent = "Example: If output is 'xyz:latest , sha256:b65575bf92725cad124e7c0d35d479ee23a3281cf066dcaba86c311bbe5e0e31', then the image name is 'xyz' and image id is first 12 digit of sha256 i.e., b65575bf9272 in this case";
	    result_area.appendChild(para);
        obj.forEach(message => {
			const li = document.createElement('li');
            li.textContent = (message.RepoTags)[0] + " , " + message.Id;
           	result_area.appendChild(li);
        })
        result_area.style.color = "white";
	});
}
function list_all_containers(){
	$.post('list_all_containers',function(req,res){
		result_area = document.getElementById('ans');
		while(result_area.firstChild){
	        result_area.removeChild(result_area.firstChild);
	    }
	    var obj = JSON.parse(req.message);
       	obj.forEach((message) => {
        	console.log(message);
		    const li = document.createElement('li');
		    var result = message.Id.slice(0, 12).trim();
           	li.textContent = message.Image + " , " + result;
            result_area.appendChild(li);
        })
        result_area.style.color = "white";
	});
}
function stop_container(){
	var id = document.getElementById('input1').value;
	document.getElementById('input1').value = "";
	$.post('stop_container',{'id':id},function(req,res){
		result_area = document.getElementById('ans');
		while(result_area.firstChild){
			result_area.removeChild(result_area.firstChild);
		}
	    const para = document.createElement('p');
	    para.textContent = "Done";
	    result_area.appendChild(para);
		result_area.style.color = "white";
	});
}
function start_container(){
	var id = document.getElementById('input2').value;
	document.getElementById('input2').value = "";
	$.post('start_conatiner',{'id':id},function(req,res){
		result_area = document.getElementById('ans');
		while(result_area.firstChild){
		    result_area.removeChild(result_area.firstChild);
		}
	    const para = document.createElement('p');
		para.textContent = "Done";
	    result_area.appendChild(para);
        result_area.style.color = "white";
	});
}
function restart_container(){
	var id = document.getElementById('input3').value;
	document.getElementById('input3').value = "";
	$.post('restart_container',{'id':id},function(req,res){
		result_area = document.getElementById('ans');
		while(result_area.firstChild){
		    result_area.removeChild(result_area.firstChild);
		}
	    const para = document.createElement('p');
	    para.textContent = "Done";
	    result_area.appendChild(para);
       	result_area.style.color = "white";
	});
}
function container_logs(){
	var id = document.getElementById('input4').value;
	document.getElementById('input4').value = "";
	$.post('get_container_logs',{'id':id},function(req,res){
		result_area = document.getElementById('ans');
		while(result_area.firstChild){
			result_area.removeChild(result_area.firstChild);
		}
	    req.string.forEach(message => {
			var result = message.split("#");
			const li = document.createElement('li');
            li.textContent = result;
            result_area.appendChild(li);
        	result_area.style.color = "white";
		});
	});
}
function web_tty(){
	var container_id = prompt("Please enter Container ID");
    $.post('list_running_containers',function(req,res){
	    var obj = JSON.parse(req.message);
	    var flag=false;
	    obj.forEach((message) => {
         	var result = message.Id.slice(0, 12).trim();
	     	if(result==container_id){	
	     		flag=true;
	     	}
	    });
	    if(flag==true){
	    	sessionStorage.setItem("DockerID", container_id);
			window.open(url+":"+port+"/webtty","_blank");
		}
		else{
			alert(container_id + " is not running.");
		}
	});
}
