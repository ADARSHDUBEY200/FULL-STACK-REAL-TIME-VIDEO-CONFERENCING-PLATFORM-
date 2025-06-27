import React, { useState} from 'react'
import Signup from './Signup';
import Login from './Login';
import "../../styles/Authentication/Authentication.css"

const Authentication = () => {
    const [isSignup, setSignup] = useState(false);

    const handleAuthnticate = (value)=>{
        setSignup(value);
    }
  return (
    <div className='Authentication'>
        {
            isSignup ?
            <>
            <Signup func = {handleAuthnticate} />
          
            </> 
            :
            <>
            <Login func = {handleAuthnticate} />
           
            </>
        }

        
    </div>
  )
}

export default Authentication