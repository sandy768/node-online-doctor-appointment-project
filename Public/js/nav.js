let navbar= document.getElementById("navbar");

window.onscroll = function() {
  scrollFunction()
};

function scrollFunction() {
//   console.log(document.documentElement.scrollTop);
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    navbar.style.backgroundColor="rgb(34, 63, 63)"
  } else {    
    navbar.style.backgroundColor="transparent"
  }
}