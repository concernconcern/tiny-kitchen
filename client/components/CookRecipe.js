import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Router, withRouter, Link } from 'react-router-dom';
import { fetchOutput } from '../store';
import { Wrapper, IngredientsView, AccentButton, UpNext, ExitLink, Directions, SecondaryWrap, Controls, Sidebar, CurrentStep, ControlPanel, Title, List } from './styled-components';
import * as action from '../store';
import Mochi, {initializeMochi} from '../mochi';
import { Textfit } from 'react-textfit';
import ReactTestUtils from 'react-dom/test-utils';
import InfoModal from './InfoModal';
import Timer from './Timer';
import IconButton from 'material-ui/IconButton';
import history from '../history'


class CookRecipe extends React.Component {

  constructor(props) {
    super(props);
    //starts off mochi not talking
    let back = (this.props.step === 0) ? true : false;
    let forward = (this.props.recipe && this.props.step === this.props.recipe.directions.length - 1) ? true : false;
    this.state = {
      stopped: true,
      forwardDisable: forward,
      backDisable: back,
      stepSaid: false,
      onFirstStep: true
    }

    this.sendUserInput = this.sendUserInput.bind(this);
    this.toggleMochi = this.toggleMochi.bind(this);
    this.stepForward = this.stepForward.bind(this);
    this.stepBackward = this.stepBackward.bind(this);
    this.exit = this.exit.bind(this);

  }

  componentDidMount() {
    this.props.getRecipe(this.props.match.params.recipeid);
    this.props.isCooking(true);

    initializeMochi();
    Mochi.addCommands([
      {
        indexes: ['repeat', 'start', 'stop', 'pause', 'play', 'read', 'next', 'nextStep', 'back', 'previous', 'go back', 'exit'],
         action: (i) => {
           if (i >= 0 && i < 6){
            this.toggleMochi()
          } else if (i >= 6 && i < 8){
            this.stepForward();
          } else if (i >= 8 && i < 11) {
            this.stepBackward();
          } else if (i === 11) {
            let recipe = this.props.recipe;
            let userId = this.props.userId;
            let link = recipe.id === 1 ? "/" : `/recipe/${recipe.id}/user/${userId}`
            this.exit(null, link);
          }
        }
      },
      {
      smart: true,
      indexes: ['help me *'],
       action: (i, wildcard) => this.sendUserInput(wildcard)
     },
     {
       smart: true,
       indexes: ['mochi *'],
       action: (i, wildcard) => this.sendUserInput(wildcard)
     },
     {
       smart: true,
       indexes: ['what is *'],
       action: (i, wildcard) => this.sendUserInput(wildcard)
     },
     {
       indexes: ['don\'t listen to me'],
       action: (i) => Mochi.dontObey()
     }
    ]);

    window.addEventListener("keydown", event => {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }
      else {
        if (event.key === 'ArrowDown' || event.key === 'ArrowLeft')
          this.stepBackward()
        else if (event.key === 'ArrowUp' || event.key === 'ArrowRight')
          this.stepForward()
        else if (event.key === 'Escape') {
          let recipe = this.props.recipe;
          let userId = this.props.userId;

          let link = recipe.id === 1 ? "/" : `/recipe/${recipe.id}/user/${userId}`
         this.exit(null, link);
       }

        else return;
      }
    });
    if (this.state.onFirstStep && this.props.recipe) {
      console.log('on first step and recipe')
      this.props.changeStepTo(this.props.step, this.props.recipe.directions)
    }
  }

  componentWillUnmount(){
    Mochi.fatality();
  }

  componentDidUpdate() {
    console.log('updated store state: ', this.state)
    if (this.props.mochiSays !== '') {
      Mochi.say(this.props.mochiSays)
    }
    if (this.state.onFirstStep && this.props.recipe && !this.state.stopped) {
      console.log('on first step and recipe')
      this.props.changeStepTo(this.props.step, this.props.recipe.directions)
      Mochi.say(this.props.stepToSay)
    }

    if (this.props.stepToSay !== '' && this.props.mochiSays === '' && !this.state.stopped && this.props.step !== 0 && !this.state.stepSaid){
      Mochi.say(this.props.stepToSay)
    }
  }

  sendUserInput(userInput) {
    return this.props.submitUserInput(userInput)
  }

  toggleMochi() {
    if (!this.state.stopped) {
      Mochi.shutUp()
      //this.changeStepTo(this.prop.step, this.props.recipe.directions)
      this.setState({ stopped: true, stepSaid: false })
    }
    else {
      if (this.props.stepToSay !== '') Mochi.say(this.props.stepToSay)
      this.setState({ stopped: false, stepSaid: true })
    }
  }


  stepForward() {
    this.setState({ stepSaid: true, onFirstStep: false })

    let newStep = this.props.step + 1;
    if (this.props.recipe && newStep < this.props.recipe.directions.length) {
      Mochi.shutUp();
      this.props.changeStepTo(newStep, this.props.recipe.directions);
      let backDisable = (newStep === 0) ? true : false;
      let forwardDisable = (newStep === this.props.recipe.directions.length) ? true : false;
      this.setState({
        forwardDisable,
        backDisable
      });
      if (this.state.stepSaid) {
        this.setState({ stepSaid: false, stopped: false })
      }
    }
  }

  stepBackward() {
    this.setState({ stepSaid: true, onFirstStep: false })
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
      if (this.state.stepSaid) {
        //Mochi.say(this.props.stepToSay)
        this.setState({ stepSaid: false, stopped: false })
      }
    }
  }

  exit(e, link) {
    Mochi.shutUp();
    if (link) history.push(link)

  }


  render() {
    let { forwardDisable, backDisable } = this.state
    let { recipe, userId } = this.props;
    let link = recipe.id == 1 ? "/" : userId ? `/recipe/${recipe.id}/user/${userId}` : `/recipe/${recipe.id}`

    return (

      <Wrapper column height>
        <SecondaryWrap>
          <CurrentStep>
            <Textfit mode="multi">
              <Title>Step {this.props.step + 1} of {recipe.directions.length}:</Title>
              <Directions>{recipe.directions[this.props.step]}</Directions>
            </Textfit>
          </CurrentStep>
          <Sidebar>
            <InfoModal />
            <ExitLink to={link} onClick={this.exit}><i className="material-icons" style={{ fontSize: "45px" }}>clear</i></ExitLink>
            <Title secondary>Ingredients</Title>

            <List>
              {recipe.ingredients && recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
            </List>

            <Timer />

          </Sidebar>
        </SecondaryWrap>
        <ControlPanel>
          <UpNext>
            <Title secondary style={{ display: "inline", padding: "5px 0" }}>Up next...&nbsp;</Title>
            {recipe.directions[this.props.step + 1]}
          </UpNext>
          <Controls>
            <IconButton
              iconStyle={{ fontSize: "60px", color: "#59a5f6" }}
              iconClassName="material-icons"
              tooltip="Previous Step"
              disabled={backDisable}
              value="back"
              onClick={this.stepBackward}
              tooltipPosition="bottom-right">
              keyboard_arrow_left
        </IconButton>
            {
              this.state.stopped ?
                <IconButton
                  iconStyle={{ fontSize: "60px", color: "#59a5f6" }}
                  iconClassName="material-icons"
                  tooltip="Start Mochi"
                  onClick={this.toggleMochi}
                  tooltipPosition="bottom-right">
                  play_circle_outline
        </IconButton>
                :
                <IconButton
                  iconStyle={{ fontSize: "60px", color: "#59a5f6" }}
                  iconClassName="material-icons"
                  tooltip="Pause Mochi"
                  onClick={this.toggleMochi}
                  tooltipPosition="bottom-right">
                  pause
        </IconButton>
            }
            <IconButton
              disabled={forwardDisable}
              iconStyle={{ fontSize: "60px", color: "#59a5f6" }}
              iconClassName="material-icons"
              tooltip="Next Step"
              value="forward"
              onClick={this.props.step === recipe.directions.length - 1 ? e => this.exit(e, `/recipe/${recipe.id}`) : this.stepForward}
              tooltipPosition="bottom-right">
              keyboard_arrow_right
        </IconButton>

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
    stepToSay: state.sayStep,
    userId: state.user.id
  };
};
const mapDispatch = (dispatch) => {
  return {
    isCooking: bool => dispatch(action.getCooking(bool)),
    getRecipe: id => dispatch(action.getRecipe(id)),
    submitUserInput(userInput) {
      return dispatch(action.fetchOutput(userInput))
    },
    changeStepTo(newStep, directions) {
      dispatch(action.getStep(newStep))
      dispatch(action.sayStep(newStep, directions))
    },

  };
};

export default connect(mapState, mapDispatch)(CookRecipe);
