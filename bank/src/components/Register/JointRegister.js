
import React from 'react';
import { NavLink } from 'react-router-dom';

const JointRegister= () => {
  

  return (
    <div style={{ display:'flex',borderRadius:'28px', backgroundColor:'rgba(252, 233, 67, 1)',
     height:'65px', paddingTop:'0px', paddingLeft:'10px', paddingRight:'4px'}}>
       <NavLink to="/personal/signup" activeClassName="active" 
       style={{backgroundColor:'rgba(231, 37, 37, 1)' , height:'50px', borderRadius:'25px', width:'86px'}}>
       <button  style={{ width:'70px', paddingLeft:'5px', borderRadius:'25px', backgroundColor:'black'}}>
        SingUp
      </button>
         </NavLink>
     
    </div>
  );
};

export default JointRegister;