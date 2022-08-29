import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Start } from "./pages/Start";
import { Callback } from "./pages/Callback";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>GitHub App manifest flow playground</h2>
        <p>
          <a href="https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app-from-a-manifest">
            Related Docs
          </a>
        </p>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Start />} />
              <Route path="callback" element={<Callback />} />
              <Route path="*" element={<Start />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
