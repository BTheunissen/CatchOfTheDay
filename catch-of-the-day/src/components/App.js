import React from 'react';
import Header from './Header'
import Order from './Order'
import Inventory from './Inventory'
import Fish from './Fish'
import sampleFishes from '../sample-fishes.js'
import base from '../base';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.addFish = this.addFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);

    // Initial application state
    this.state = {
      fishes: {},
      order: {}
    };
  }

  addFish(fish) {
    // Update our state
    const fishes = {...this.state.fishes};
    // Add in our new fish
    const timeStamp = Date.now();
    fishes[`fish-${timeStamp}`] = fish;
    // Set state
    this.setState({ fishes });
  }

  componentWillMount() {
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`
      , {
        context: this,
        state: 'fishes'
    });

    // check if there is any order in localStorage
    const localStorageRef = localStorage
      .getItem(`order-${this.props.params.storeId}`);

    if(localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }  
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`,
      JSON.stringify(nextState.order));
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }

  addToOrder(key) {
    // Take a copy of the state
    const order = {...this.state.order};
    // Update or add the new number of fish ordered
    order[key] = order[key] + 1 || 1;
    // Update our state
    this.setState({ order }); 
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {
              Object
                .keys(this.state.fishes)
                .map(key => <Fish key={key} index={key} 
                  details={this.state.fishes[key]}
                  addToOrder={this.addToOrder} />) 
            }
          </ul>
        </div>
        <Order 
          fishes={this.state.fishes} 
          order={this.state.order}
        />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} 
          fishes={this.state.fishes} />
      </div>
    )
  }
}

export default App;