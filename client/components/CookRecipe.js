import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {fetchOutput} from '../store';
import {Wrapper, IngredientsView, CurrentStep, NextStep, ControlPanel, Title, List} from './styled-components';
import * as action from '../store';
import Mochi from '../mochi';
import Timer from './Timer';

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  else{
    let whereToGo = event.key === 'ArrowDown'|| event.key === 'ArrowLeft' ? this.stepForward : this.stepBackward;
    console.log(event.key)
    whereToGo();
  }
});


class CookRecipe extends React.Component{

  constructor(props){
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
  }

  componentDidMount(){
    this.props.getRecipe(this.props.match.params.id);
    this.props.isCooking(true);

    Mochi.addCommands({
    smart:true,
    indexes: ["*"],
    action: (i, wildcard) => {
      let toggleWords = ['start cooking', 'start', 'stop', 'pause', 'play', 'read'];
      if (wildcard === 'next' || wildcard === 'next step'){
          this.stepForward();
        } else if (wildcard === 'go back' || wildcard === 'back' || wildcard === 'previous'){
          this.stepBackward();
        } else if (toggleWords.includes(wildcard)){
          this.toggleMochi();
        } else {
          this.sendUserInput(wildcard);
        }
      }
    });
    window.addEventListener("keydown", event => {

        let whereToGo = event.key === 'ArrowDown'|| event.key === 'ArrowLeft' ? this.stepBackward : this.stepForward;
        console.log(event.key)
        whereToGo();

    });

  }

  componentDidUpdate(){

    if (this.props.mochiSays !== ''){
      Mochi.say(this.props.mochiSays)
    }
    if (this.props.recipe && this.props.stepToSay !== '' && !this.state.stopped)
      Mochi.say(this.props.stepToSay)
  }

  // handlePress(event){
  //   event.preventDefault()
  //   let whereToGo = event.key === 'ArrowDown'|| event.key === 'ArrowLeft' ? this.stepForward : this.stepBackward;
  //   console.log(event.key)
  //   whereToGo();
  // }

  sendUserInput(userInput){
    return this.props.submitUserInput(userInput)
  }

  toggleMochi(){
    if (!this.state.stopped){
      Mochi.shutUp()
      this.setState({stopped: true})
    }
    else {
      Mochi.say(this.props.recipe.directions[this.props.step])
      this.setState({stopped: false})
    }
  }


  stepForward(){
      let newStep = this.props.step + 1;
      if (this.props.recipe && newStep < this.props.recipe.directions.length-1){
        Mochi.shutUp();
        this.props.changeStepTo(newStep, this.props.recipe.directions);
        let backDisable = (newStep === 0) ? true  : false;
        let forwardDisable = (newStep === this.props.recipe.directions.length - 1) ? true : false;
        this.setState({
          forwardDisable,
          backDisable
        });
      }
    }

  stepBackward(){

      let newStep = this.props.step - 1;
      if (newStep >= 0){
        Mochi.shutUp();
        this.props.changeStepTo(newStep, this.props.recipe.directions);
        let backDisable = (newStep === 0) ? true  : false;
        let forwardDisable = (newStep === this.props.recipe.directions.length - 1) ? true : false;
        this.setState({
          forwardDisable,
          backDisable
        });
      }

    }


  render(){
    let {forwardDisable, backDisable} = this.state
    const recipe = this.props.recipe;
    console.log(this.props.timer);
    return (
      <Wrapper>
        <CurrentStep column>
          <Title> <b>Step {this.props.step + 1}: </b><br />
          {recipe.directions && recipe.directions[this.props.step]}
          </Title>

          <NextStep>
            <p><b>Up next...</b> {recipe.directions && recipe.directions[this.props.step + 1]} </p>
        </NextStep>
        </CurrentStep>

        <IngredientsView column>
          <Title secondary> Ingredients </Title>
            <List>
            {recipe.ingredients && recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
          </List>
          <ControlPanel>
            <button disabled={backDisable} className="btn btn-info btn-lg" value="back" onClick={this.stepBackward}>
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
           <button disabled={forwardDisable} className="btn btn-info btn-lg" value="forward" onClick={this.stepForward} >
              <span className="glyphicon glyphicon-step-forward" />
            </button>
            &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; {/*need better spacing solution*/}
            <Link to={`/recipe/${recipe.id}`} className="btn btn-info btn-lg" onClick={Mochi.shutUp}>
              <span className="glyphicon glyphicon-remove-sign" /> Exit
            </Link>
            <Timer time={this.props.timer} />
          </ControlPanel>
        </IngredientsView>
      </Wrapper>

    );
  }
}

const mapState = (state) => {
  return {
    recipe: state.recipe,
    mochiSays: state.ai.text,
    step: state.currentStep,
    stepToSay: state.sayStep,
    timer: state.ai.time
  };
};
const mapDispatch = (dispatch) => {
  return {
    isCooking: bool => dispatch(action.getCooking(bool)),
    getRecipe: id => dispatch(action.getRecipe(id)),
    submitUserInput(userInput){
      return dispatch(fetchOutput(userInput))
    },
    changeStepTo(newStep, directions){
      dispatch(action.getStep(newStep))
      dispatch(action.sayStep(newStep, directions))
    }
  };
};

export default connect(mapState, mapDispatch)(CookRecipe);
