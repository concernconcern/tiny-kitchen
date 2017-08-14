import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Artyom from 'artyom.js';
import Step from './Step';
import {fetchOutput} from '../store'
const Mochi = new Artyom();

//dummy recipe
let recipeIngredients = ['1 cup flour', '3 flowers', '9 gallons vodka'];
let recipeSteps = ['Mix flour and flowers', 'Blend with vodka', 'Let sit for 2 hours', 'Step 4', 'Step 5', 'Alright thats enough'];

Mochi.initialize({
  lang:"en-GB",
  debug:true, // Show what recognizes in the Console
  listen:true, // Start listening after this
  speed:0.9, // Talk a little bit slow
  mode:"normal", // This parameter is not required as it will be normal by default
  continuous: true,

  soundex: true
})
.then(console.log('initialized mochi'))
.catch((err) => {
    console.error("mochi couldn't be initialized: ", err);
})

/**
 * COMPONENT
 */
class CookingAI extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      i: 0
    }
    this.sendUserInput = this.sendUserInput.bind(this);
  }

  componentDidUpdate(){
    if (this.props.mochiSays !== ''){
      console.log('mochi: ', this.props.mochiSays)
      Mochi.say(this.props.mochiSays)
    }
  }

  sendUserInput(userInput){
    return this.props.submitUserInput(userInput)
  }


  render(){

    let num = this.state.i;


      Mochi.on(['what is *'], true).then((i, wildcard) => {
        console.log('wildcard: ', wildcard)
         this.sendUserInput('what is ' + wildcard)
      })




    return (
    <div>
      <h4> Test Recipe Mochi</h4>
      <ul>
        {recipeIngredients.map((ingredient, index) => {return(<li key={index}>{ingredient}</li>);})}
      </ul>

    <p>Step {this.state.i + 1}: </p>
          {Mochi.on(["Next", "next step"]).then((m) => {
            console.log(this.state.i);
            this.setState({i: this.state.i + 1});
            Mochi.say(recipeSteps[this.state.i]);
          }
            )}
          {Mochi.on(["Go back", "back", "previous"]).then((m) => {
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
    mochiSays: state.ai
  }
}

const mapDispatch = dispatch => {
  return {
    submitUserInput(userInput){
      return dispatch(fetchOutput(userInput))
    }
  }
}

export default connect(mapState, mapDispatch)(CookingAI)
