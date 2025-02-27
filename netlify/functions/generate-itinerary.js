exports.handler = async (event) => {
    const { destination, days, people, desiredFocus, budget, season } = JSON.parse(event.body);
  
    const itinerary = `Your trip to ${destination} for ${days} days with ${people} people focusing on ${desiredFocus}. Budget: ${budget}, Season: ${season}.`;
    return {
      statusCode: 200,
      body: JSON.stringify({ itinerary })
    };
  };
  