import React from 'react';
import {Modal} from 'bootstrap';
import nego from './negotiator';
import CallUI from './callui';

var rooms = [];
var fields = {
    room:null,
    username:null
};
let store_to_local_storage = localStorage.length;


class LandingPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            height:(window.innerHeight >= window.innerWidth)? window.innerHeight : window.innerWidth,
            isStart:true,
            landing_page_width:window.innerWidth,
            display_color:"#F5F5F5",
            input_shadow:"-15px -15px 50px #FFFFFF,5px 5px 50px rgba(150,150,150,0.5)",
            text_color:"#000000",
            reverse_shadow:"15px 15px 50px inset #cdcdce,-5px -5px 25px inset #FFFFFF",
            message_input:"#EFEFEF",
            desktop_input:"#eeeeee",
            join_btn_shadow:"2px 2px 20px black,-5px -2px 10px #787981,inset -5px -2px 10px #424244,inset 5px 2px 10px black",
            create_btn_shadow:"2px 2px 20px black,-5px -2px 10px #787981,inset -5px -2px 10px #424244,inset 5px 2px 10px black",
            del_btn_shadow:"2px 2px 20px black,-5px -2px 10px #787981,inset -5px -2px 10px #424244,inset 5px 2px 10px black",
            share_btn_shadow:"2px 2px 20px black,-5px -2px 10px #787981,inset -5px -2px 10px #424244,inset 5px 2px 10px black",
            abt_btn_shadow:"2px 2px 20px black,-5px -2px 10px #787981,inset -5px -2px 10px #424244,inset 5px 2px 10px black",
            dialog_create_btn_shadow:"2px 2px 20px black,-5px -2px 10px #787981,inset -5px -2px 10px #424244,inset 5px 2px 10px black",
            dialog_close_btn_shadow:"2px 2px 20px black,-5px -2px 10px #787981,inset -5px -2px 10px #424244,inset 5px 2px 10px black",
            offMyAudio:true,
            offMyVideo:true,
            togglecolor_1:"2px 2px 20px black,-5px -2px 10px #787981,inset -5px -2px 10px black,inset 5px 2px 10px #424244",
            togglecolor_2:"2px 2px 20px black,-5px -2px 10px #787981,inset -5px -2px 10px #424244,inset 5px 2px 10px black",
            audioId:null
        };
    }



    componentDidMount(){
            if(!navigator.onLine){
                document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                                You Are Offline!
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                document.querySelectorAll("button").forEach(val=>{
                    val.disabled = true;
                })
            }
          window.onoffline=()=>{
            document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                               You Are Offline!
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
            document.querySelectorAll("button").forEach(val=>{
                val.disabled = true;
            })
          }
          window.ononline=()=>{
            document.querySelectorAll("button").forEach(val=>{
                val.disabled = false;
            })
          }
        window.onresize=(e)=>{
            this.setState((state,props)=>{
                state.landing_page_width = e.target.innerWidth;
                return state;
            })
        }
        if(navigator.mediaDevices){
          navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(()=>{

            navigator.mediaDevices.enumerateDevices().then(devices=>{
              if(devices.some(device=>{
                if(device.kind=="videoinput"){
                  return false;
                }
              })) {
                document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                Video Camera Not Supported...
                </div>`
                var m = document.querySelector('#myModal');
                var myModal = new Modal(m, {
                  keyboard: false
                })
                myModal.show();
                document.querySelectorAll("button").forEach(val=>{
                  val.disabled = true;
                })
              }else{
                if(navigator.onLine)
                document.querySelectorAll("button").forEach(val=>{

                  val.disabled = false;
                })
              }
            }).catch(function(err) {
              document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
              Media Not Supported...
              </div>`
              var m = document.querySelector('#myModal');
              var myModal = new Modal(m, {
                keyboard: false
              })
              myModal.show();
              document.querySelectorAll("button").forEach(val=>{
                val.disabled = true;
              })
            });
          }).catch(function(err) {
            document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
            Media Not Supported...
            </div>`
            var m = document.querySelector('#myModal');
            var myModal = new Modal(m, {
              keyboard: false
            })
            myModal.show();
            document.querySelectorAll("button").forEach(val=>{
              val.disabled = true;
            })
          });

        }else{
            document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                                Media Not Supported...
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
            document.querySelectorAll("button").forEach(val=>{
                val.disabled = true;
            })
        }
    }

    async toggle_button(btn){
        this.setState((state)=>{
            state[btn] = state.togglecolor_1
            return state;
        })
        setTimeout(()=>{
            this.setState((state)=>{
                state[btn]= state.togglecolor_2
                return state;
            })
            return;
        },200)
    }

    render(){


        return (
            (this.state.isStart)?(
            (this.state.landing_page_width >= 1000)? (
                <div style={{width:"100%",height:"100vh",overflow:"hidden",backgroundColor:this.state.display_color,color:this.state.text_color,fontFamily:"Segoe UI",fontStyle:"italic",letterSpacing:"2px"}}>
                    <div className='container-fluid w-100 h-100 bg-transparent'>

                    <div className="toggle-button-cover position-absolute" style={{bottom:30,right:20}}>
                                    <div className="button-cover">
                                        <div className="button r" id="button-8">
                                        <input type="checkbox" className="checkbox" onClick={(e)=>{
                                            this.setState((state)=>{
                                            if(e.target.checked){
                                                state.display_color="#323335";
                                                state.input_shadow="-15px -15px 50px #484848,5px 5px 50px #000000"
                                                state.text_color="#ffffff";
                                                state.reverse_shadow="15px 15px 50px inset #000000,-5px -5px 25px inset #707070";
                                                state.message_input="#707070";
                                                state.desktop_input=state.display_color;
                                            }else{
                                                state.display_color="#F5F5F5";
                                                state.input_shadow="-15px -15px 50px #FFFFFF,5px 5px 50px rgba(150,150,150,0.5)"
                                                state.text_color="#000000";
                                                state.reverse_shadow="15px 15px 50px inset #cdcdce,-5px -5px 25px inset #FFFFFF";
                                                state.message_input="#EFEFEF";
                                                state.desktop_input="#eeeeee";
                                            }
                                        return state;
                                        })
                                        }}/>
                                        <div className="knobs">
                                            <span></span>
                                        </div>
                                        <div className="layer"></div>
                                        </div>
                                    </div>
                                    </div>

                        <div className='row row-cols-2 w-100 h-100 bg-transparent'>
                            <div id="actionDiv" className='col ps-5 p-2 bg-transparent'>
                            <div className="fw-bold text-nowrap ps-2" style={{fontSize:"3vw"}}>
                                        Ujoin
                                    </div>
                            <div className='ms-4 bg-transparent position-relative' style={{borderRadius:20,height:"80vh",width:"90%"}}>
                                <div id="start" className="w-100 p-5 pt-5 pb-0 bg-transparent text-center position-absolute" style={{height:"100%",overflowY:"auto"}}>
                                    <h5 className='text-start mt-5 text-nowrap' style={{lineHeight:1.5}}>A Video Meeting App That Can Allow To Create ,<br/> Join And Delete A Meeting Session .</h5>
                                    <button id="previous-button-1" type="button" className="btn btn-primary rounded-pill fw-bolder p-3 m-1 m-auto mt-5 me-5" style={{fontSize:"1.5vw",display:"inline",width:"40%"}}
                                        onClick={async(e)=>{

                                            try{

                                                document.getElementById("form-1").className = "w-100 p-5 pt-1 pb-2 bg-transparent text-center position-absolute";
                                                document.getElementById("start").className = "w-100 p-5 pt-1 pb-0 bg-transparent text-center position-absolute pe-none opacity-0";

                                                if(document.getElementById("audioDeviceSelector").innerHTML == "")
                                                  if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices){

                                                    navigator.mediaDevices.enumerateDevices().then(devices=>{
                                                      devices.forEach((item, i) => {
                                                        if(!devices.length){
                                                            document.querySelectorAll("button").forEach(val=>{
                                                                val.disabled = true;
                                                            })
                                                        }
                                                        if(item.kind == "audiooutput"){
                                                          const option = document.createElement("option");
                                                          option.value = item.deviceId;
                                                          option.innerHTML = item.label;
                                                          this.setState(state=>{
                                                            state.audioId = document.getElementById("audioDeviceSelector").value;
                                                            return state;
                                                          })
                                                          document.getElementById("audioDeviceSelector").append(option);
                                                        }
                                                      })
                                                    }).catch((err)=>{
                                                        document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                                        ${String(err)}
                                                      </div>`
                                                        var m = document.querySelector('#myModal');
                                                        var myModal = new Modal(m, {
                                                            keyboard: false
                                                        })
                                                        myModal.show();
                                                        document.querySelectorAll("button").forEach(val=>{
                                                            val.disabled = true;
                                                        })

                                                    });
                                                  }
                                                  else{
                                                    document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                                Media Not Supported
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                                                        document.querySelectorAll("button").forEach(val=>{
                                                            val.disabled = true;
                                                        })
                                                  }
                                                  rooms = await  nego.fetchRooms()

                                            }
                                            catch(err){
                                                document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                                ${String(err)}
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                                            }
                                        }}
                                        >
                                        <i className="bi bi-person-plus-fill text-light me-3" ></i>
                                            Join Meet
                                        </button>

                                        <button id="previous-button-2" type="button" className="btn btn-primary rounded-pill fw-bolder p-3 m-1 d-inline mt-5 me-5" style={{fontSize:"1.5vw",width:"40%"}}
                                        onClick={async(e)=>{
                                            try{
                                                document.getElementById("form-2").className = "w-100 p-5 pt-1 pb-2 bg-transparent text-center position-absolute";
                                                document.getElementById("start").className = "w-100 p-5 pt-1 pb-0 bg-transparent text-center position-absolute pe-none opacity-0";
                                                //nego-interaction
                                                rooms = await  nego.fetchRooms()

                                            }
                                            catch(err){
                                                document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                                ${String(err)}
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                                            }
                                        }}>
                                        <i className="bi bi-plus-circle-fill text-light me-3"></i>
                                            Create Meet
                                        </button>
                                        <br/> <br/> <br/>
                                        <button type="button" className="btn btn-primary rounded-pill fw-bolder p-3 m-1 d-inline m-auto me-5" style={{fontSize:"1.5vw",width:"45%"}}
                                        onClick={(e)=>{
                                            try{
                                                document.getElementById("form-3").innerHTML="";
                                                document.getElementById("form-3-parent").className = "w-100 p-5 pt-3 pb-0 bg-transparent text-center position-absolute";
                                                document.getElementById("start").className = "w-100 p-5 pt-1 pb-0 bg-transparent text-center position-absolute pe-none opacity-0";
                                                var keys = Object.keys(localStorage)
                                                    keys.forEach(key=>{
                                                        if(/[0-9]/g.test(key))
                                                        if(localStorage.getItem(key)){

                                                            const li = document.createElement("li");
                                                            const btn = document.createElement('button');
                                                            btn.classList="btn btn-danger";
                                                            btn.innerHTML = "Remove"
                                                            li.style.color = this.state.text_color;
                                                            li.classList="list-group-item bg-transparent d-flex justify-content-between align-items-center fs-1 w-75 m-auto";
                                                            li.innerHTML = localStorage.getItem(key)
                                                            btn.onclick=(e)=>{
                                                                nego.clearRoom(localStorage.getItem(key))
                                                                e.target.parentElement.remove();
                                                                localStorage.removeItem(key)
                                                            }
                                                            li.append(btn);
                                                            document.getElementById("form-3").append(li);
                                                        }
                                                    })

                                            }
                                            catch(err){
                                                document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                                ${String(err)}
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                                            }

                                        }}>
                                        <i className="bi bi-x-circle-fill text-light me-3"></i>
                                            Remove Meet
                                        </button>



                                </div>
                            <div id="form-1" className="w-100 p-5 pt-1 pb-2 bg-transparent text-center position-absolute opacity-0 pe-none" style={{height:"100%",overflowY:"auto",zIndex:2}}>
                                    <form>
                                        <div className="w-75 mb-3 m-auto">
                                            <label htmlFor="joinInput" className="form-label fs-5 fw-bolder m-3">Meet Code</label>
                                            <input type="text" className="form-control w-100 p-3 m-auto border-0" autoComplete='off' id="joinInput" aria-describedby="emailHelp" style={{boxShadow:this.state.input_shadow,fontSize:"15px",backgroundColor:this.state.desktop_input,borderRadius:"20px",color:this.state.text_color}}/>
                                        </div>
                                        <div className="w-75 mb-3 m-auto">
                                            <label htmlFor="userInput" className="form-label fs-5 fw-bolder m-3">UserName</label>
                                            <input type="text" className="form-control w-100 p-3 m-auto border-0" autoComplete='off' id="userInput"  style={{boxShadow:this.state.input_shadow,fontSize:"15px",backgroundColor:this.state.desktop_input,borderRadius:"20px",color:this.state.text_color}}/>
                                        </div>
                                        <div className="w-75 mb-3 m-auto">
                                            <label htmlFor="audioDeviceSelector" className="form-label fs-5 fw-bolder m-3">Audio Output</label>
                                            <select id="audioDeviceSelector" className="form-select w-100 p-3 m-auto border-0" aria-label="Default select example"  style={{boxShadow:this.state.input_shadow,fontSize:"15px",backgroundColor:this.state.desktop_input,borderRadius:"20px",color:this.state.text_color}}
                                            onInput={(e)=>{

                                                this.setState(state=>{
                                                  state.audioId = e.target.value;
                                                  return state;
                                                })
                                                }}
                                            >

                                            </select>
                                        </div>
                                        <div className="form-check form-check-inline m-2 mt-5 pt-2">
                                        <input className="form-check-input d-block ms-2" type="checkbox" id="inlineCheckbox1"
                                        onClick={(e)=>{
                                            if(e.target.checked){
                                                this.setState(state=>{
                                                    state.offMyVideo = false;
                                                    return state;
                                                })
                                            }else{
                                                this.setState(state=>{
                                                    state.offMyVideo = true;
                                                    return state;
                                                })
                                            }
                                        }}
                                        />
                                        <label className="form-check-label fs-5 ms-4" htmlFor="inlineCheckbox1">Turn Off The Video Camera</label>
                                        </div>
                                        <div className="form-check form-check-inline m-2 mt-4">
                                        <input className="form-check-input d-block ms-2" type="checkbox" id="inlineCheckbox2"
                                        onClick={(e)=>{
                                            if(e.target.checked){
                                                this.setState(state=>{
                                                    state.offMyAudio = false;
                                                    return state;
                                                })
                                            }else{
                                                this.setState(state=>{
                                                    state.offMyAudio = true;
                                                    return state;
                                                })
                                            }
                                        }}
                                        />
                                        <label className="form-check-label fs-5 ms-4" htmlFor="inlineCheckbox2">Turn Off The Audio Input</label>
                                        </div>
                                        <br/>
                                        <button id="previousElementSibling-1" type="button" className="btn btn-primary rounded-pill p-3 fw-bolder ps-5 pe-5 m-1 mt-5" style={{fontSize:"1.5vw",width:"45%"}}
                                        onClick={async()=>{
                                            if((document.getElementById('joinInput').value).length && (document.getElementById("userInput").value).length &&
                                            /[a-zA-Z0-9]/g.test(document.getElementById("userInput").value)&& rooms.includes(document.getElementById('joinInput').value) && document.getElementById("audioDeviceSelector").value){

                                                fields.room = document.getElementById('joinInput').value;
                                                fields.username = document.getElementById('userInput').value
                                                this.setState(state=>{
                                                    state.isStart = false;
                                                    return state;
                                                })
                                            }else{
                                                document.getElementById("errorBody").innerHTML = `<div class="alert alert-info" role="alert">
                                                Please Try To Join Properly...
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                                            }
                                        }}>
                                        <i className="bi bi-person-plus-fill text-light me-2" ></i>
                                            Proceed
                                        </button><br/><br/>
                                        <button type="button" className="btn btn-secondary rounded-pill fw-bolder p-3 close-1" style={{fontSize:"1.5vw",width:"45%"}}
                                        onClick={(e)=>{
                                            document.getElementById("form-1").className = "w-100 p-5 pt-1 pb-2 bg-transparent text-center position-absolute pe-none opacity-0";
                                                document.getElementById("start").className = "w-100 p-5 pt-5 pb-0 bg-transparent text-center position-absolute";

                                        }}
                                        >
                                            Close
                                        </button>
                                    </form>
                                    </div>

                                    <div id="form-2" className="w-100 p-5 pt-1 pb-2 bg-transparent text-center position-absolute pe-none opacity-0" style={{height:"100%",overflowY:"auto"}}>
                                    <form>
                                        <div className="w-75 mb-3 m-auto">
                                            <label htmlFor="create_input" className="form-label fs-5 fw-bolder m-3">Meet Code</label>
                                            <input type="text" className="form-control w-100 p-3 m-auto border-0" id="create_input" autoComplete='off' aria-describedby="emailHelp" style={{boxShadow:this.state.input_shadow,fontSize:"15px",backgroundColor:this.state.desktop_input,borderRadius:"20px",color:this.state.text_color}}
                                            onInput={(e)=>{
                                                e.preventDefault();

                                                if(e.target.value.length && (/[0-9a-zA-z]/g).test(e.target.value) && !rooms.includes(e.target.value)){
                                                    e.target.classList = "form-control w-100 p-3 m-auto border-0 bg-success";
                                                }else{
                                                    e.target.classList = "form-control w-100 p-3 m-auto border-0 bg-danger"
                                                }
                                            }}
                                            />
                                        </div>

                                        <button id="previousElementSibling-2" type="button" className="btn btn-primary rounded-pill p-3 fw-bolder ps-5 pe-5 m-1 mt-5" style={{fontSize:"1.5vw",width:"45%"}}
                                        onClick={()=>{
                                            //nego-interaction
                                            if(rooms)
                                            if((document.getElementById("create_input").value).length && (/[0-9a-zA-z]/g).test(document.getElementById("create_input").value) && !rooms.includes(document.getElementById("create_input").value)){
                                                nego.createMeet(document.getElementById('create_input'));
                                                localStorage.setItem(store_to_local_storage++,document.getElementById("create_input").value)
                                                rooms.push(document.getElementById("create_input").value)
                                                document.getElementById("create_input").className = "form-control w-100 p-3 m-auto border-0";
                                            }else{
                                                document.getElementById("errorBody").innerHTML = `<div class="alert alert-info" role="alert">
                                                Please Try To Create Correctly...
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                                            }
                                        }}
                                        >
                                        <i className="bi bi-plus-circle-fill text-light me-2"></i>
                                            Proceed
                                        </button><br/><br/>
                                        <button type="button" className="btn btn-secondary rounded-pill fw-bolder p-3 close-2" style={{fontSize:"1.5vw",width:"45%"}}
                                        onClick={(e)=>{
                                            document.getElementById("form-2").className = "w-100 p-5 pt-1 pb-2 bg-transparent text-center position-absolute pe-none opacity-0";
                                                document.getElementById("start").className = "w-100 p-5 pt-5 pb-0 bg-transparent text-center position-absolute";
                                        }}
                                        >
                                            Close
                                        </button>
                                    </form>
                                    </div>

                                    <div id="form-3-parent"  className="w-100 p-5 pt-3 pb-0 bg-transparent text-center position-absolute pe-none opacity-0">

                                    <ol id="form-3" start="1" className='w-100'  style={{height:"60vh",justifyContent:"center",alignItems:"center",flexDirection:"column",overflowY:"scroll"}}>
                                    </ol>
                                    <button type="button" className="btn btn-secondary rounded-pill fw-bolder p-3 close-2 mt-5" style={{fontSize:"1.5vw",width:"45%"}}
                                        onClick={(e)=>{
                                            document.getElementById("form-3-parent").className = "w-100 p-5 pt-3 pb-0 bg-transparent text-center position-absolute pe-none opacity-0";
                                                document.getElementById("start").className = "w-100 p-5 pt-5 pb-0 bg-transparent text-center position-absolute";
                                        }}
                                        >Close</button>
                                    </div>
                            </div>
                            </div>
                            <div id="animationDiv" className='col position-relative'>
                                        <span className="ball position-absolute d-inline-block rounded-circle border-0" style={{width:100,aspectRatio:"1/1",backgroundColor:"#7FCCF1",boxShadow:"-5px -5px 25px inset #04519e,5px 5px 25px inset #ffffff,1px 1px 6px #5A5A5A",left:"0%",bottom:-200}}></span>
                                        <span className="ball position-absolute d-inline-block rounded-circle border-0" style={{width:120,aspectRatio:"1/1",backgroundColor:"#7FCCF1",boxShadow:"-5px -5px 25px inset #04519e,5px 5px 25px inset #ffffff,1px 1px 6px #5A5A5A",left:"50%",bottom:-200}}></span>
                                        <span className="ball position-absolute d-inline-block rounded-circle border-0" style={{width:150,aspectRatio:"1/1",backgroundColor:"#7FCCF1",boxShadow:"-5px -5px 25px inset #04519e,5px 5px 25px inset #ffffff,1px 1px 6px #5A5A5A",left:"20%",bottom:-200}}></span>
                                        <span className="ball position-absolute d-inline-block rounded-circle border-0" style={{width:100,aspectRatio:"1/1",backgroundColor:"#7FCCF1",boxShadow:"-5px -5px 25px inset #04519e,5px 5px 25px inset #ffffff,1px 1px 6px #5A5A5A",left:"80%",bottom:-200}}></span>
                                        <img src="background1.png" className="pic1 d-inline-block position-absolute" width={250} style={{left:"50%",bottom:-200}}/>
                                        <img src="background2.png" className="pic2 d-inline-block position-absolute" style={{left:"10%",bottom:-200}}/>
                                        <img src="background3.png" className="pic3 d-inline-block position-absolute" width={250} style={{left:"70%",bottom:-200}}/>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade overflow-hidden" id="myModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg rounded-3" >
                        <div className="modal-content shadow" style={{backgroundColor:this.state.display_color}}>
                        <div className="modal-header border-dark">
                            <h5 className="modal-title text-primary" id="staticBackdropLabel">Ujoin</h5>
                            <button type="button" className="btn-close" style={{backgroundColor:this.state.display_color}} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div id="errorBody" className="modal-body p-2">

                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            ):(
                <div id="scroll-space" style={{height:"100%",width:"100%",overflowX:"scroll",overflowY:"hidden",scrollSnapType: "x mandatory",backgroundColor:this.state.display_color,color:this.state.text_color,fontFamily:"Segoe UI",fontStyle:"italic",letterSpacing:"4px"}}
                onScroll={(e)=>{
                    if(document.getElementById('scroll-space').scrollLeft == 0){
                        document.getElementById("pignation").childNodes[0].className="border border-secondary rounded-circle d-inline-block p-3 m-2 bg-secondary";
                        document.getElementById("pignation").childNodes[1].className="border border-secondary rounded-circle d-inline-block p-3 m-2 ";
                        document.getElementById("pignation").childNodes[2].className="border border-secondary rounded-circle d-inline-block p-3 m-2 ";
                     }else if(document.getElementById('scroll-space').scrollLeft == this.state.landing_page_width){
                         document.getElementById("pignation").childNodes[0].className="border border-secondary rounded-circle d-inline-block p-3 m-2";
                         document.getElementById("pignation").childNodes[1].className="border border-secondary rounded-circle d-inline-block p-3 m-2 bg-secondary";
                         document.getElementById("pignation").childNodes[2].className="border border-secondary rounded-circle d-inline-block p-3 m-2";
                     }else if(document.getElementById('scroll-space').scrollLeft == 2*this.state.landing_page_width){
                         document.getElementById("pignation").childNodes[0].className="border border-secondary rounded-circle d-inline-block p-3 m-2";
                         document.getElementById("pignation").childNodes[1].className="border border-secondary rounded-circle d-inline-block p-3 m-2";
                         document.getElementById("pignation").childNodes[2].className="border border-secondary rounded-circle d-inline-block p-3 m-2 bg-secondary";
                     }
                   }}>

                   <div style={{width:"300%",height:this.state.height,display:"flex",flexDirection:"row"}}>
                            <div className='w-100' style={{overflowY:"auto",overflowX:"hidden",scrollSnapAlign:"start"}}>
                                <div className=" container-fluid position-relative" style={{height:(this.state.height>1600)?this.state.height:1600,overflow:"hidden"}}>
                                    <div className='row p-3 m-3 mb-1'>
                                    <div className="col-9 fw-bold text-nowrap" style={{fontSize:"8vw"}}>
                                        Ujoin
                                    </div>
                                    <div className="col-3">
                                    <div className="toggle-button-cover">
                                    <div className="button-cover">
                                        <div className="button r" id="button-8">
                                        <input type="checkbox" className="checkbox" onClick={(e)=>{
                                            this.setState((state)=>{
                                            if(e.target.checked){
                                                state.display_color="#323335";
                                                state.input_shadow="-15px -15px 50px #484848,5px 5px 50px #000000"
                                                state.text_color="#ffffff";
                                                state.reverse_shadow="15px 15px 50px inset #000000,-5px -5px 25px inset #707070";
                                                state.message_input="#707070";
                                            }else{
                                                state.display_color="#F5F5F5";
                                                state.input_shadow="-15px -15px 50px #FFFFFF,5px 5px 50px rgba(150,150,150,0.5)"
                                                state.text_color="#000000";
                                                state.reverse_shadow="15px 15px 50px inset #cdcdce,-5px -5px 25px inset #FFFFFF";
                                                state.message_input="#EFEFEF";
                                            }
                                        return state;
                                        })
                                        }}/>
                                        <div className="knobs">
                                            <span></span>
                                        </div>
                                        <div className="layer"></div>
                                        </div>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    <div id="fade-title-1" className='row p-3 m-1'>
                                    <h2 className="col fw-bold text-nowrap" style={{fontSize:"4vw"}}>
                                    Join A Meet
                                    </h2>
                                    </div>
                                    <div id="fade-bg-1" className="row p-0 m-0 position-absolute start-50 translate-middle" style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",top:"45%"}}>
                                        <img src="l1.png" className='w-100 p-0 m-0' style={{objectFit:"cover"}}/>

                                    </div>

                                    {/* form division */}
                                    <div id="form-1" className="position-absolute w-100 opacity-0 pe-none" style={{top:"10%",height:"60%",overflowY:"auto"}}>
                                    <form>
                                        <div className="mb-3 mt-4">
                                            <label htmlFor="joinInput" className="form-label fs-1 fw-bolder m-4 ms-5">Meet Code</label>
                                            <input type="text" className="form-control w-75 p-3 m-auto border-0" id="joinInput" autoComplete='off' aria-describedby="emailHelp" style={{boxShadow:this.state.input_shadow,fontSize:"50px",backgroundColor:this.state.display_color,borderRadius:"20px",color:this.state.text_color}}/>
                                        </div>
                                        <div className="mb-3 mt-4">
                                            <label htmlFor="userInput" className="form-label fs-1 fw-bolder m-4 ms-5">UserName</label>
                                            <input type="text" className="form-control w-75 p-3 m-auto border-0" id="userInput" autoComplete='off'  style={{boxShadow:this.state.input_shadow,fontSize:"50px",backgroundColor:this.state.display_color,borderRadius:"20px",color:this.state.text_color}}/>
                                        </div>
                                        <div className="mb-3 mt-4">
                                            <label htmlFor="audioDeviceSelector" className="form-label fs-1 fw-bolder m-4 ms-5">Audio Output</label>
                                            <select id="audioDeviceSelector" className="form-select w-75 p-3 m-auto border-0" aria-label="Default select example"  style={{boxShadow:this.state.input_shadow,fontSize:"50px",backgroundColor:this.state.display_color,borderRadius:"20px",color:this.state.text_color}}
                                            onInput={(e)=>{

                                                this.setState(state=>{
                                                  state.audioId = e.target.value;
                                                  return state;
                                                })
                                                }}
                                            >

                                            </select>
                                        </div>
                                        <div className="form-check form-check-inline m-5 ps-2">
                                        <input className="form-check-input d-block ms-5" type="checkbox" id="inlineCheckbox1" style={{width:70,height:70}}
                                        onClick={(e)=>{
                                            if(e.target.checked){
                                                this.setState(state=>{
                                                    state.offMyVideo = false;
                                                    return state;
                                                })
                                            }else{
                                                this.setState(state=>{
                                                    state.offMyVideo = true;
                                                    return state;
                                                })
                                            }
                                        }}
                                        />
                                        <label className="form-check-label fs-1 ms-5" htmlFor="inlineCheckbox1">Turn Off The Video Camera</label>
                                        </div>
                                        <div className="form-check form-check-inline m-5 ps-2">
                                        <input className="form-check-input d-block ms-5" type="checkbox" id="inlineCheckbox2" style={{width:70,height:70}}
                                        onClick={(e)=>{
                                            if(e.target.checked){
                                                this.setState(state=>{
                                                    state.offMyAudio = false;
                                                    return state;
                                                })
                                            }else{
                                                this.setState(state=>{
                                                    state.offMyAudio = true;
                                                    return state;
                                                })
                                            }
                                        }}
                                        />
                                        <label className="form-check-label fs-1 ms-5" htmlFor="inlineCheckbox2">Turn Off The Audio Input</label>
                                        </div>
                                    </form>
                                    </div>

                                    <div className="row row-cols-1 position-relative start-50 translate-middle" style={{top:"66%"}}>
                                        <div className='col text-center text-nowrap'>
                                        <button id="previous-button-1" type="button" className="btn btn-primary rounded-pill fw-bolder p-5 m-1" style={{fontSize:"5vw",width:"60%",display:"inline"}}
                                        onClick={async(e)=>{

                                            try{
                                                document.getElementById("fade-bg-1").className = "row p-0 m-0 position-absolute start-50 opacity-0";
                                                document.getElementById("fade-title-1").className = "row p-3 m-3 opacity-0";
                                                e.target.style.display = "none";
                                                e.target.nextElementSibling.style.display = "inline";
                                                document.getElementById("left-arrow").style.display="none";
                                                document.getElementById("right-arrow").style.display="none";
                                                document.getElementById("pignation").style.display="none";
                                                document.getElementsByClassName("close-1")[0].style.display = "inline";
                                                document.getElementById("form-1").className = "position-absolute mt-5 w-100";
                                                document.getElementById("scroll-space").style.overflowX="hidden";

                                                if(document.getElementById("audioDeviceSelector").innerHTML == "")
                                                  if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices){

                                                    navigator.mediaDevices.enumerateDevices().then(devices=>{
                                                      devices.forEach((item, i) => {
                                                        if(!devices.length){
                                                            document.querySelectorAll("button").forEach(val=>{
                                                                val.disabled = true;
                                                            })
                                                        }
                                                        if(item.kind == "audiooutput"){
                                                          const option = document.createElement("option");
                                                          option.value = item.deviceId;
                                                          option.innerHTML = item.label;
                                                          this.setState(state=>{
                                                            state.audioId = document.getElementById("audioDeviceSelector").value;
                                                            return state;
                                                          })
                                                          document.getElementById("audioDeviceSelector").append(option);
                                                        }
                                                      })
                                                    }).catch((err)=>{
                                                        document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                                        ${String(err)}
                                                      </div>`
                                                        var m = document.querySelector('#myModal');
                                                        var myModal = new Modal(m, {
                                                            keyboard: false
                                                        })
                                                        myModal.show();
                                                        document.querySelectorAll("button").forEach(val=>{
                                                            val.disabled = true;
                                                        })

                                                    });
                                                  }
                                                  else{
                                                    document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                                Media Not Supported
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                                                        document.querySelectorAll("button").forEach(val=>{
                                                            val.disabled = true;
                                                        })
                                                  }
                                                  rooms = await  nego.fetchRooms()

                                            }
                                            catch(err){
                                                document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                                ${String(err)}
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                                            }
                                        }}
                                        >
                                        <i className="bi bi-person-plus-fill text-light me-5" ></i>
                                            Join Meet
                                        </button>
                                        <button id="previousElementSibling-1" type="button" className="btn btn-primary rounded-pill fw-bolder ps-5 pe-5 m-1" style={{fontSize:"5vw",display:"none" ,padding:"40px",width:"60%"}}
                                        onClick={async()=>{
                                            if((document.getElementById('joinInput').value).length && (document.getElementById("userInput").value).length &&
                                            /[a-zA-Z0-9]/g.test(document.getElementById("userInput").value)&& rooms.includes(document.getElementById('joinInput').value) && document.getElementById("audioDeviceSelector").value){

                                                fields.room = document.getElementById('joinInput').value;
                                                fields.username = document.getElementById('userInput').value
                                                this.setState(state=>{
                                                    state.isStart = false;
                                                    return state;
                                                })
                                            }else{
                                                document.getElementById("errorBody").innerHTML = `<div class="alert alert-info" role="alert">
                                                Please Try To Join Properly...
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                                            }
                                        }}>
                                        <i className="bi bi-person-plus-fill text-light me-5" ></i>
                                            Proceed
                                        </button><br/><br/>
                                        <button type="button" className="btn btn-secondary rounded-pill fw-bolder p-3 close-1" style={{fontSize:"5vw",display:"none",width:"60%",height:"50%"}}
                                        onClick={(e)=>{
                                            document.getElementById("fade-bg-1").className = "row p-0 m-0 position-absolute start-50 translate-middle";
                                            document.getElementById("fade-title-1").className = "row p-3 m-3";
                                            e.target.style.display = "none";
                                            document.getElementById("previousElementSibling-1").style.display = "none";
                                            document.getElementById("left-arrow").style.display="inline";
                                            document.getElementById("right-arrow").style.display="inline";
                                            document.getElementById("pignation").style.display="block";
                                            document.getElementById("form-1").className = "position-absolute mt-5 w-100 opacity-0 pe-none";
                                            document.getElementsByClassName("close-1")[0].style.display = "none";
                                            document.getElementById("scroll-space").style.overflowX="scroll";
                                            document.getElementById("previous-button-1").style.display="inline"
                                        }}
                                        >
                                            Close
                                        </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className='w-100' style={{scrollSnapAlign: "start",overflowY:"auto"}}>
                            <div className="container-fluid position-relative" style={{height:(this.state.height>1600)?this.state.height:1600,overflow:"hidden"}}>
                                    <div className='row p-3 m-3 mb-1'>
                                    <div className="col fw-bold text-nowrap" style={{fontSize:"6vw"}}>
                                        Ujoin
                                    </div>
                                    </div>
                                    <div id="fade-title-2" className='row p-3 m-1'>
                                    <h2 className="col fw-bold text-nowrap" style={{fontSize:"4vw"}}>
                                    Create A New Meet
                                    </h2>
                                    </div>
                                    <div id="fade-bg-2" className="row p-0 m-0 position-absolute start-50 translate-middle" style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",top:"45%"}}>
                                        <img src="l2.png" className='w-100 p-0 m-0' style={{objectFit:"cover"}}/>

                                    </div>

                                    {/* form division */}
                                    <div id="form-2" className="position-absolute w-100 opacity-0 pe-none" style={{top:"10%"}}>
                                    <form>
                                    <div className="mb-5">
                                            <label htmlFor="create_input" className="form-label fs-1 fw-bolder m-5">Meet Code</label>
                                            <input type="text" id="create_input" className="form-control w-75 p-3 m-auto border-0" autoComplete='off' aria-describedby="emailHelp" style={{boxShadow:this.state.input_shadow,fontSize:"50px",backgroundColor:this.state.display_color,borderRadius:"20px",color:this.state.text_color}}
                                            onInput={(e)=>{
                                                e.preventDefault();

                                                if(e.target.value.length && (/[0-9a-zA-z]/g).test(e.target.value) && !rooms.includes(e.target.value)){
                                                    e.target.classList = "form-control w-75 p-3 m-auto border-0 bg-success";
                                                }else{
                                                    e.target.classList = "form-control w-75 p-3 m-auto border-0 bg-danger"
                                                }
                                            }}
                                            />
                                        </div>

                                    </form>
                                    </div>

                                    <div className="row row-cols-1 position-relative start-50 translate-middle" style={{top:"68%"}}>
                                        <div className='col text-center text-nowrap'>
                                        <button id="previous-button-2" type="button" className="btn btn-primary rounded-pill fw-bolder p-5 m-1" style={{fontSize:"5vw",width:"60%"}}
                                        onClick={async(e)=>{
                                            try{
                                                document.getElementById("fade-bg-2").className = "row p-0 m-0 position-absolute start-50 opacity-0";
                                                document.getElementById("fade-title-2").className = "row p-3 m-3 opacity-0";
                                                e.target.style.display = "none";
                                                e.target.nextElementSibling.style.display = "inline";
                                                document.getElementById("left-arrow").style.display="none";
                                                document.getElementById("right-arrow").style.display="none";
                                                document.getElementById("pignation").style.display="none";
                                                document.getElementById("form-2").className = "position-absolute mt-5 w-100";
                                                document.getElementsByClassName("close-2")[0].style.display = "inline";
                                                document.getElementById("scroll-space").style.overflowX="hidden";
                                                //nego-interaction
                                                rooms = await  nego.fetchRooms()

                                            }
                                            catch(err){
                                                document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                                ${String(err)}
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                                            }
                                        }}>
                                        <i className="bi bi-plus-circle-fill text-light me-5"></i>
                                            Create Meet
                                        </button>
                                        <button id="previousElementSibling-2" type="button" className="btn btn-primary rounded-pill fw-bolder ps-5 pe-5 m-1" style={{fontSize:"5vw",display:"none",padding:"40px",width:"60%"}}
                                        onClick={()=>{
                                            //nego-interaction
                                            if(rooms)
                                            if((document.getElementById("create_input").value).length && (/[0-9a-zA-z]/g).test(document.getElementById("create_input").value) && !rooms.includes(document.getElementById("create_input").value)){
                                                nego.createMeet(document.getElementById('create_input'));
                                                localStorage.setItem(store_to_local_storage++,document.getElementById("create_input").value)
                                                rooms.push(document.getElementById("create_input").value)
                                                document.getElementById("create_input").className = "form-control w-75 p-3 m-auto border-0";
                                            }else{
                                                document.getElementById("errorBody").innerHTML = `<div class="alert alert-info" role="alert">
                                                Please Try To Create Correctly...
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                                            }
                                        }}
                                        >
                                        <i className="bi bi-plus-circle-fill text-light me-5"></i>
                                            Proceed
                                        </button><br/><br/>
                                        <button type="button" className="btn btn-secondary rounded-pill fw-bolder p-3 close-2" style={{fontSize:"5vw",display:"none",width:"60%",height:"50%"}}
                                        onClick={(e)=>{
                                            document.getElementById("fade-bg-2").className = "row p-0 m-0 position-absolute start-50 translate-middle";
                                            document.getElementById("fade-title-2").className = "row p-3 m-3";
                                            e.target.style.display = "none";
                                            document.getElementById("previousElementSibling-2").style.display = "none";
                                            document.getElementById("left-arrow").style.display="inline";
                                            document.getElementById("right-arrow").style.display="inline";
                                            document.getElementById("pignation").style.display="block";
                                            document.getElementById("form-2").className = "position-absolute mt-5 w-100 opacity-0 pe-none";
                                            document.getElementsByClassName("close-2")[0].style.display = "none";
                                            document.getElementById("scroll-space").style.overflowX="scroll";
                                            document.getElementById("previous-button-2").style.display="inline"
                                        }}
                                        >
                                            Close
                                        </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className='w-100' style={{scrollSnapAlign: "start",overflowY:"auto"}}>
                            <div className="container-fluid position-relative" style={{height:(this.state.height>1600)?this.state.height:1600,overflow:"hidden"}}>
                                    <div className='row p-3 m-3'>
                                    <div className="col fw-bold text-nowrap" style={{fontSize:"6vw"}}>
                                        Ujoin
                                    </div>
                                    </div>
                                    <div id="fade-title-3" className='row p-3 m-3'>
                                    <h2 className="col fw-bold text-nowrap" style={{fontSize:"4vw"}}>
                                    Remove An Existing Meet
                                    </h2>
                                    </div>
                                    <div id="fade-bg-3" className="row p-0 m-0 position-absolute start-50 translate-middle" style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",top:"45%"}}>
                                        <img src="l3.png" className='w-100 p-0 m-0' style={{objectFit:"cover"}} />

                                    </div>

                                        <ol id="form-3" start="1" className="position-absolute w-100 opacity-0" style={{height:"60vh",top:"10%",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",overflowY:"scroll"}}>

                                        </ol>

                                    <div className="row row-cols-1 position-relative start-50 translate-middle" style={{bottom:"50px",top:"70%"}}>
                                        <div className='col text-center text-nowrap'>
                                        <button type="button" className="btn btn-primary rounded-pill fw-bolder p-5 m-1" style={{fontSize:"5vw",width:"60%"}}
                                        onClick={(e)=>{
                                            try{
                                                document.getElementById("form-3").innerHTML="";
                                                document.getElementById("fade-bg-3").className = "row p-0 m-0 position-absolute start-50 opacity-0";
                                                document.getElementById("fade-title-3").className = "row p-3 m-3 opacity-0";
                                                e.target.style.display = "none";
                                                e.target.nextElementSibling.style.display = "inline-block";
                                                document.getElementById("left-arrow").style.display="none";
                                                document.getElementById("right-arrow").style.display="none";
                                                document.getElementById("pignation").style.display="none";
                                                document.getElementById("scroll-space").style.overflowX="hidden";
                                                document.getElementById("form-3").className="position-absolute w-100"
                                                var keys = Object.keys(localStorage);
                                                    keys.forEach(key=>{
                                                        if(/[0-9]/g.test(key))
                                                        if(localStorage.getItem(key)){

                                                            const li = document.createElement("li");
                                                            const btn = document.createElement('button');
                                                            btn.classList="btn btn-danger";
                                                            btn.innerHTML = "Remove"
                                                            li.style.color = this.state.text_color;
                                                            li.classList="list-group-item bg-transparent d-flex justify-content-between align-items-center fs-1 w-75 m-auto";
                                                            li.innerHTML = localStorage.getItem(key)
                                                            btn.onclick=(e)=>{
                                                                nego.clearRoom(localStorage.getItem(key))
                                                                e.target.parentElement.remove();
                                                                localStorage.removeItem(key)
                                                            }
                                                            li.append(btn);
                                                            document.getElementById("form-3").append(li);
                                                        }
                                                    });

                                            }
                                            catch(err){
                                                document.getElementById("errorBody").innerHTML = `<div class="alert alert-danger" role="alert">
                                                ${String(err)}
                                              </div>`
                                                var m = document.querySelector('#myModal');
                                                var myModal = new Modal(m, {
                                                    keyboard: false
                                                })
                                                myModal.show();
                                            }

                                        }}>
                                        <i className="bi bi-x-circle-fill text-light me-5"></i>
                                            Remove Meet
                                        </button>
                                        <button type="button" className="btn btn-secondary rounded-pill fw-bolder position-relative m-auto" style={{fontSize:"5vw",display:"none",padding:"30px",height:"100%",width:"60%"}}
                                        onClick={(e)=>{
                                            document.getElementById("fade-bg-3").className = "row p-0 m-0 position-absolute start-50 translate-middle";
                                            document.getElementById("fade-title-3").className = "row p-3 m-3";
                                            e.target.style.display = "none";
                                            e.target.previousElementSibling.style.display = "inline";
                                            document.getElementById("left-arrow").style.display="inline";
                                            document.getElementById("right-arrow").style.display="inline";
                                            document.getElementById("pignation").style.display="block";
                                            document.getElementById("scroll-space").style.overflowX="scroll";
                                            document.getElementById("form-3").className="position-absolute w-100 opacity-0"
                                        }}
                                        >
                                            Close
                                        </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                   </div>
                   <div id="pignation" className="position-absolute start-50 translate-middle" style={{bottom:"1.5%"}}>
                        <span className="border border-secondary rounded-circle d-inline-block p-3 m-2 bg-secondary"></span>
                        <span className="border border-secondary rounded-circle d-inline-block p-3 m-2"></span>
                        <span className="border border-secondary rounded-circle d-inline-block p-3  m-2"></span>
                   </div>

                   <span id="left-arrow" className="position-absolute top-50 p-1" style={{border:"30px solid",borderTopColor:"transparent",borderBottomColor:"transparent",borderLeftColor:"transparent"}} onClick={(e)=>{
                       e.target.style.borderRightColor="blue";
                       setTimeout(()=>{
                            e.target.style.borderRightColor=this.state.text_color;
                       },150)
                       document.getElementById('scroll-space').scrollBy(-(this.state.landing_page_width),0);
                   }}></span>
                   <span id="right-arrow" className="position-absolute top-50 end-0 p-1" style={{border:"30px solid",borderTopColor:"transparent",borderBottomColor:"transparent",borderRightColor:"transparent"}} onClick={(e)=>{
                        e.target.style.borderLeftColor="blue";
                        setTimeout(()=>{
                             e.target.style.borderLeftColor=this.state.text_color;
                        },150)
                        document.getElementById('scroll-space').scrollBy(this.state.landing_page_width,0);

                   }}></span>

                    <div className="modal fade overflow-hidden" id="myModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg rounded-3" >
                        <div className="modal-content shadow" style={{backgroundColor:this.state.display_color}}>
                        <div className="modal-header border-dark">
                            <h5 className="modal-title text-primary" id="staticBackdropLabel">Ujoin</h5>
                            <button type="button" className="btn-close" style={{backgroundColor:this.state.display_color}} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div id="errorBody" className="modal-body p-2">

                        </div>
                        </div>
                    </div>
                    </div>

                </div>
            )

          ):<CallUI audioId={this.state.audioId} fields={fields} display_color={this.state.display_color}
          input_shadow={this.state.input_shadow} text_color={this.state.text_color} reverse_shadow={this.state.reverse_shadow} message_input={this.state.message_input} closeCallUI={()=>{
              this.setState(state=>{
                  state.isStart = true;
                  return state;
              })
          }} offMyVideo ={this.state.offMyVideo} offMyAudio = {this.state.offMyAudio} changeMode={(mode)=>{
            if(mode == "light"){
              this.setState(state=>{
                state.display_color="#F5F5F5";
                state.input_shadow="-15px -15px 50px #FFFFFF,5px 5px 50px rgba(150,150,150,0.5)";
                state.text_color="#000000";
                state.reverse_shadow = "15px 15px 50px inset #cdcdce,-5px -5px 25px inset #FFFFFF";
                state.message_input = "#EFEFEF";
                state.desktop_input="#eeeeee";
                return state;
              })
            }else{

              this.setState(state=>{
                state.display_color="#323335";
                state.input_shadow="-15px -15px 50px #484848,5px 5px 50px #000000";
                state.text_color="#ffffff";
                state.reverse_shadow = "15px 15px 50px inset #000000,-5px -5px 25px inset #707070";
                state.message_input = "#707070";
                state.desktop_input="#323335";
                return state;
              })
            }
          }}/>
        )
    }
}


export default LandingPage;
