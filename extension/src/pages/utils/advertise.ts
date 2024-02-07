export const adInit = () => {
  const makeMulti = function (string: any) {
    let l = new String(string);
    l = l.substring(l.indexOf('/*') + 3, l.lastIndexOf('*/'));
    return l;
  };

  const string = `
  __                      _ _ 
  / _|                    (_|_)
 | |_ __ _ _ __   __ _ _____ _ 
 |  _/ _  | '_ \\ / _  |_  / | |
 | || (_| | | | | (_| |/ /| | |
 |_| \\__,_|_| |_|\\__, /___|_|_|
                  __/ |        
                 |___/
  `;
  console.log(string);
  console.log(
    '%c[iWork]合作邮箱： fangzicheng@fangzicheng.cn',
    'color:red;font-weight:bold;'
  );
};
