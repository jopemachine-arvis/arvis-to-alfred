import { convert } from './internalConverter';

const xBasePoint = 100;
const yBasePoint = 100;

const xposUnit = 180;
const yposUnit = 180;

export const transformCommandsToDAG = (commands: any[]) => {
  let connectionsRet: any = {};
  let uidata: any = {};
  let objectsRet: any[] = [];

  let xposPointer = 0;
  let yposPointer = 0;

  commands.forEach((trigger) => {
    const { connections, objects } = (convert(trigger)) as { objects: any[], connections: any };
    if (objects && connections) {
      objectsRet = [...objectsRet, ...objects];
      connectionsRet = { ...connectionsRet, ...connections };

      objects.forEach((obj: any) => {
        if (obj.uid) {
          uidata[obj.uid] = {
            xpos: (xposPointer++) * xposUnit + xBasePoint,
            ypos: (yposPointer) * yposUnit + yBasePoint,
          };
        }
      });

    } else {
      throw new Error('Error occured in transformCommandsToDAG.\nTrigger: ' + trigger);
    }

    xposPointer = 0;
    yposPointer++;
  });

  return {
    objects: objectsRet,
    connections: connectionsRet,
    uidata
  }
};