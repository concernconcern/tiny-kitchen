import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Wrapper, Tiles } from './styled-components'
import Tile from './Tile'
import InfiniteScroll from 'redux-infinite-scroll';
import * as action from '../store'


class AllRecipes extends React.Component {
  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
    this.renderTiles = this.renderTiles.bind(this);
    this.current = 0;
  }

  componentDidMount() {
    this.props.getRecipesBatch(this.current);
  }

  loadMore() {
    if (this.current < 5) {
      this.current++;
      console.log('load more after', this.current);
      this.props.getRecipesBatch(this.current);
    }
  }
  
  renderTiles(idx) {
    const recipes = this.props.recipes.slice(idx * 12, (idx+1) * 12);
    console.log('props', this.props)
    console.log('idx', idx);
    console.log('recipes', recipes)
    return (      
      <Tiles>
        {recipes.length && recipes.map((recipe, i) => <Tile key={i} recipe={recipe}/>)}
      </Tiles>
    )
  }

  render() {
    return (
      <InfiniteScroll
        items={this.renderTiles(this.current)}
        loadMore={this.loadMore}
      />
    )
  }
}
/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    recipes: state.recipes
  }
}

const mapDispatch = (dispatch) => {
  return {
    getRecipes: id => dispatch(action.getRecipes()),
    getRecipesBatch: offset => dispatch(action.getRecipesBatch(offset))
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(AllRecipes))
