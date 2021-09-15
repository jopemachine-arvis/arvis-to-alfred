const matchType: any = {
  'args': 'alfred.workflow.utility.argument',
  'clipboard': 'alfred.workflow.output.clipboard',
  'cond': 'alfred.workflow.utility.conditional',
  'keyDispatching' : 'alfred.workflow.output.dispatchkeycombo',
  'keyword': 'alfred.workflow.input.keyword',
  'notification': 'alfred.workflow.output.notification',
  'open': 'alfred.workflow.action.openurl',
  'script': 'alfred.workflow.action.script',
  'scriptfilter': 'alfred.workflow.input.scriptfilter',
  'hotkey': 'alfred.workflow.trigger.hotkey'
}

const notSupported = () => {
  return `Not supported`;
};

const modifierToKeycode = {
  'normal': 0,
  'shift': 131072,
  'ctrl': 262144,
  'opt': 524288,
  'cmd': 1048576,
  'fn': 8388608,
}

export {
  notSupported,
  matchType,
  modifierToKeycode,
}
