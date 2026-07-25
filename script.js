// Loader

setTimeout(() => {

document.getElementById("loader").style.display="none";

document.getElementById("hero").classList.remove("hidden");

document.body.style.overflow="auto";

},4000);


// Gift Button

const startBtn=document.getElementById("startBtn");

const envelope=document.getElementById("envelope");

const letter=document.getElementById("typedLetter");


const message=`Happy Birthday to the most wonderful person in my life ❤️

Thank you for making every day brighter.

Every conversation with you has become a beautiful memory.

Your smile makes my world happier.

I hope today brings you as much happiness as you bring into my life.

This little surprise is made with all my love.

Happy Birthday once again, My Cutu Baby ❤️

Love,

Chandra ❤️`;


startBtn.onclick=()=>{

document.getElementById("letterSection").scrollIntoView({

behavior:"smooth"

});

setTimeout(()=>{

envelope.classList.add("open");

typeWriter();

},900);

}


let i=0;

function typeWriter(){

if(i<message.length){

letter.innerHTML+=message.charAt(i);

i++;

setTimeout(typeWriter,35);

}

}
