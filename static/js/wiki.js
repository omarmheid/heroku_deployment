const form = document.querySelector('.searchForm');
form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
// prevent page from reloading when from is submited
event.preventDefault();
//get the value of the input field
const input = document.querySelector('.searchForm-input').value;
// remove qhitespace from the input
const searchQuery = input.trim();
// print 'searchQuery' to the console
fetchResults(searchQuery);
}

// Make a call and Receive json

//takes one parameter captured in the previous step, made AJAX request to Wikipedia, and bring the json to console
function fetchResults(searchQuery) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=1&srsearch=${searchQuery}`;
  
    fetch(endpoint)
    .then(response => response.json())
    .then(data => {
      const results = data.query.search;
      displayResults(results);
  });
  }
  function displayResults(results) {
    console.log(results);
  }
// Display the results on the page

function displayResults(results) {
    // Store a reference to `.searchResults`
    const searchResults = document.querySelector('.searchResults');
    // Remove all child elements
    searchResults.innerHTML = '';
  
    // Loop over results array
    results.forEach(result => {
     const url = encodeURI(`https://en.wikipedia.org/wiki/${result.title}`);
  
     searchResults.insertAdjacentHTML('beforeend',
        `<div class="resultItem">
          <h3 class="resultItem-title">
            <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
          </h3>
          <span class="resultItem-snippet">${result.snippet}</span><br>
          <a href="${url}" class="resultItem-link" target="_blank" rel="noopener">${url}</a>
        </div>`
      );
    });
  }




  //Sliders

  const allRanges = document.querySelectorAll(".form-group");
  allRanges.forEach(wrap => {
    const range = wrap.querySelector(".form-control-range");
    const bubble = wrap.querySelector(".bubble");
  
    range.addEventListener("input", () => {
      setBubble(range, bubble);
    });
    setBubble(range, bubble);
  });
  
  function setBubble(range, bubble) {
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 10;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;
  
    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  }