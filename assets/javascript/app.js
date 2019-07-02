let displayButtons = [];
let apiKey = "4AQQi7IMta3mLmMdyk5ygHAEWcjibddn";
let searchResult = "";
let existingWords = ["cat", 'puppy', "happy","dab","no", "coding","game of thrones", "Happy Birthday"];

function displayButton() {
  for (i = 0; i < existingWords.length; i++) {
    displayButtons.push(existingWords[i]);
  }
}
$(document).ready(function () {
  displayButton();

  function renderButtons() {
    $("#addButtons").empty();
    for (let i = 0; i < displayButtons.length; i++) {
        let a = $("<button>");
        a.addClass("createButton btn btn-info btn-outline-Light mx-2");
        a.attr("data-name", displayButtons[i]);
        a.text(displayButtons[i]);
        $("#addButtons").append(a);
      }   
    }
  $(document).on("click", ".createButton", searchGifs);

  $("#inputButton").on("click", function (event) {
    event.preventDefault();
    searchResult = $("#searchInput").val().trim();
    console.log(searchResult);
    if (searchResult != "") {
      displayButtons.push(searchResult);
      event.preventDefault();
      searchGifs(searchResult);
      renderButtons(); 
    }
    else { alert("Please enter something to search!") }
    renderButtons();
  });
  
  function searchGifs() {
    let searchImage = $(this).attr("data-name");
    //Handling undefined searchimage when new button is created
    if (searchImage === undefined) {
      searchImage = searchResult;
    }
    console.log(searchResult);
    // switching the protocol from http to https, to make it work properly when deployed to Github Page
    let queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchImage + "&api_key=" + apiKey + "&limit=10";
    //ajax
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      let results = response.data;
      console.log(results);
      for (let i = 0; i < results.length; i++) {
        let resultDiv = $("<div class='flex-column result m-2'>");
        let p = $("<p class='d-flex m-2 desc'>").text("Rating: " + results[i].rating);
        let imageUrl = response.data[i].images.fixed_width_still.url;
        let imageUrlStill = response.data[i].images.fixed_width_still.url;
        let imageUrlAnimate = response.data[i].images.fixed_width_downsampled.url;
        let newGif = $("<img>").attr("src", imageUrl).attr("data-still", imageUrlStill).attr("data-animate", imageUrlAnimate).attr("data-state", "still");
        newGif.addClass("giphy");
        $("#gifImage").append(newGif);
        resultDiv.append(newGif);
        resultDiv.append(p);
        $("#gifImage").prepend(resultDiv);
      }
    });
  } 

  renderButtons();
  $(document).on("click", ".giphy", animateGif);
  function animateGif() {
    let state = $(this).attr("data-state");
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
  };
  
  $("#clearGif").click(function () {
    displayButtons = [];
    displayButton();
    renderButtons();
    searchResult = "";  
    $("#gifImage").empty();
  });
})
