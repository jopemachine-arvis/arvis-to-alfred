import { v4 as uuid } from 'uuid';

export const insertAttribute = (obj: any, target: string, value: any) => {
  obj[target] = value;
  return obj;
};

export const deleteAttributeIfExist = (obj: any, target: string) => {
  if (obj[target]) delete obj[target];
  return obj;
}

export const replaceAttribute = (obj: any, from: string, to: string) => {
  obj[to] = obj[from];
  delete obj[from];
  return obj;
};

export const ensureAttributeExist = (obj: any, attrName: string) => {
  if (!obj[attrName]) obj = '';
  return obj;
};

export const generateUid = () => {
  return uuid().toUpperCase();
};