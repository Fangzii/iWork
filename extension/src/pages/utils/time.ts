export const sleeper = (time: number) =>
  new Promise((res) => {
    setTimeout(() => {
      res({ data: 'FINSIH' });
    }, time * 1000);
  });
