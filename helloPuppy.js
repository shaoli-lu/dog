let timer;
let deleteFirstPhotoDelay;
let currentPosition = 0;
let images = [];
let isPaused = false;
document.getElementById("prev").addEventListener("click", moveBack);
document.getElementById("next").addEventListener("click", moveForward);

function updateSlideShow() {
    console.log("updateSlideShow() is being called");
  const slides = document.getElementsByClassName("slide");
  if (slides.length > 0 && slides[currentPosition]) {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[currentPosition].style.display = "flex"; // Update this line
  }
}
function moveBack() {
    if (currentPosition > 0) {
        currentPosition--;
        updateSlideShow();
    }
}

function moveForward() {
    if (currentPosition < images.length - 1) {
        currentPosition++;
        updateSlideShow();
    }
}

function nextSlide() {
    document.getElementById("slideshow").insertAdjacentHTML("beforeend", `<div class ="slide" style="background-image: url('${images[currentPosition]}');"></div>`)
    deleteFirstPhotoDelay = setTimeout(function() {
        if (!isPaused) {
            document.querySelector(".slide").remove()
        }
    }, 1000)

    if (currentPosition + 1 >= images.length) {
        currentPosition = 0;
    }
    else {
        currentPosition++
    }
}

function pauseSlideshow() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(timer);
        clearTimeout(deleteFirstPhotoDelay);
    } else {
        timer = setInterval(nextSlide, 3000);
    }
}

document.getElementById("slideshow").addEventListener("click", pauseSlideshow);

async function start() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all")
        const data = await response.json()
        createBreedList(data.message)
        loadByBreed("samoyed") // Fetch Samoyed images after the breed list has been created
    }
    catch (e) {
        console.log("There was a problem fetching the breed list from the server")
    }
}

start();


function createBreedList(breedList) {
  const breedSelect = document.getElementById("breed");

  breedSelect.innerHTML = `
    <option>Choose a dog breed here</option> 
    ${Object.keys(breedList)
      .map(function (breed) {
        if (breed === "samoyed") {
          return `<option selected>${breed}</option>`;
        } else {
          return `<option>${breed}</option>`;
        }
      })
      .join("")}
  `;

  breedSelect.addEventListener("change", function (event) {
    const selectedValue = event.target.value;
    loadByBreed(selectedValue);
  });
}


async function loadByBreed(breed) {
    if (breed != "Choose a dog breed here") {
        const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
        const data = await response.json();
        createSlideshow(data.message);
        clearInterval(timer); // Clear the timer to stop the current slideshow
        currentPosition = 0; // Reset the currentPosition to start from the first slide
        timer = setInterval(nextSlide, 3000); // Start the slideshow again
    }
}

function createSlideshow(newImages) {
    images = newImages;
    currentPosition = 0;
    updateSlideShow();
    clearInterval(timer);
    clearTimeout(deleteFirstPhotoDelay);
    window.addEventListener("keypress",function(event){
        switch(event.key.toLowerCase()){
          case 'p': moveBack();break;
          case 'n': moveForward();break;
         
        }
      });
    if (images.length > 1) {
        console.log("createSlideshow() is being called");
        console.log(images);
    document.getElementById("slideshow").innerHTML = `
      <div class="slide" style="background-image: url('${images[0]}');"></div>
      <div class="slide" style="background-image: url('${images[1]}');"></div>
    `
    
        currentPosition += 2;
        if (images.length == 2) currentPosition = 0;
        timer = setInterval(nextSlide, 3000)
    
    } else {

        document.getElementById("slideshow").innerHTML = `
    <div class ="slide" style="background-image: url('${images[0]}');"></div>
    <div class ="slide"></div>
    `
    }

    function nextSlide() {
        document.getElementById("slideshow").insertAdjacentHTML("beforeend", `<div class ="slide" style="background-image: url('${images[currentPosition]}');"></div>`)
        deleteFirstPhotoDelay = setTimeout(function() {
            document.querySelector(".slide").remove()
        }, 1000)

        if (currentPosition + 1 >= images.length) {
            currentPosition = 0;
        }
        else {
            currentPosition++
        }


    }

 

    updateSlideShow();
}
  
