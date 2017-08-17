import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Artyom from 'artyom.js';
import { Router, withRouter, Link } from 'react-router-dom';
import Step from './Step';
import { fetchOutput } from '../store';
import { Wrapper, IngredientsView, UpNext, ExitLink, Directions, SecondaryWrap, Controls, Sidebar, CurrentStep, ControlPanel, Title, List } from './styled-components';
import * as action from '../store';
import Mochi from '../mochi';
import { Textfit } from 'react-textfit';
import ReactTestUtils from 'react-dom/test-utils';

class CookRecipe extends React.Component {

  constructor(props) {
    super(props);
    //starts off mochi not talking
    let back = (this.props.step === 0) ? true : false;
    let forward = (this.props.recipe && this.props.step === this.props.recipe.directions.length - 1) ? true : false;
    this.state = {
      stopped: true,
      forwardDisable: forward,
      backDisable: back
    }
    this.sendUserInput = this.sendUserInput.bind(this);
    this.toggleMochi = this.toggleMochi.bind(this);
    this.stepBackward = this.stepBackward.bind(this);
    this.stepForward = this.stepForward.bind(this);
    this.exit = this.exit.bind(this);
  }

  componentDidMount() {
    this.props.getRecipe(this.props.match.params.id);
    this.props.isCooking(true);

    Mochi.addCommands({
      smart: true,
      indexes: ["*"],
      action: (i, wildcard) => {
        if (wildcard === 'next' || wildcard === 'next step') {
          this.stepForward();
        } else if (wildcard === 'go back' || wildcard === 'back' || wildcard === 'previous') {
          this.stepBackward();
        } else if (wildcard === 'start cooking' || wildcard === 'start' || wildcard === 'stop' || wildcard === 'pause') {
          this.toggleMochi();
        } else {
          this.sendUserInput(wildcard);
        }
      }
    });
    window.addEventListener("keydown", event => {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }
      else {
        if (event.key === 'ArrowDown' || event.key === 'ArrowLeft')
          this.stepBackward()
        else if (event.key === 'ArrowUp' || event.key === 'ArrowRight')
          this.stepForward()
        else
          return
      }
    });

  }

  componentDidUpdate() {

    if (this.props.mochiSays !== '') {
      Mochi.say(this.props.mochiSays)
    }
    if (this.props.recipe && this.props.stepToSay !== '' && !this.state.stopped)
      Mochi.say(this.props.stepToSay)

  }

  sendUserInput(userInput) {
    return this.props.submitUserInput(userInput)
  }

  toggleMochi() {
    if (!this.state.stopped) {
      Mochi.shutUp()
      this.setState({ stopped: true })
    }
    else {
      Mochi.say(this.props.recipe.directions[this.props.step])
      this.setState({ stopped: false })
    }
  }


  stepForward(){
      let newStep = this.props.step + 1;
      if (this.props.recipe && newStep < this.props.recipe.directions.length){
        Mochi.shutUp();
        this.props.changeStepTo(newStep, this.props.recipe.directions);
        let backDisable = (newStep === 0) ? true  : false;
        let forwardDisable = (newStep === this.props.recipe.directions.length) ? true : false;
        this.setState({
          forwardDisable,
          backDisable
      });
    }
  }

  stepBackward() {

    let newStep = this.props.step - 1;
    if (newStep >= 0) {
      Mochi.shutUp();
      this.props.changeStepTo(newStep, this.props.recipe.directions);
      let backDisable = (newStep === 0) ? true : false;
      let forwardDisable = (newStep === this.props.recipe.directions.length - 1) ? true : false;
      this.setState({
        forwardDisable,
        backDisable
      });
    }
  }

  exit() {
    console.log('exiting');
    Mochi.shutUp();
  }


  render() {
    let { forwardDisable, backDisable } = this.state
    const recipe = this.props.recipe;
    return (
      <Wrapper column height>
        <SecondaryWrap>
          <CurrentStep>
            <Textfit mode="multi">
              <Title>Step {this.props.step + 1}:</Title>
              <Directions>{recipe.directions[this.props.step]}</Directions>
            </Textfit>
          </CurrentStep>
          <Sidebar>
            <ExitLink to={`/recipe/${recipe.id}`} onClick={this.exit}>X</ExitLink>
            <Title secondary>Ingredients</Title>
            <List>
              {recipe.ingredients && recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
            </List>
            <Title secondary>Timer</Title>
            <Title>00:00</Title>
          </Sidebar>
        </SecondaryWrap>
        <ControlPanel>
          <UpNext>
            <Title secondary style={{ display: "inline", padding: "5px 0" }}>Up next...</Title>
            {recipe.directions[this.props.step + 1]}
          </UpNext>
          <Controls>
            <button disabled={backDisable} className="btn btn-info btn-lg" value="back" onClick={this.stepBackward}>
              <span className="glyphicon glyphicon-step-backward" />
            </button>
            &nbsp; &nbsp;
            <button type="button" className="btn btn-info btn-lg" onClick={this.toggleMochi}>
              {
                this.state.stopped ?
                  <span className="glyphicon glyphicon-play" />
                  :
                  <span className="glyphicon glyphicon-pause" />
              }
            </button>
            &nbsp; &nbsp;
           <button disabled={forwardDisable} className="btn btn-info btn-lg" value="forward" onClick={this.stepForward} >
              <span className="glyphicon glyphicon-step-forward" />
            </button>
          </Controls>
        </ControlPanel>
      </Wrapper>

    );
  }
}

const mapState = (state) => {
  return {
    recipe: state.recipe,
    mochiSays: state.ai,
    step: state.currentStep,
    stepToSay: state.sayStep
  };
};
const mapDispatch = (dispatch) => {
  return {
    isCooking: bool => dispatch(action.getCooking(bool)),
    getRecipe: id => dispatch(action.getRecipe(id)),
    submitUserInput(userInput) {
      return dispatch(fetchOutput(userInput))
    },
    changeStepTo(newStep, directions) {
      dispatch(action.getStep(newStep))
      dispatch(action.sayStep(newStep, directions))
    }
  };
};

export default connect(mapState, mapDispatch)(CookRecipe);
