import { useState } from 'react'
import './App.css'
import { createPromiseClient } from "@bufbuild/connect";
import { createConnectTransport } from "@bufbuild/connect-web";

// Import service definition that you want to connect to.
import { ElizaService } from "../gen/eliza/v1/eliza_connect";

// The transport defines what type of endpoint we're hitting.
// In our example we'll be communicating with a Connect endpoint.
// If your endpoint only supports gRPC-web, make sure to use
// `createGrpcWebTransport` instead.
const transport = createConnectTransport({
  baseUrl: "https://demo.connectrpc.com",
});

// Here we make the client itself, combining the service
// definition with the transport.
const client = createPromiseClient(ElizaService, transport);

function App() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<
    {
      fromMe: boolean;
      message: string;
    }[]
  >([]);
  return <>
    <ol>
      {messages.map((msg, index) => (
        <li key={index}>
          {`${msg.fromMe ? "ME:" : "ELIZA:"} ${msg.message}`}
        </li>
      ))}
    </ol>
    <form onSubmit={async (e) => {
      e.preventDefault();
      setInputValue("");
      setMessages((prev) => [
        ...prev,
        {
          fromMe: true,
          message: inputValue,
        },
      ]);
      const response = await client.say({
        sentence: inputValue,
      });
      setMessages((prev) => [
        ...prev,
        {
          fromMe: false,
          message: response.sentence,
        },
      ]);
    }}>
      <input value={inputValue} onChange={e => setInputValue(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  </>;
}

export default App
