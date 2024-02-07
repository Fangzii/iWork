export const toBackground = (data: any) => {
  return new Promise(async (resolve) => {
    const res = await chrome.runtime.sendMessage(null, data);
    resolve(res);
  });
};
