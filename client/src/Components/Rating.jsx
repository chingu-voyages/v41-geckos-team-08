// import React from 'react'
import React, {Component} from 'react';
import EmptyStar from './assets/empty-star.svg';
import FilledStar from './assets/filled-star.svg';
// import './styles.css';

// export default function Rating() {
//   return (
//     <div>Rating</div>
//   )
// }

class Stars extends Component {
    render(){
      return(
        [...Array(this.props.starCount).keys()].map((index) => {
         return (<img src={EmptyStar} alt={"empty star"} />)
         })
        )
      }
    }
    const RatingSystem = (props) =>  {
     return (
       <div>
         <h1>5 star rating system</h1>
         <h2>Select a rating:</h2>
       <div className='rating'>
         <Stars starCount={props.starCount}/>
       </div>
       </div> 
     );
    }
    export default function App() {
    return (
      <div className="App">
        <RatingSystem starCount={5} />
      </div>
    )
    };
