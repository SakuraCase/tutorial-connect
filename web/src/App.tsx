import "./App.css";
import { createConnectTransport } from "@bufbuild/connect-web";
import Eliza from "./components/Eliza";
import Greet from "./components/Greet";

// The transport defines what type of endpoint we're hitting.
// In our example we'll be communicating with a Connect endpoint.
// If your endpoint only supports gRPC-web, make sure to use
// `createGrpcWebTransport` instead.
const greetTransport = createConnectTransport({
  baseUrl: "http://localhost:8080",
});

function App() {
  return (
    <>
      <Eliza />
      <Greet transport={greetTransport}></Greet>
    </>
  );
}

export default App;
