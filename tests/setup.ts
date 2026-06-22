// Mock Chrome extension APIs for tests
const storageMock = {
  local: {
    get:    async () => ({}),
    set:    async () => {},
    remove: async () => {},
  },
  sync: {
    get: async () => ({}),
    set: async () => {},
  },
}

global.chrome = {
  storage:  storageMock,
  runtime:  { id: 'test-extension-id', sendMessage: async () => {}, onMessage: { addListener: () => {}, removeListener: () => {} } },
  tabs:     { sendMessage: async () => {}, query: async () => [] },
  alarms:   { create: () => {}, onAlarm: { addListener: () => {} } },
} as unknown as typeof chrome
