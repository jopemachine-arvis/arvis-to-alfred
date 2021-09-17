import { generateUid } from './util';
import { matchType, modifierToKeycode } from "./constant";

const conditionMap = new Map<string, string>();

const argTypeToNumber: Record<'no' | 'optional' | 'required', number> = {
  'no': 2,
  'optional': 1,
  'required': 0,
};

const setValue = <T>(value: T, defaultValue?: T) => {
  return value ?? defaultValue ?? '';
};

const handleArgs = (action: ArgsAction) => {
  const object = {} as any;
  object.config = {
    passthroughargument: false,
    variables: {},
    argument: setValue(action.arg),
  };

  object.version = 1;
  return object;
};

const handleOpen = (action: OpenAction) => {
  const object = {} as any;
  object.config = {
    browser: '',
    key: 'spaces',
    utf8: true,
    url: setValue(action.target),
  };

  object.version = 1;
  return object;
};

const handleKeyword = (action: KeywordAction) => {
  const object = {} as any;
  object.config = {
    argumenttype: action.argType ? argTypeToNumber[action.argType] : 0,
    withspace: true,
    keyword: setValue(action.command),
    subtext: setValue(action.subtitle),
    text: setValue(action.title),
  };

  object.version = 1;
  return object;
};

const handleScript = (action: ScriptAction) => {
  const object = {} as any;
  object.config = {
    concurrently: false,
    escaping: 68,
    scriptargtype: 0,
    scriptfile: '',
    type: 0,
    script: setValue(action.script),
  };

  object.version = 2;
  return object;
};

const handleScriptFilter = (action: Command) => {
  const object = {} as any;
  object.config = {
    alfredfiltersresults: false,
    alfredfiltersresultsmatchmode: 0,
    argumenttreatemptyqueryasnil: true,
    argumenttrimmode: 0,
    argumenttype: action.argType ? argTypeToNumber[action.argType] : 0,
    escaping: 102,
    queuedelaycustom: 3,
    queuedelayimmediatelyinitially: true,
    queuedelaymode: 0,
    queuemode: 1,
    scriptargtype: 0,
    scriptfile: '',
    type: 0,
    keyword: setValue(action.command),
    runningsubtext: setValue(action.runningSubtext),
    script: setValue(action.scriptFilter),
    subtext: setValue(action.subtitle),
    title: setValue(action.title),
    withspace: setValue(action.withspace, true)
  };

  object.version = 3;
  return object;
};

const handleClipboard = (action: ClipboardAction) => {
  const object = {} as any;
  object.config = {
    autopaste: false,
    ignoredynamicplaceholders: false,
    transient: false,
    clipboardtext: setValue(action.text),
  };

  object.version = 3;
  return object;
};

const handleConditional = (action: CondAction) => {
  const object = {} as any;

  if (!conditionMap.has(action.if.cond)) {
    const conditionUid = generateUid();
    conditionMap.set(action.if.cond, conditionUid);
  }

  object.config = {
    conditions: {
      inputstring: '',
      matchcasesensitive: false,
      matchmode: 0,
      outputlabel: '',
      uid: conditionMap.get(action.if.cond),
      matchstring: setValue(action.if.cond),
    },
    elselabel: 'else'
  };

  object.version = 1;
  return object;
};

const handleNotification = (action: NotiAction) => {
  const object = {} as any;
  object.config = {
    lastpathcomponent: false,
    onlyshowifquerypopulated: false,
    removeextension: false,
    text: setValue(action.text),
    title: setValue(action.title)
  };

  object.version = 1;
  return object;
};

const handleKeyDispatching = (action: KeyDispatchingAction) => {
  const object = {} as any;
  object.config = {
    count: 1,
    keycode: -1,
    keymod: action.modifiers ? (modifierToKeycode as any)[action.modifiers] : 0,
    overridewithargument: false,
    keychar: setValue(action.target),
  };

  object.version = 1;
  return object;
};

const handleHotkey = (action: HotkeyAction) => {
  const object = {} as any;
  object.config = {
    action: 0,
    argument: 3,
    argumenttext: '',
    focusedappvariable: false,
    focusedappvariablename: '',
    hotkey: 0,
    hotmod: 0,
    hotstring: '',
    leftcursor: false,
    modsmode: 0,
    relatedAppsMode: 0,
  };

  object.version = 2;
  return object;
};

const objectMaker: any = {
  'args': handleArgs,
  'clipboard': handleClipboard,
  'cond': handleConditional,
  'hotkey': handleHotkey,
  'keyDispatching': handleKeyDispatching,
  'keyword': handleKeyword,
  'notification': handleNotification,
  'open': handleOpen,
  'script': handleScript,
  'scriptFilter': handleScriptFilter,
};

let connections = {} as any;

export const convert = (command: any, parentObject?: any) => {
  const objects = [];

  let obj: any;

  if (command.type && objectMaker[command.type]) {
    obj = {
      uid: generateUid(),
      type: matchType[command.type],
      ...objectMaker[command.type](command),
    };
    objects.push(obj);
  } else {
    obj = parentObject;
  }

  if (parentObject) {
    if (!connections[parentObject.uid]) connections[parentObject.uid] = [];
    if (parentObject.uid !== obj.uid) {
      const node: any = {
        destinationuid: obj.uid,
        modifiers: (modifierToKeycode as any)[command.modifiers] ?? 0,
        modifiersubtext: '',
        vitoclose: false,
      };

      if (obj.config.conditions?.matchstring) {
        node.sourceoutputuid = conditionMap.get(obj.config.conditions!.matchstring);
      }

      connections[parentObject.uid].push(node);
    }
  }

  if (command.actions) {
    if (command.actions.length) {
      command.actions.forEach((action: any) => {
        (convert(action, obj) as any[]).forEach((obj) => objects.push(obj));
      });
    } else {

      // Handle then, else case
      [...command.actions.then, ...command.actions.else].forEach((thenElseAction: any) => {
        (convert(thenElseAction, obj) as any[]).forEach((thenElseObj) => objects.push(thenElseObj));
      });
    }
  }

  if (command.if) {
    // obj => conditional node
    (convert(command.if, obj) as any[]).forEach((obj) => {
      objects.push(obj);
    });
  }

  if (parentObject) return objects;

  const connectionResult = { ...connections };
  connections = {};
  conditionMap.clear();

  return {
    objects,
    connections: connectionResult,
  }
};
