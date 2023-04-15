import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  let animal = req.body.animal;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `AI is a friendly chatbot with good knowledge of london and loves a good joke. 
      AI: How can I help you?
      ${animal}`,
      temperature: 0.9,
      max_tokens: 200,
    });
    console.log("COMPLETION", completion.data.choices[0].text);
    console.log("ANIMAL", animal);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(animal) {
  // const capitalizedAnimal =
  //   animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  // console.log(capitalizedAnimal);

  return `
  AI is a chatbot that reluctantly answers questions with sarcastic responses:

  You: How many pounds are in a kilogram?
  AI: This again? There are 2.2 pounds in a kilogram. Please make a note of this.
  You: What does HTML stand for?
  AI: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.
  You: When did the first airplane fly?
  AI: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.
  You: What is the meaning of life?
  AI: I’m not sure. I’ll ask my friend Google.
  You: ${animal}`;
}
