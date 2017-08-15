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
  }

  componentDidMount(){
    this.props.getRecipe(this.props.match.params.id);
  }

  step(event) {
    if (event.target.value === 'forward') this.setState({currentStep: this.state.currentStep + 1});
    else this.setState({currentStep: this.state.currentStep - 1});
  }

  render(){
    console.log('RECIPE', this.props.recipe);
    let recipe = this.props.recipe;
    return (

      <Wrapper>
        <CurrentStep>
          <Title> Step {this.state.currentStep + 1}: <br />
          {recipe.directions && recipe.directions[this.state.currentStep]}
          </Title>
        </CurrentStep>
        <NextStep>
        <p> Up next... {recipe.directions && recipe.directions[this.state.currentStep + 1]} </p>
        </NextStep>
        <IngredientsView>
            <List>
            {recipe.ingredients && recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
          </List>
        </IngredientsView>
        <ControlPanel>
          <button type="button" className="btn btn-info btn-lg" value="back" onClick={this.step}>
            <span className="glyphicon glyphicon-step-backward"   />
          </button>

          <button type="button" className="btn btn-info btn-lg" value="forward" onClick={this.step} >
            <span className="glyphicon glyphicon-step-forward"  />
          </button>
        </ControlPanel>
      </Wrapper>

    );
  }
}

const mapState = (state) => {
  return {
    recipe: state.recipe
  };
};
const mapDispatch = (dispatch) => {
  return {
    getRecipe: id => dispatch(action.getRecipe(id))
  };
};

export default connect(mapState, mapDispatch)(CookRecipe);


