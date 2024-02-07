export function scrollToBottom(element: HTMLBaseElement) {
  const bottom = element.scrollHeight - element.clientHeight;
  element.scrollTo({
    top: bottom,
    behavior: 'smooth',
  });
}
