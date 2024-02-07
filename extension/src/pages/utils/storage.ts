import { toBackground } from './postman';

export async function getTemplateGlobal() {
  const test = await toBackground({
    action: 'store.get',
    data: { key: 'template' },
  });
  return test;
}

export async function setTemplateGlobal(value: any) {
  return await toBackground({
    action: 'store.set',
    data: { key: 'template', value },
  });
}
