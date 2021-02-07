# Shuttle

Apollo graphql server trace visualization tool

## Docker

### Setup container

```bash
docker run --publish 8021:8021 -d shantry/shuttle:0.0.5
```

### Setup apollo server

Send your query traces to http://localhost:8021/operation

Using an apollo server plugin:

```js
const sendTracePlugin = {
  requestDidStart(reqContext) {
    return {
      willSendResponse({ response }) {
        if (!response.extensions || !response.extensions.tracing) {
          return;
        }

        const op = {
          from: 'api', // name of your service
          date: new Date(),
          operationName: reqContext.request.operationName,
          query: reqContext.request.query,
          tracing: response.extensions.tracing,
        };
        axios.post(`http://localhost:8021/operation`, op);
      },
    };
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true, // don't forget to set tracing to true
  plugins: [sendTracingPlugin],
});
```
