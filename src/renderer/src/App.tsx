import React from "react";
import "./App.less";
import BaseicLayout from "@/layout/layout";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";

function App() {

  console.log(store.getState())
  return (
    <Provider store={store}>
      <Router>
        <BaseicLayout />
      </Router>
    </Provider>
  );
}

export default App;
