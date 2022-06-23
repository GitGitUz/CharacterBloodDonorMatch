import { React, useState } from 'react'
import { useLocation } from 'react-router';
import { mostPopularMedia } from '../SearchResults/SearchResults';
import ProgressBar from "@ramonak/react-progress-bar";
import "./Transfusion.css"

export default function Transfusion() {
    const[completed, setCompleted] = useState(0);

    const location = useLocation();

    const donor = location.state.Character
    const recipient = location.state.characterData

    const pb = (c) => {
        return (
            <ProgressBar 
                completed={c}
                bgColor='#a90b10'
                height='15px'
                width='10em'
                borderRadius='5px'
                isLabelVisible={false}
                transitionDuration='10s'
            />
        );
    };

  return (
    <main className='transfusionbody'>
        <h1 id='transfusionHeader'>Thanks {donor.name.userPreferred}! Press the button to begin.</h1>
        <div className='transfusionContainer'>
            <div className='donor'>
                <h1>DONOR</h1>
                <img className='image' src = {donor.image.medium} alt="donor pic"></img>
                <h2>{donor.name.userPreferred}</h2>
                <p>Bloodtype: {donor.bloodType? donor.bloodType:"UNKNOWN"}</p>
            </div>
            <div className='startandbar'>
                <button id='startBtn' onClick={()=>{
                    setCompleted(100);
                    setTimeout(() => {
                        console.log('This will run after 10 seconds!')
                      }, 10000);
                }}>START</button>
                <div id='progressbar'>{pb(completed)}</div>
            </div>
           
            <div className='recipient'>
                <h1>RECIPIENT</h1>
                <img className='image' src = {recipient.image.medium} alt="recipient pic"></img>
                <h2>{recipient.name.userPreferred}</h2>
                <p>Bloodtype: {recipient.bloodType? recipient.bloodType:"UNKNOWN"}</p>
            </div>
        </div>
    </main>
    )
}
