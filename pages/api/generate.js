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

  const animal = req.body.animal;
  console.log("ANIMAL", animal);
  const filteredBody = animal.map(({ id, ...item }) => item);

  try {
    const conversation = [
      {
        role: "system",
        content: "You are a helpful AI that can engage in conversation",
      },
    ];
    conversation.push(...filteredBody);
    console.log("CONVERSATION", conversation);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: conversation,
      temperature: 0.9,
      max_tokens: 2000,
    });
    console.log("COMPLETION", completion.data.choices[0].message);
    // console.log("COMPLETION", completion.data);

    res.status(200).json({ result: completion.data.choices[0].message });
  } catch (error) {
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
