const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generateImage = async (req, res, next) => {
  const { prompt, size, number } = req.body;
  const imageSize =
    size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';

  try {
    // https://grwthx.leoluca.io/api/api/openai/generateimage http://localhost:3000/api/openai/generateimage
    const response = await openai.createImage({
      prompt,
      n: number,
      size: imageSize,
    });
    console.log(response, 'image');
    const imageUrl = response.data?.data;

    res.status(200).json({
      success: true,
      data: imageUrl,
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    res.status(400).json({
      success: false,
      error: 'The image could not be generated',
    });
  }
};

module.exports = { generateImage };
