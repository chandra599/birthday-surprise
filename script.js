window.addEventListener("DOMContentLoaded",()=>{

setTimeout(()=>{
document.getElementById("loader").style.display="none";
document.getElementById("hero").classList.remove("hidden");
document.body.style.overflow="auto";
},4000);

const startBtn=document.getElementById("startBtn");
const envelope=document.getElementById("envelope");
const letter=document.getElementById("typedLetter");
const letterSection=document.getElementById("letterSection");

const message=`Happy Birthday to the most wonderful person in my life ❤️

Thank you for making every day brighter.

Every conversation with you has become a beautiful memory.

Your smile makes my world happier.

I hope today brings you as much happiness as you bring into my life.

This little surprise is made with all my love.

Happy Birthday once again, My Cutu Baby ❤️

Love,

Chandra ❤️`;

let i=0;

function typeWriter(){
 if(i<message.length){
   letter.innerHTML+=message.charAt(i);
   i++;
   setTimeout(typeWriter,35);
 }
}

startBtn.addEventListener("click",()=>{
 letterSection.scrollIntoView({behavior:"smooth"});
 setTimeout(()=>{
   envelope.classList.add("open");
   letter.innerHTML="";
   i=0;
   typeWriter();
 },800);
});

});
