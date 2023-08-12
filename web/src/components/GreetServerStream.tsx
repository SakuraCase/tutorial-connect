import { useState } from "react";
import { GreetService } from "../../gen/greet/v1/greet_connect";
import { useClient } from "../hooks/useClient";

function GreetServerStream() {
  const client = useClient(GreetService);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  return (
    <>
      <h2>GreetServerStream</h2>
      <ol>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ol>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setInputValue("");
          for await (const res of client.greetServerStream({
            name: inputValue,
          })) {
            setMessages((prev) => [...prev, res.greeting]);
          }
          console.log("done");
        }}
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default GreetServerStream;
