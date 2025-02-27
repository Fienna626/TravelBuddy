// Handle form submission to generate itinerary
document.getElementById("form-container").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission behavior

  const destination = document.getElementById("destination").value;
  const days = document.getElementById("days").value;
  const people = document.getElementById("people").value;
  const desiredFocus = document.getElementById("desiredFocus").value;
  const budget = document.getElementById("budget").value;
  const season = document.getElementById("season").value;

  // Log form inputs to verify correct data capture
  console.log({ destination, days, people, desiredFocus, budget, season });

  // Function to format text with bold tags for **text**
  function formatTextWithBold(text) {
    return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  }

  try {
    const response = await fetch("/.netlify/functions/generate-itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, days, people, desiredFocus, budget, season }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate itinerary");
    }

    const data = await response.json();
    console.log("Itinerary Response:", data);

    // Use the formatting function
    const formattedItinerary = formatTextWithBold(data.itinerary);

    // Open a new tab and display the itinerary
    const newTab = window.open();
    newTab.document.write(`
      <html>
        <head>
          <title>Generated Itinerary</title>
          <style>
            body {
              font-family: "Times New Roman", Times, serif;
              padding: 20px;
              line-height: 1.6;
              background-color: #f4f4f4;
            }
            h1 {
              text-align: center;
              color: #333;
            }
            div {
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <h1>Your Travel Itinerary</h1>
          <div>${formattedItinerary}</div>
        </body>
      </html>
    `);
    newTab.document.close(); // Close the document to ensure it's rendered
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
});

// Smooth Scroll functionality for the button
document.querySelector('.button').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('#generator').scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
});

// Handle button animation with anime.js
var basicTimeline = anime.timeline({
  autoplay: false
});

// Initialize path elements for stroke dashoffset animation
var pathEls = $(".check");
for (var i = 0; i < pathEls.length; i++) {
  var pathEl = pathEls[i];
  var offset = anime.setDashoffset(pathEl);
  pathEl.setAttribute("stroke-dashoffset", offset);
}
