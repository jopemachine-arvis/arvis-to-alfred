import { convert } from './internalConverter';

export const transformCommandsToDAG = (commands: any[]) => {
  let connectionsRet: any[] = [];
  let objectsRet: any[] = [];
  const uidata = [];

  commands.forEach((trigger) => {
    const { connections, objects } = (convert(trigger)) as { objects: any[], connections: any };
    if (objects && connections) {
      objectsRet = [...objectsRet, ...objects];
      connectionsRet = { ...connectionsRet, ...connections };
    } else {
      throw new Error('Error occured in transformCommandsToDAG.\nTrigger: ' + trigger);
    }
  });

  return {
    objects: objectsRet,
    connections: connectionsRet
  }
};