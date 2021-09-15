import { v4 as generateUid } from 'uuid';
import { matchType, modifierToKeycode } from "./constant";

const handleArgs = (action: ArgsAction) => {
  const object = {} as any;
  object.config = {
    argument: action.arg,
    passthroughargument: false,
    variables: {},
  }

  object.version = 1;
  return object;
};

const handleOpen = (action: OpenAction) => {
  const object = {} as any;
  object.config = {
    browser: '',
    key: 'spaces',
    url: action.target,
    utf8: true
  }

  object.version = 1;
  return object;
};

const handleKeyword = (action: KeywordAction) => {
  const object = {} as any;
  object.config = {
    argumenttype: 2,
    keyword: action.command,
    subtext: action.subtitle,
    text: action.title,
    withspace: true
  }

  object.version = 1;
  return object;
};

const handleScript = (action: ScriptAction) => {
  const object = {} as any;
  object.config = {
    concurrently: false,
    escaping: 68,
    script: action.script,
    scriptargtype: 0,
    scriptfile: '',
    type: 0
  }

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
    argumenttype: 2,
    escaping: 102,
    keyword: action.command,
    queuedelaycustom: 3,
    queuedelayimmediatelyinitially: true,
    queuedelaymode: 0,
    queuemode: 1,
    runningsubtext: action.runningSubtext,
    script: action.scriptFilter,
    scriptargtype: 0,
    scriptfile: '',
    subtext: action.subtitle,
    title: action.title,
    type: 0,
    withspace: action.withspace
  }

  object.version = 3;
  return object;
};

const handleClipboard = (action: ClipboardAction) => {
  const object = {} as any;
  object.config = {
    autopaste: false,
    clipboardtext: action.text,
    ignoredynamicplaceholders: false,
    transient: false,
  }

  object.version = 3;
  return object;
};

const handleConditional = (action: CondAction) => {
  const object = {} as any;
  object.config = {
    conditions: {
      inputstring: '',
      matchcasesensitive: false,
      matchmode: 0,
      matchstring: action.if.cond,
      outputlabel: '',
      uid: generateUid(),
    },
    elselabel: 'else'
  }

  object.version = 1;
  return object;
};

const handleNotification = (action: NotiAction) => {
  const object = {} as any;
  object.config = {
    lastpathcomponent: false,
    onlyshowifquerypopulated: false,
    removeextension: false,
    text: action.text,
    title: action.title
  }

  object.version = 1;
  return object;
};

const handleKeyDispatching = (action: KeyDispatchingAction) => {
  const object = {} as any;
  object.config = {
    count: 1,
    keychar: action.target,
    keycode: -1,
    keymod: action.modifiers ? (modifierToKeycode as any)[action.modifiers] : 0,
    overridewithargument: false,
  }

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
  }

  object.version = 2;
  return object;
};

const objectMaker: any = {
  'args': handleArgs,
  'clipboard': handleClipboard,
  'cond': handleConditional,
  'keyDispatching': handleKeyDispatching,
  'keyword': handleKeyword,
  'notification': handleNotification,
  'open': handleOpen,
  'script': handleScript,
  'scriptFilter': handleScriptFilter,
  'hotkey': handleHotkey,
};

let connections = {} as any;

export const convert = (command: any, parentObject?: any) => {
  if (!objectMaker[command.type]) return [];

  const obj = {
    uid: generateUid(),
    type: matchType[command.type],
    ...objectMaker[command.type](command),
  };
  const objects = [obj];

  if (!connections[obj.uid]) connections[obj.uid] = [];

  if (parentObject) {
    connections[parentObject.uid].push({
      destinationuid: obj.uid,
      modifiers: (modifierToKeycode as any)[command.modifiers],
      modifiersubtext: '',
      vitoclose: false,
    });
  }

  if (command.actions) {
    command.actions.forEach((action: any) => {
      if (!action.type) {
        // continue
      } else {
        objects.push(convert(action, obj));
      }
    });
  }

  if (parentObject) return objects;

  const connectionResult = { ...connections };
  connections = {};

  return {
    objects,
    connections: connectionResult,
  }
};
