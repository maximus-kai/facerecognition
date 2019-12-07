import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl , box}) =>{
return(
  <div className= ' '>
  <div className='absolute ml2' >
  <img id='inputimage' alt='' src={imageUrl} height='auto' width='700' />
  <div className='bounding-box' style={{top: box.topRow , right:box.rightCol , bottom:box.bottomRow, left:box.leftCol }}>
    
  </div>
  </div>
  </div>
);

}
export default FaceRecognition;