import logo from "./logo.svg";
import "./App.css";
import { Start } from "./pages/Start";
import { Callback } from "./pages/Callback";
import Button from "react-bootstrap/Button";

function App() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const codeParam = urlParams.get("code");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>GitHub App manifest flow playground</h2>
        <p>
          <Button
            variant="secondary"
            href="https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app-from-a-manifest"
            target="_blank"
          >
            Related Docs
          </Button>
        </p>
        {codeParam ? <Callback /> : <Start />}
      </header>
    </div>
  );
}

export default App;
