import React, { useState } from 'react';
import './App.css';
import {SideBar} from "./components/SideBar";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {RemoteSerive} from "./RemoteSerive";
import {Button} from "@material-ui/core";
import {Register} from "./components/Register"
import { Login } from './components/Login';
import { Tokens } from './components/Tokens';
import {IssueToken} from "./components/IssueTokens";
// @ts-ignore
window.text = RemoteSerive
function App() {
    const service = new RemoteSerive("http://localhost:3001")
    const [tokens,setTokens] = useState([{tokenId: "", balance: ""}])

    const loadTokens = () => {service.getAllTokens().then(res=>setTokens(res));return }

  return (
      <Router>
          <div className="App">
              <SideBar/>
              <main className="content">
                  <Switch>
                      <Route path="/register">
                        <Register registerProxy={(username,password)=>service.register(username,password)}/>
                      </Route>
                      <Route path="/login">
                        <Login loginProxy={async (username,password)=> {
                            await service.login(username, password)
                            loadTokens()
                        }}/>
                      </Route>
                      <Route path="/issue">
                        <IssueToken/>
                      </Route>
                      <Route path="/distribute">

                      </Route>
                      <Route path="/manage">
                        <Tokens tokens={tokens}/>
                      </Route>
                      <Route path="/">
                        <h1>
                            A simple api for creating and managing assets on DigitalBits
                        </h1>
                      </Route>

                  </Switch>
              </main>

          </div>
      </Router>

  )
}

export default App;
