
export function enumToConsoleLog(enumType: any, value: any) {
  console.log(enumType[value]);
}

export function logMessageAndVariable(message: string, obj: any) {
  let a: string = JSON.stringify(obj);
  console.log(message + a);
}
