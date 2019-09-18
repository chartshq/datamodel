const context = require.context('./src/converter', true, /\.spec\.js$/);
context.keys().forEach(context);
