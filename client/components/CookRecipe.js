import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Artyom from 'artyom.js';
import { withRouter, Link } from 'react-router-dom';
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

    };
    this.step = this.step.bind(this);
    this.sendUserInput = this.sendUserInput.bind(this);
  }

  componentDidUpdate(){
    if (this.props.mochiSays !== ''){
      Mochi.say(this.props.mochiSays)
    }
  }

  sendUserInput(userInput){
    return this.props.submitUserInput(userInput)
  }

  componentDidMount(){
    this.props.getRecipe(this.props.match.params.id);
    this.props.isCooking(true);
  }

  step(event, bool) {
    if (event && event.target.value === 'forward' || bool) this.setState({currentStep: this.state.currentStep + 1});
    else this.setState({currentStep: this.state.currentStep - 1});
  }



  render(){
    Mochi.on(['*'], true).then((i, wildcard) => {
      if (wildcard === 'next' || wildcard === 'next step'){
        this.step(null, true);
        Mochi.say(this.props.recipe.directions[this.state.currentStep]);
      }
      else if (wildcard === 'go back' || wildcard === 'back' || wildcard === 'previous'){
        this.step(null, false);
        Mochi.say(this.props.recipe.directions[this.state.currentStep]);
      }
      else
        this.sendUserInput(wildcard)
    })

    let recipe = this.props.recipe;
    let step = this.props.step;
    let backDisable = false; let forwardDisable = false;
    if (step === -1) backDisable = true;
    if (step === recipe.directions.length - 1) forwardDisable = true;
    return (

      <Wrapper>
        <CurrentStep column>
          {(step > -1) ? <Title> Step {step + 1}: <br />
          {recipe.directions && recipe.directions[step]}
          </Title> : <Title> Ready to get cooking? Hit the play button! </Title>}


          <NextStep>
           {forwardDisable ? <p><b> Eat up! </b></p> :
            <p><b>Up next...</b> {recipe.directions && recipe.directions[step + 1]} </p>
           }
        </NextStep>
        </CurrentStep>

        <IngredientsView column>

          <Title secondary> Ingredients </Title>
            <List>
            {recipe.ingredients && recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
          </List>
          <ControlPanel>
            <button disabled={backDisable} className="btn btn-info btn-lg" value="back" onClick={this.props.goBackward}>
              <span className="glyphicon glyphicon-step-backward" />
            </button>
            &nbsp; &nbsp;
           <button disabled={forwardDisable} className="btn btn-info btn-lg" value="forward" onClick={this.props.goForward} >
              <span className="glyphicon glyphicon-step-forward" />
            </button>
            &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; {/*need better spacing solution*/}
            <Link to={`/recipe/${recipe.id}`} className="btn btn-info btn-lg">
              <span className="glyphicon glyphicon-remove-sign" /> Exit
            </Link>
          </ControlPanel>

        </IngredientsView>

      </Wrapper>

    );
  }
}

const mapState = (state) => {
  return {
    recipe: state.recipe,
    mochiSays: state.ai,
    step: state.currentStep

  };
};
const mapDispatch = (dispatch) => {
  return {
    isCooking: bool => dispatch(action.getCooking(bool)),
    getRecipe: id => dispatch(action.getRecipe(id)),
    submitUserInput(userInput){
      return dispatch(fetchOutput(userInput))
    },
    goForward() {
      return dispatch(action.forward());
    },
    goBackward() {
      return dispatch(action.backward());
    }
  };
};

export default connect(mapState, mapDispatch)(CookRecipe);



