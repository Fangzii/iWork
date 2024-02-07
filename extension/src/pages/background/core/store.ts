export const setStore = (key: string, value: any) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }).then(() => {
      const outString = `设置 ${key} 成功, ${value}`;
      console.log(outString);
      resolve(outString);
    });
  });
};

export const getStore = async (key: string) => {
  const result = await chrome.storage.local.get([key]);
  return result[key];
};
