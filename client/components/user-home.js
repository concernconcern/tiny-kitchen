import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Artyom from 'artyom.js';
import Step from './Step';

const Momo = new Artyom();

let recipeIngredients = ['1 cup flour', '3 flowers', '9 gallons vodka'];
let recipeSteps = ['Mix flour and flowers', 'Blend with vodka', 'Let sit for 2 hours', 'Step 4', 'Step 5', 'Alright thats enough'];

Momo.initialize({
    lang:"en-GB",
    debug:true, // Show what recognizes in the Console
    listen:true, // Start listening after this
    speed:0.9, // Talk a little bit slow
    mode:"normal", // This parameter is not required as it will be normal by default
    continuous: true,

});

/**
 * COMPONENT
 */
class UserHome extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      i: 0
    }
  }

  // Momo.say('Hello World!');
  render(){
    let num = this.state.i;
      return (
    <div>
      <h4> Test Recipe </h4>
      <ul>
        {recipeIngredients.map(ingredient => {return(<li>{ingredient}</li>);})}
      </ul>
{/**   Momo.on(["Next"]).then(function(i){
       <Step text={recipeSteps[i]}>
       i++
}); **/}
<p>Step {this.state.i + 1}: </p>
      {Momo.on(["Next", "next step"]).then((m) => {
        console.log(this.state.i);
        this.setState({i: this.state.i + 1});
        Momo.say(recipeSteps[this.state.i]);
      }
        )}
      {Momo.on(["Go back", "back", "previous"]).then((m) => {
        console.log(this.state.i);
        this.setState({i: this.state.i - 1});
        // Momo.say(recipeSteps[this.state.i]);
      }
        )}
<Step text={recipeSteps[this.state.i]} />

    </div>
  );
  }

}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
