import express from "express";
import bodyParser from "body-parser";
import path from "path"; // To handle file paths
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the "public" folder
const __dirname = path.resolve(); // Get the current directory (needed in ES modules)
app.use(express.static(path.join(__dirname, "public")));

// Serve the frontend for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to handle itinerary generation
app.post("/generate-itinerary", async (req, res) => {
  try {
    const { destination, days, people, desiredFocus, season, budget } = req.body; // Add season

    // Step 1: Log the request body
    console.log("Request Body:", req.body);

    // Step 2: Log the extracted input
    console.log("Received Input:", { destination, days, people, desiredFocus, season, budget });

    // Step 3: Construct the prompt
    const prompt = `
      You are a professional travel planner with expertise in crafting detailed and personalized itineraries. 
      Plan a ${days}-day itinerary for ${people} people in ${destination}, considering the ${budget}, preferences, time constraints, and season of travel. 
      The focus of the trip is ${desiredFocus}. The season is ${season}. The budget is ${budget}.
      Include flights, hotel check-ins, and daily activities that align with the focus and season, and make sure they are fun and manageable for a group of ${people} people.

      Here are a few examples of itineraries that meet the needs of the user. Follow this pattern when creating a new itinerary.
      
      Destination: Japan (Kyoto & Tokyo)
      Days: 4
      People: 2

      Itinerary:

      **Day 1: Arrival in Kyoto & Gion Charm (Budget: $300)**

      * 10:00 AM: Arrive at Kansai International Airport (KIX).
      Take the Haruka Express train to Kyoto Station (~75 mins).
      * 11:30 AM: Check in to a traditional Ryokan in Gion (e.g.,  Gion Hatanaka).
      Ryokans offer a unique cultural experience.
      Pre-booking is essential, especially during peak spring season.
      * 1:00 PM: Lunch at a local restaurant near Gion, trying some Kyo-ryori (Kyoto cuisine).
      * 2:30 PM: Explore Gion, Kyoto's geisha district.
      Stroll through the charming streets, admire the wooden machiya houses, and perhaps catch a glimpse of a geisha or maiko (apprentice geisha).
      * 5:00 PM: Visit Kiyomizu-dera Temple, a beautiful wooden temple with stunning views of Kyoto.
      * 7:00 PM: Dinner at a restaurant in Gion, enjoying traditional Kaiseki cuisine (multi-course Japanese haute cuisine, slightly more expensive option).


      **Day 2: Bamboo Forest & Golden Pavilion (Budget: $250)**

      * 9:00 AM: Take a bus or taxi to Arashiyama Bamboo Grove.
      Enjoy a peaceful walk through the towering bamboo stalks.
      * 11:00 AM: Visit Tenryu-ji Temple, a beautiful Zen temple in Arashiyama.
      * 1:00 PM: Lunch at a restaurant in Arashiyama, perhaps trying some local ramen or soba noodles.
      * 2:30 PM: Take a bus or train to Kinkaku-ji (Golden Pavilion).
      Admire the shimmering gold-leaf covered temple reflecting in the pond.
      * 4:30 PM: Visit Ryoan-ji Temple, famous for its Zen rock garden.
      * 6:00 PM: Return to Gion.
      Dinner at a more casual restaurant.

      Plan a ${days}-day itinerary for ${people} people in ${destination}. Include the same structure and level of detail as the examples above, and tailor it to focus on ${desiredFocus}, taking the season ${season} and ${budget} into account.
    `;

    // Step 4: Log the generated prompt
    console.log("Generated Prompt:", prompt);

    // Step 5: Use the Gemini model to generate content
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // Step 6: Log the raw result from the API
    console.log("Generated Itinerary Result:", result);

    // Retrieve and format the itinerary text
    const rawText = await result.response.text(); // Explicitly call the text function
    const formattedItinerary = rawText.replace(/\. /g, ".\n"); // Add newlines for readability
    res.json({ itinerary: formattedItinerary });
  } catch (error) {
    console.error("Error generating itinerary:", error.message);
    res.status(500).json({
      error: "An error occurred while generating the itinerary.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
