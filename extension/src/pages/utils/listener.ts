interface KeyboardCallbacks {
  doubleSpace?: () => void;
  doubleEsc?: () => void;
}

export function setupKeyboardListeners(callbacks: KeyboardCallbacks): void {
  let lastKeyPressTime = 0;
  let keyPressCount = 0;
  const keydownAction = (event: any, isBody = true) => {
    if (event.repeat) {
      return;
    }
    if (isBody && event.srcElement.tagName === 'INPUT') {
      return;
    }
    const currentTime = new Date().getTime();

    if (event.keyCode === 17) {
      if (currentTime - lastKeyPressTime <= 300) {
        keyPressCount++;
        if (keyPressCount === 2 && callbacks.doubleSpace) {
          // 连续按两下空格的回调
          callbacks.doubleSpace();
        }
      } else {
        keyPressCount = 1;
      }
    } else if (event.key === 'Escape') {
      if (currentTime - lastKeyPressTime <= 300) {
        keyPressCount++;
        if (keyPressCount === 2 && callbacks.doubleEsc) {
          // 连续按两下 Esc 的回调
          callbacks.doubleEsc();
        }
      } else {
        keyPressCount = 1;
      }
    } else {
      // 如果中间参杂其他字符重置
      keyPressCount = 0;
    }

    lastKeyPressTime = currentTime;
  };

  document.addEventListener('keydown', (event: any) =>
    keydownAction(event, true)
  );
  // 注入所有input
  const inputArr = document.querySelectorAll('input');
  Array.from(inputArr).map((input: any) => {
    input.addEventListener('keydown', (event: any) =>
      keydownAction(event, false)
    );
  });
}
