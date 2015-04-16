/** @jsx React.DOM */
var AppStore = require('../../stores/AppStore');
var AppActions = require('../../actions/AppActions');

var React = require('react/addons');
var Records = require('../Records/Records.jsx');

require('./App.css');

function getData(){
  // Change from Object to Array;
  var data = AppStore.getData();
  var legiData = Object.keys(data).map((value, key)=>{
      return data[value];
  });
  return legiData;
}

var App = React.createClass({

  getInitialState(){
    return {
      data: []
    }
  },
  
  componentWillMount () {
      this._onChange();
  },

  componentDidMount () {
      AppStore.addChangeListener(this._onChange);
  },
  
  componentWillUnmount () {
      AppStore.removeChangeListener(this._onChange);
  },
  
  _onChange (){
      this.setState({
         data: getData()
      });

  },
   
  render () {
    var { data } = this.state;
    var result = <div className="App-noData"></div>;

    if(data.length > 0){
      result = (
        <div className="App">   
           <Records data={data} />
        </div>
      )
    }
    
    return result;
  }
});

module.exports = App;


