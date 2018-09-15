import React,  { Component }  from "react";

import Homer from "../assets/Homer.png"
import style from "../styles/main.scss";

class App extends Component {
    constructor(props){
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event){
        this.setState({value: event.target.value});
    }
    handleSubmit(event){
        console.log('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }
    componentDidMount(){
        function activatePlacesSearch(){
            let input = document.getElementById('Search');
            let autocomplete = new google.maps.places.Autocomplete(input);
          }; 
    }
    render(){
        return(
            <div id="App">
                <div className="inputForm">
                    <form onSubmit={this.handleSubmit}>
                        <h1>Let me help you with weather info</h1>
                        <input placeholder="Enter your location" id="Search" type="text" value={this.state.value} 
                                                       onChange={this.handleChange} />
                    </form>
                    <img src={Homer}></img>
                </div>
                <div className="outputForm"></div>
            </div>
        )
    }
}
export default App;