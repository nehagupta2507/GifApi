let existingButtons = [];
let apiKey = "4AQQi7IMta3mLmMdyk5ygHAEWcjibddn";
let searchResult = "";
let existingWords = ["cat", 'puppy', "happy","dab","no", "coding","game of thrones", "Happy Birthday"];
//let buttonColors = ["btn-danger", "btn-light", "btn-primary"];

function existingButton() {
  for (i = 0; i < existingWords.length; i++) {
    existingButtons.push(existingWords[i]);
  }

}
$(document).ready(function () {
  existingButton();

  function renderButtons() {
    $("#addButtons").empty();
    for (let i = 0; i < existingButtons.length; i++) {
      // created method to color the button differently 
        let button = $("<button>");
        button.addClass("createButton btn btn-info btn-outline-Light mx-2");
        button.attr("data-name", existingButtons[i]);
        button.text(existingButtons[i]);
        $("#addButtons").append(button);
      }
    }
  $(document).on("click", ".createButton", searchGifs);
  $("#inputButton").on("click", function (event) {
    event.preventDefault();
    searchResult = $("#searchInput").val().trim();
    if (searchResult != "") {
      existingButtons.push(searchResult);
      event.preventDefault();
      searchGifs(searchResult);
      renderButtons();
    }
    // added this else statement so that it wont generate any blank buttons , 
    else { alert("pick a topic please") }
    renderButtons();
  });
  //onclick event for when the user clicks a button
  function searchGifs() {
    let searchImage = $(this).attr("data-name");
    if (searchImage === undefined) {
      searchImage = searchResult;
    }
    // switching the protocol from http to https, to make it work properly when deployed to Github Page
    let queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchImage + "&api_key=" + apiKey + "&limit=20";
    //ajax
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      let results = response.data;
      console.log(results)
      for (let i = 0; i < results.length; i++) {
        let resultDiv = $("<div class='flex-column result m-2'>");
        let p = $("<p class='d-flex p-2 desc' >").text("Rating: " + results[i].rating);
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
    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
    let state = $(this).attr("data-state");
    // console.log(state)
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
  };
  
  $("#clearGif").click(function () {
    existingButtons = [];
    existingButton();
    renderButtons();
    searchResult = "";  
    $("#gifImage").empty();
  });
})
