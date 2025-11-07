// Mock for inquirer
const inquirer = {
  prompt: async (questions: any[]) => {
    const result: any = {};
    questions.forEach(q => {
      if (q.type === 'input') {
        result[q.name] = 'MockedInput';
      } else if (q.type === 'list') {
        result[q.name] = 0;
      } else if (q.type === 'confirm') {
        result[q.name] = false;
      }
    });
    return result;
  },
};

export default inquirer;
