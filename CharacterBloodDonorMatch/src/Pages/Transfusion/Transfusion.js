import { React, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import ProgressBar from "@ramonak/react-progress-bar";
import { onePieceToNormal } from '../SearchResults/SearchResults';
import RecoveryGirl from '../../Images/recoverygirl.png'
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
                height='30px'
                width='10em'
                borderRadius='0px'
                isLabelVisible={false}
                transitionDuration='10s'
            />
        );
    };

const navigate = useNavigate()

  return (
    <main className='transfusionbody'>
        <img className='recoverygirl' src={RecoveryGirl} alt='recovery girl overlay'></img>
        <div className='transfusionContainer'>
            <div className='donorInfo'>
                <img className='image' src = {donor.image.medium} alt="donor pic"></img>
                <p className='role'>(DONOR)</p>
                <h1 className='test'>{donor.name.userPreferred}</h1>
                <p className='test'>Bloodtype: {donor.bloodType ===  'S'||'X'||'F'||'XF'||(donor.bloodType.normalize() === "S Rh") ? onePieceToNormal(donor.bloodType):donor.bloodType}</p>
            </div>
            <div className='startandbar'>
                <button id='startBtn' onClick={()=>{
                    setCompleted(100);
                    setTimeout(() => {
                        console.log('This will run after 10.5 seconds!')
                        navigate("/SearchResults/Donors/Transfusion/Success",{state:recipient});
                      }, 10500);
                }}>START</button>
                <div id='progressbar'>{pb(completed)}</div>
            </div>
            <div className='recipientInfo'>
                <img className='image' src = {recipient.image.medium} alt="recipient pic"></img>
                <p className='role'>(RECIPIENT)</p>
                <h1 className='test'>{recipient.name.userPreferred}</h1>
                <p className='test'>Bloodtype: {recipient.bloodType ===  'S'||'X'||'F'||'XF'||(recipient.bloodType.normalize() === "S Rh") ? onePieceToNormal(recipient.bloodType):recipient.bloodType}</p>    
            </div>
        </div>
    </main>
    )
}
