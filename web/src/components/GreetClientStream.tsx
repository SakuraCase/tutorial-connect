import { useState } from "react";
import { GreetService } from "../../gen/greet/v1/greet_connect";
import { useClient } from "../hooks/useClient";

function GreetClientStream() {
  const client = useClient(GreetService);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  return (
    <>
      <h2>GreetClientStream</h2>
      <ol>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ol>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setInputValue("");

          await client
            .greetClientStream(
              (async function* () {
                for (let i = 0; i < 3; i++) {
                  yield { name: inputValue };
                }
              })()
            )
            .then((res) => {
              setMessages((prev) => [...prev, res.greeting]);
            })
            .catch((e) => {
              setMessages((prev) => [...prev, e.message]);
            });
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

export default GreetClientStream;
