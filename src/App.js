import React, { Component } from 'react';
import './App.css';
import NashData from './components/NashData';
import Navigation from './Nav';
import MapContainer from './Map';
import LargeLogo from './components/LargeLogo';


class App extends Component {
  render() {
    return (
      <div>
      <NashData />

        <Navigation/>
        <MapContainer />
        <LargeLogo />

      </div>
    )
  }
}

export default App;
