
j1=document.getElementById("nombre1");
j2=document.getElementById("nombre2");
cj1=document.getElementById("color1");
cj2=document.getElementById("color2");
buttons=document.getElementsByClassName("botones");

pickers=document.getElementsByClassName("primary_color");

circles=document.getElementsByClassName("profileColor");

function limpia(){
	j1.value="";
	j2.value="";

	cj1.value="#FF0000";
	cj2.value="#2157a3";

	pickers[0].style.backgroundColor=red;
	pickers[1].style.backgroundColor=blue;

	circles[0].style.backgroundColor=pickers[0].value;
	circles[1].style.backgroundColor=pickers[1].value;

	return false;
}

function juega(){
	if(j1.value!="" && j2.value!="")
	{
		localStorage.setItem("nJ1",j1.value);
		localStorage.setItem("nJ2",j2.value);
		localStorage.setItem("cJ1",cj1.value);
		localStorage.setItem("cJ2",cj2.value);

		location.href ='GameC4.html';
	}else{
		alert("Ingresa los nombres de los jugadores");
	}
	return false;
}


function main(){
	let red="#FF8C00";
	let blue="#5F9EA0";

	buttons[0].onclick = limpia;
	buttons[1].onclick = juega;

	pickers[0].style.visibility="hidden";
	pickers[1].style.visibility="hidden";

	circles[0].classList.add("colorPicker");
	circles[0].style.color=red;
	circles[1].classList.add("colorPicker");
	circles[1].style.color=blue;

	pickers[0].onchange=function(){
		circles[0].style.color=pickers[0].value;
	} 

	pickers[1].onchange=function(){
		circles[1].style.color=pickers[1].value;
	}


	circles[0].onclick=function(){
		pickers[0].click();
	}

	circles[1].onclick=function(){
		pickers[1].click();
	}
	
}

main();


