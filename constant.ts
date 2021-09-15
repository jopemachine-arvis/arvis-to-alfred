const supportedTypes = [
  'keyword',
  'scriptfilter',
  'keyDispatching',
  'cond',
  'clipboard',
  'args',
  'open',
  'script',
  'notification'
];

const notSupported = () => {
  return `Not supported`;
};

const modifierMap = {
  0: 'normal',
  131072: 'shift',
  262144: 'ctrl',
  524288: 'opt',
  1048576: 'cmd',
  8388608: 'fn'
};

export default {
  notSupported,
  supportedTypes,
  modifierMap,
}
