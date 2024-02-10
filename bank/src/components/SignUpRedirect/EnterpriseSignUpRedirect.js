import React, { useState } from 'react';
import CountryMenu from '../CountryMenu/CountryMenu';
import Footer from '../Footer/Footer';
import SignUpContinueButton from '../SignUpContinueButton/SignUpContinueButton';
import './enterpriseSignUpRedirect.css';
function EnterpriseSignUpRedirect(props) {
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleCountrySelect = (name) => {
    setSelectedCountry(name);
  };

  const handleContinue = () => {
    if (!selectedCountry) {
      console.log("Please select a country.");
    } else {
      console.log('Continue to Business signup with selected country:', selectedCountry);
      // Navigate to the desired route (adjust route as needed)
      props.history.push("/business/signup/redirect");
    }
  };

  return (
    <div  className='entertprisesignupredirect' style={{backgroundColor:'white'}}>
      <div className=' ' style={{backgroundColor:'white', }}>
        <h4 style={{marginLeft:'420px', marginTop:'40px'}}> Please select your country to continue SignUp</h4>
       
        <div style={{marginLeft:'550px', marginTop:'40px'}}>
        <span style={{ marginLeft: '10px' }}>
          <CountryMenu onSelect={handleCountrySelect} />
        </span>
        <SignUpContinueButton 
          signupType='enterprisesignup'
          onClick={handleContinue}
          disabled={!selectedCountry}
        />
        </div>
      </div>


  <div style={{width:'100%', height:'600px'}}>



</div>

<Footer/>
    </div>
  );
}

export default EnterpriseSignUpRedirect;