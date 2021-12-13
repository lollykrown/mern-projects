function randomValues() {
    function generateString() {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  
    function generateNumber() {
      let result = '';
      const characters = '123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    
    return {
      generateString,
      generateNumber
    }
  
  }
  module.exports = randomValues