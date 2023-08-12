import "./App.css";
import Eliza from "./components/Eliza";
import Greet from "./components/Greet";
import GreetServerStream from "./components/GreetServerStream";
import GreetClientStream from "./components/GreetClientStream";
import GreetBidiStream from "./components/GreetBidiStream";

function App() {
  return (
    <>
      <Eliza />
      <Greet />
      <GreetServerStream />
      <GreetClientStream />
      <GreetBidiStream />
    </>
  );
}

export default App;
