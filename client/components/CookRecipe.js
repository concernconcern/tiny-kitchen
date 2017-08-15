import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Artyom from 'artyom.js';
import Step from './Step';
import {fetchOutput} from '../store';
import {Wrapper, IngredientsView, CurrentStep, NextStep, ControlPanel, Title, List} from './styled-components';
import * as action from '../store';


const Mochi = new Artyom();

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

class CookRecipe extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      currentStep: 0
    };
    this.step = this.step.bind(this);
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

  componentDidMount(){
    this.props.getRecipe(this.props.match.params.id);
  }

  step(event, bool) {
    if (event && event.target.value === 'forward' || bool) this.setState({currentStep: this.state.currentStep + 1});
    else this.setState({currentStep: this.state.currentStep - 1});
  }

  render(){
    Mochi.on(['*'], true).then((i, wildcard) => {
      console.log('wildcard: ', wildcard)
      if (wildcard === 'next' || wildcard === 'next step'){
        console.log('you said next')
        this.step(null, true);
        Mochi.say(this.props.recipe.directions[this.state.currentStep]);
      }
      else if (wildcard === 'go back' || wildcard === 'back' || wildcard === 'previous'){
        console.log('you want to go back')
        this.step(null, false);
        Mochi.say(this.props.recipe.directions[this.state.currentStep]);
      }
      else
        this.sendUserInput(wildcard)
    })

    console.log('RECIPE', this.props.recipe);
    let recipe = this.props.recipe;
    return (

      <Wrapper>
        <CurrentStep column>
          <Title> Step {this.state.currentStep + 1}: <br />
          {recipe.directions && recipe.directions[this.state.currentStep]}
          </Title>

          <NextStep>
            <p><b>Up next...</b> {recipe.directions && recipe.directions[this.state.currentStep + 1]} </p>
        </NextStep>
        </CurrentStep>

        <IngredientsView column>
          <Title secondary> Ingredients </Title>
            <List>
            {recipe.ingredients && recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
          </List>
          <ControlPanel>
            <button type="button" className="btn btn-info btn-lg" value="back" onClick={this.step}>
              <span className="glyphicon glyphicon-step-backward" />
            </button>
            &nbsp; &nbsp;
           <button type="button" className="btn btn-info btn-lg" value="forward" onClick={this.step} >
              <span className="glyphicon glyphicon-step-forward" />
            </button>
          </ControlPanel>

        </IngredientsView>

      </Wrapper>

    );
  }
}

const mapState = (state) => {
  return {
    recipe: state.recipe,
    mochiSays: state.ai
  };
};
const mapDispatch = (dispatch) => {
  return {
    getRecipe: id => dispatch(action.getRecipe(id)),
    submitUserInput(userInput){
      return dispatch(fetchOutput(userInput))
    }
  };
};

export default connect(mapState, mapDispatch)(CookRecipe);



