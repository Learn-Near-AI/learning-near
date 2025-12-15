// Test function definitions for the first 10 examples
// Maps example IDs to their available contract functions for testing

export const testFunctions = {
  'hello-world': {
    viewMethods: [
      {
        name: 'hello_world',
        description: 'Returns a greeting message',
        params: [],
        expectedResult: 'Hello, NEAR!',
      },
    ],
    changeMethods: [],
  },
  'storage-basics': {
    viewMethods: [
      {
        name: 'get_message',
        description: 'Get the stored message',
        params: [],
        expectedResult: 'Hello, NEAR storage!',
      },
    ],
    changeMethods: [
      {
        name: 'set_message',
        description: 'Set a new message',
        params: [
          {
            name: 'message',
            type: 'string',
            placeholder: 'Enter message',
            defaultValue: 'Hello from test!',
          },
        ],
      },
    ],
  },
  'state-management': {
    viewMethods: [
      {
        name: 'get_counter',
        description: 'Get the current counter value',
        params: [],
        expectedResult: '0',
      },
    ],
    changeMethods: [
      {
        name: 'increment',
        description: 'Increment the counter by 1',
        params: [],
      },
    ],
  },
  'contract-structure': {
    viewMethods: [
      {
        name: 'get_owner',
        description: 'Get the contract owner account ID',
        params: [],
      },
    ],
    changeMethods: [],
  },
  'view-methods': {
    viewMethods: [
      {
        name: 'get_greeting',
        description: 'Get the greeting string',
        params: [],
        expectedResult: 'hello',
      },
      {
        name: 'get_greeting_length',
        description: 'Get the length of the greeting',
        params: [],
        expectedResult: '5',
      },
    ],
    changeMethods: [],
  },
  'change-methods': {
    viewMethods: [
      {
        name: 'get_greeting',
        description: 'Get the current greeting',
        params: [],
        expectedResult: 'hello',
      },
    ],
    changeMethods: [
      {
        name: 'set_greeting',
        description: 'Set a new greeting',
        params: [
          {
            name: 'greeting',
            type: 'string',
            placeholder: 'Enter greeting',
            defaultValue: 'Hello, NEAR!',
          },
        ],
      },
      {
        name: 'append_suffix',
        description: 'Append a suffix to the greeting',
        params: [
          {
            name: 'suffix',
            type: 'string',
            placeholder: 'Enter suffix',
            defaultValue: ' World',
          },
        ],
      },
    ],
  },
  events: {
    viewMethods: [],
    changeMethods: [
      {
        name: 'set_message',
        description: 'Set a message and emit an event',
        params: [
          {
            name: 'message',
            type: 'string',
            placeholder: 'Enter message',
            defaultValue: 'Test message',
          },
        ],
      },
    ],
  },
  errors: {
    viewMethods: [],
    changeMethods: [
      {
        name: 'assert_positive',
        description: 'Assert that a value is positive',
        params: [
          {
            name: 'value',
            type: 'number',
            placeholder: 'Enter number',
            defaultValue: '10',
          },
        ],
      },
      {
        name: 'assert_owner',
        description: 'Assert that the caller is the owner',
        params: [
          {
            name: 'account_id',
            type: 'string',
            placeholder: 'Enter account ID',
            defaultValue: '',
          },
        ],
      },
    ],
  },
  'gas-optimization': {
    viewMethods: [
      {
        name: 'get_counter',
        description: 'Get the current counter value',
        params: [],
        expectedResult: '0',
      },
    ],
    changeMethods: [
      {
        name: 'bulk_increment',
        description: 'Increment counter multiple times',
        params: [
          {
            name: 'times',
            type: 'number',
            placeholder: 'Number of increments',
            defaultValue: '5',
          },
        ],
      },
    ],
  },
  testing: {
    viewMethods: [
      {
        name: 'add',
        description: 'Add two numbers',
        params: [
          {
            name: 'a',
            type: 'number',
            placeholder: 'First number',
            defaultValue: '2',
          },
          {
            name: 'b',
            type: 'number',
            placeholder: 'Second number',
            defaultValue: '3',
          },
        ],
        expectedResult: '5',
      },
    ],
    changeMethods: [],
  },
}

// Check if an example has test functions (first 10 examples)
export function hasTestFunctions(exampleId) {
  return testFunctions.hasOwnProperty(exampleId)
}

