import React,{Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo.js';
import Register from './components/register/Register.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import SignIn from './components/signIn/SignIn.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Rank from './components/Rank/Rank.js';
import './App.css';
import Particles from 'react-particles-js';
const Clarifai = require('clarifai');

// "C:\Users\Fola\Desktop\projects\projects\facerecognitionbrain"
// "C:\Users\Fola\Desktop\smart-brain-api"
// initialize with your api key.
//  This will also work in your browser via http://browserify.org/

const app = new Clarifai.App({
 apiKey: '6916046d33f74f96980ab31f61ccb286'
});

const particleOptions = {
  particles:{
    number:{
      value:200,
      density:{
        enable:true,
        value_area:800
      }
    }
  }
}
const initialState = {
  input:'',
  imageUrl:'',
  box:{},
  route:'signin',
  x:'40',
  user:{
    id:'',
    name:'',
    email:'', 
    entries: '',
    joined: '',
  }
}
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) =>{
    this.setState(
    {  user:{
        id:data.id,
        name:data.name,
        email:data.email, 
        entries: data.entries,
        joined: data.joined,
      }}
    )
  }
  // componentDidMount(){
  //   fetch('http://localhost:3000/')
  //   .then(response => response.json())
  //   .then(console.log)
  // }

  calculateFaceLocation = (data) =>{
    
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box ;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  };

  displayFaceBox = (box) =>{
    console.log(box);
    this.setState({box:box});
  }

  onRouteChange = (route) =>{
    if (route === 'signout'){
      this.setState(initialState);
      // console.log(this.state.x);
    }else if(route === 'home'){
      this.setState({x:'20'});
      // console.log(this.state.isSignedin);
    }
    this.setState({route:route})
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }
  

  
  onButtonSubmit = () =>{
    this.setState({imageUrl:this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => 
      {
        if(response){
          fetch('http://localhost:3000/image' , {
              method:'put',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify({
              id:this.state.user.id 
            })
          })
          .then(response=>response.json())
          .then(count =>{
            this.setState(Object.assign(this.state.user,{entries:count}))
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
    .catch(err => console.log(err));
  }
  render(){
    const {box ,imageUrl ,route ,x} = this.state;
    return (
      <div className="App">
  <Particles className='particles'  params={particleOptions} />
  
<Navigation onRouteChange={this.onRouteChange}
 
  x={x}/>
      <Logo/>          
     { route === 'home' ?  
          <div>
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onButtonSubmit={this.onButtonSubmit}
                onInputChange={this.onInputChange}/>
              <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>

          :(
            route === 'signin' ?
               <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          :
           <Register loadUser={this.loadUser}  onRouteChange={this.onRouteChange}/> 
          )
           
         
       
       }
      </div>
    );

  }
 
}

export default App;