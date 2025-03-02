const { chatStart } = require('../routes/v1/chatGoogle');

describe('chatStart', () => {
  it('should return a string', async () => {
      let result;
      try {
        result = await chatStart('こんにちは')
        console.log(process.env.GOOGLE_AI_API)
        expect(typeof result).toBe('string');
      } catch (error) {
        console.error('Test failed. Result:', result);
        throw error;
      }
    });
});