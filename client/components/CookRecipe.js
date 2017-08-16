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
    //starts off mochi not talking
    this.state = {
      stopped: true
    }
    this.sendUserInput = this.sendUserInput.bind(this);
    this.toggleMochi = this.toggleMochi.bind(this);
  }

  componentDidUpdate(){
    if (this.props.mochiSays !== ''){
      Mochi.say(this.props.mochiSays)
    }
    else if (Object.keys(this.props.recipe).length && !this.state.stopped){
      this.setState({stopped: false})
      Mochi.say(this.props.recipe.directions[this.props.step])
    }
  }
  componentDidMount(){
      this.props.getRecipe(this.props.match.params.id);

      //only listen when the user speaks
      if (Mochi.isSpeaking()){
        Mochi.on(['*'], true).then((i, wildcard) => {
        if (wildcard === 'next' || wildcard === 'next step'){
          Mochi.shutUp()
          this.props.goForward()
          Mochi.say(this.props.recipe.directions[this.props.step])
        }
        else if (wildcard === 'go back' || wildcard === 'back' || wildcard === 'previous'){
          Mochi.shutUp()
          this.props.goBackward()
          Mochi.say(this.props.recipe.directions[this.props.step])
        }
        else if (wildcard === 'start cooking' || wildcard === 'start'){
          Mochi.say(this.props.recipe.directions[this.props.step])
          this.toggleMochi()
        }
        else if (wildcard === 'stop' || wildcard === 'pause') {
          Mochi.shutUp()
          this.toggleMochi()
        }
        else
          this.sendUserInput(wildcard)
      })
    }
  }

  sendUserInput(userInput){
    return this.props.submitUserInput(userInput)
  }

  toggleMochi(){
    if (Mochi.isSpeaking()){
      Mochi.shutUp()
      this.setState({stopped: true})
    }
    else {
      console.log('mochisays ', this.props.recipe)
      Mochi.say(this.props.recipe.directions[this.props.step])
      this.setState({stopped: false})
    }
  }



  render(){
    let recipe = this.props.recipe;
    let step = this.props.step;
    return (

      <Wrapper>
        <CurrentStep column>
          <Title> Step {step + 1}: <br />
          {recipe.directions && recipe.directions[step]}
          </Title>
          <NextStep>
            Up next...{recipe.directions && recipe.directions[step + 1]}
          </NextStep>
        </CurrentStep>

        <IngredientsView column>
          <Title secondary> Ingredients </Title>
            <List>
            {recipe.ingredients && recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
          </List>
          <ControlPanel>
            <button type="button" className="btn btn-info btn-lg" value="back" onClick={this.props.goBackward}>
              <span className="glyphicon glyphicon-step-backward" />
            </button>
            &nbsp; &nbsp;
            <button type="button" className="btn btn-info btn-lg" onClick={this.toggleMochi}>
              {
                this.state.stopped ?
                <span className="glyphicon glyphicon-play"/>
                :
                <span className="glyphicon glyphicon-pause" />
              }
            </button>
            &nbsp; &nbsp;
           <button type="button" className="btn btn-info btn-lg" value="forward" onClick={this.props.goForward} >
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
    mochiSays: state.ai,
    step: state.currentStep
  };
};
const mapDispatch = (dispatch) => {
  return {
    getRecipe: id => dispatch(action.getRecipe(id)),
    submitUserInput(userInput){
      return dispatch(fetchOutput(userInput))
    },
    goForward() {
      console.log('go forward');
      Mochi.shutUp()
      return dispatch(action.forward());
    },
    goBackward() {
      Mochi.shutUp()
      return dispatch(action.backward());
    }
  };
};

export default connect(mapState, mapDispatch)(CookRecipe);



