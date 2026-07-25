setTimeout(() => {

    document.getElementById("loader").style.display = "none";

    document.getElementById("hero").classList.remove("hidden");

    document.body.style.overflow = "auto";

}, 4000);

document.getElementById("startBtn").addEventListener("click", () => {

    alert("Our Story section will open in the next version ❤️");

});
