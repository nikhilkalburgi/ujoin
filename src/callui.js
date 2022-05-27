import React from 'react';
import nego from './negotiator';

let msg_timeout = null,message_counter=0;
let datachannel_list=[],sendTo = [];
let chunks = [];
let mediaRecorder = null;
let recorderStream = null,recorderScreenStream = null , recorderAudioStream = null;
let conversation = new Set();
let date = new Date();
let secon = false;
const  conversationPopup = document.createElement("div");
const  conversationTitle = document.createElement("h6");
const conversationBtn = document.createElement("button");
conversationBtn.classList = "btn border border-info bg-primary p-2 rounded-pill"
conversationBtn.innerHTML = "Get It"
conversationTitle.innerHTML = "Do you want to fetch all the previous content of this meet ?"
conversationPopup.classList = "p-3 mb-5 m-auto border-0 bg-info opacity-75";
conversationPopup.style.width = "90%";
conversationPopup.style.borderRadius = "20px";
conversationPopup.append(conversationTitle);
conversationPopup.append(conversationBtn);

var display_color="#2B2F35";
var box_shadow="inset 2px 2px 10px black,inset -2px -2px 10px #787981";
var outershadow="-2px -1px 10px #787981, 4px 4px 20px black";

function scroll_to(div){
    if (div.scrollTop < div.scrollHeight - div.clientHeight)
         div.scrollTop += div.clientHeight; // move down

 }

 const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "mobile";
    }
    return "desktop";
  };

class CallUI extends React.Component{
    constructor(props){
        super(props);
        this.state={
            callui_width:window.innerWidth,
            me:null,
            videolist:[],
            display_color:props.display_color,
            selfDisplay:"block",
            selfTop:"70%",
            selfLeft:"60%",
            datachannel_list:[],
            box_shadow:box_shadow,
            outershadow:outershadow,
            height:(window.innerHeight >= window.innerWidth)? window.innerHeight : window.innerWidth,
            display_color:this.props.display_color,
            input_shadow:this.props.input_shadow,
            text_color:this.props.text_color,
            message_input:this.props.message_input,
            reverse_shadow:this.props.reverse_shadow
        }
    }

    display_me = (stream)=>{
        document.getElementById("mydivheader").childNodes[1].srcObject = stream;
    }

    remove_message = (members,uid)=>{
        if(datachannel_list){

            datachannel_list.forEach((item,index)=>{
                if(item.peer == uid)datachannel_list.splice(index,1)
            })
            this.setState(state=>{
                state.datachannel_list = datachannel_list;
                return state;
            })
        }
    }

    sendMessage = (dataChannel,username)=>{
        if(username)dataChannel.metadata.username = username;

        datachannel_list.push(dataChannel);
        dataChannel.on("data",(channelMessage)=>{
            if(datachannel_list.length)
            if(channelMessage == "video" ||channelMessage == "audio"){
                nego.updateOnAV(channelMessage,dataChannel.peer);
            }else{
                let messages =  JSON.parse(channelMessage);
                const  messageDiv = document.createElement("div");
                messageDiv.classList = "p-3 mb-4 m-auto border border-secondary";
                messageDiv.style.width = "90%";
                messageDiv.style.borderRadius = "20px";
                messageDiv.style.backgroundColor = "transparent";
                const  title = document.createElement("div");
                const  message = document.createElement("div");
                message.classList = "fs-5 text-start";
                title.classList = "fs-6 text-start";
                message.style.wordBreak="break-all"
                messageDiv.append(title);
                messageDiv.append(message);
                title.innerHTML = `From ${messages.from} to ${messages.to} - <span style='float:right',class='fs-6'>${date.toLocaleTimeString(message.time)}</span>`;
                message.innerHTML = messages.message;
                 document.getElementById("messageZone").append(messageDiv);
                 scroll_to(document.getElementById("messageZone"))
            }

        })
        if(document.getElementById("sendBtn"))
        document.getElementById("sendBtn").onclick=(e)=>{
            let msg = {
                from:this.props.fields.username,
                to:(sendTo.length == 0)? "all":((sendTo.length == 1)?sendTo[0]:"many"),
                message:document.getElementById("messageBox").value,
                time:date.getTime()
            }
            const  messageDiv = document.createElement("div");
            messageDiv.classList = "p-3 mb-4 m-auto border border-secondary";
            messageDiv.style.width = "90%";
            messageDiv.style.borderRadius = "20px";
            messageDiv.style.backgroundColor = "transparent";
            const  title = document.createElement("div");
            const  message = document.createElement("div");
            message.classList = "fs-5 text-start";
            title.classList = "fs-6 text-start";
            message.style.wordBreak="break-all"
            messageDiv.append(title);
            messageDiv.append(message);

            title.innerHTML = `From ${msg.from} to ${msg.to} - <span style='float:right' class='fs-6'>${date.toLocaleTimeString(message.time)}</span>`;
            message.innerHTML = msg.message;
            document.getElementById("messageZone").appendChild(messageDiv);
            scroll_to(document.getElementById("messageZone"))
            if(msg.to == "all")
            sessionStorage.setItem(message_counter++,JSON.stringify(msg))
            if(document.getElementById("hiddenDiv").innerHTML != "all"){
                for(let dc of datachannel_list){
                    if(sendTo.includes(dc.metadata.username)){
                        dc.send(JSON.stringify(msg))
                    }
                }
                document.getElementById("hiddenDiv").innerHTML = "all"
            }
            else
            for(let dc of datachannel_list){
                    dc.send(JSON.stringify(msg))
            }
            e.target.previousElementSibling.value = "";
        }
        this.setState(state=>{
            state.datachannel_list = datachannel_list;
            return state;
        })
    }

    display_conversation = (metadata)=>{
        let sorted_conversation = [];
        conversation.add(metadata.conversation)
        conversationBtn.onclick=()=>{
            conversationPopup.remove();
            clearTimeout(msg_timeout);
            conversation = conversation.values();
            for(let i of conversation)sorted_conversation.push(i);
            sorted_conversation = sorted_conversation.flat(1);
            sorted_conversation = sorted_conversation.sort((a,b)=>b.time-a.time)
            for(let msg of sorted_conversation){
                const  messageDiv = document.createElement("div");
                messageDiv.classList = " p-2 mb-2 m-auto border border-secondary";
                messageDiv.style.width = "90%";
                messageDiv.style.borderRadius = "20px";
                messageDiv.style.backgroundColor = "transparent";
                const  title = document.createElement("div");
                const  message = document.createElement("div");
                message.classList = "fs-4";
                message.style.wordBreak="break-all"
                messageDiv.append(title);
                messageDiv.append(message);
                date.setTime(msg.time);
                title.innerHTML = `From ${msg.from} to ${msg.to} at ${date.toLocaleString()} (unordered) -`;
                message.innerHTML = msg.message;
                document.getElementById("messageZone").append(messageDiv);
                scroll_to(document.getElementById("messageZone"))
            }

        }
        document.getElementById("messageZone").append(conversationPopup);
        scroll_to(document.getElementById("messageZone"))
        msg_timeout = setTimeout(()=>{
            try{
                conversationPopup.remove();
            }catch(err){
                alert(err)
            }
        },120000)

    }

    componentDidMount(){
        document.body.style.backgroundColor = this.state.display_color;
        document.getElementById("btnradio1").click();

        window.onresize=(e)=>{
            this.setState((state,props)=>{
                state.callui_width = e.target.innerWidth;
                return state;
            })
                if(document.getElementById("chatbtn") && e.target.innerWidth >= 1000)
                document.getElementById("chatbtn").click();


        }

        nego.joinMeet(this.props.fields,document.getElementById("body"),this.sendMessage,this.display_me,
        this.display_conversation,document.getElementById("people"),this.props.offMyVideo,this.props.offMyAudio,this.props.audioId,this.remove_message);
        document.onbeforeunload=(e)=>{
            if(getDeviceType()== "mobile" || getDeviceType() == "tablet"){                
                nego.disconnect(this.props.fields)
                return "";
            }
        }
        window.onunload=()=>{
            nego.disconnect(this.props.fields)
        }
        document.onvisibilitychange=()=>{
            if(getDeviceType() == "mobile" || getDeviceType() == "tablet")
          if(this.state.callui_width <= 1000){
            nego.disconnect(this.props.fields)
          }
        }

        window.addEventListener('popstate', (event) => {
            if(getDeviceType() == "mobile" || getDeviceType() == "tablet")
            if(this.state.callui_width <= 1000){
                nego.disconnect(this.props.fields)
              }
        });

        
        var offset = [0,0];
        var divOverlay = document.getElementById ("mydiv");
        var isDown = false;
        divOverlay.addEventListener('mousedown', function(e) {
            isDown = true;
            offset = [
                divOverlay.offsetLeft - e.clientX,
                divOverlay.offsetTop - e.clientY
            ];
        }, true);
        document.addEventListener('mouseup', function() {
            isDown = false;
        }, true);
        
        document.addEventListener('mousemove', function(e) {
            e.preventDefault();
            if (isDown) {
                divOverlay.style.left = (e.clientX + offset[0]) + 'px';
                divOverlay.style.top  = (e.clientY + offset[1]) + 'px';
            }
        }, true);


       

        if(getDeviceType() == "mobile" || getDeviceType() == "tablet"){
            console.log(getDeviceType())
            if(!this.props.offMyVideo)
            document.getElementById("video-btn").className="p-4 col-1";
            else
            document.getElementById("video-btn").className="p-4 col-1 text-primary";
    
            if(!this.props.offMyAudio)
            document.getElementById("audio-btn").className="p-4 col-1";
            else
            document.getElementById("audio-btn").className="p-4 col-1 text-primary";
        }else{
            if(!this.props.offMyVideo)
            document.getElementById("video-btn").className="pt-3 text-center";
            else
            document.getElementById("video-btn").className="pt-3 text-center text-primary";
    
            if(!this.props.offMyAudio)
            document.getElementById("audio-btn").className="pt-3 text-center";
            else
            document.getElementById("audio-btn").className="pt-3 text-center text-primary";
        }
    }
    componentWillUnmount(){
        if(msg_timeout)
        clearTimeout(msg_timeout);
         msg_timeout = null;
         message_counter=0;
         datachannel_list=[];
         sendTo = [];
         sessionStorage.clear();
         document.getElementById("sendBtn").onclick=null;
         conversationBtn.onclick=null;
         window.onresize=null;
         window.onbeforeunload=null;
         conversation = new Set();
    }
    render(){
        return (
            (this.state.callui_width >= 1000)?       
            <div>

                <div className='container-fluid' style={{overflow:"hidden"}}>

                

                    <div className='row row-cols-3 flex-nowrap' style={{backgroundColor:this.state.display_color,color:this.state.text_color,overflow:"hidden"}}>

                    
                                    <div id="mydiv" className="position-absolute"
                                    style={{width:"15%",top:this.state.selfTop,left:this.state.selfLeft,display:this.state.selfDisplay,zIndex:2}}
                                    >
                                    <div id="mydivheader" style={{height:"20vh"}}>
                                    <button type="button"
                                        onClick={()=>{
                                            document.getElementById("displayMeBtn").classList="btn btn-secondary rounded-pill p-3"
                                            this.setState(state=>{
                                                state.selfDisplay = "none";
                                                return state;
                                            })
                                        }}
                                     className='btn btn-close btn-light bg-secondary m-2'></button>
                                     <video autoPlay muted className="w-100 h-100 border border-1 border-secondary rounded-3" style={{transform:"scaleX(-1)",objectFit:"cover"}}></video>
                                    </div>
                                    </div>
                        
                    <div className='col p-0 border-secondary' style={{width:"5%",borderRight:"0.5px solid"}}>
                    <div className="w-100 position-relative border-secondary d-flex justify-content-around" style={{height:"70vh",flexDirection:"column"}}>
                <div id="video-btn" className="pt-3 text-center"
                onClick={()=>{
                    if(document.getElementById("video-btn").className == "pt-3 text-center"){
                        document.getElementById("video-btn").className = "pt-3 text-center text-primary";
                    }else{
                        document.getElementById("video-btn").className = "pt-3 text-center";
                    }
                    nego.toggleVideo();
                    for(let dc of datachannel_list){
                        dc.send("video")
                    }
                 }}
                ><i className="bi bi-camera-video-fill" style={{fontSize:"1.5vw",cursor:"pointer"}}></i></div>
                <div id="audio-btn" className="pt-3 text-center"
                onClick={()=>{
                    if(document.getElementById("audio-btn").className == "pt-3 text-center"){
                        document.getElementById("audio-btn").className = "pt-3 text-center text-primary"
                    }else{
                        document.getElementById("audio-btn").className = "pt-3 text-center"
                    }
                    nego.toogleAudio();
                    for(let dc of datachannel_list){
                        dc.send("audio")
                    }
                 }}
                ><i className="bi bi-mic-fill" style={{fontSize:"1.5vw",cursor:"pointer"}}></i></div>
                <div id="hang-btn" className="p-3 text-center rounded-circle bg-danger" style={{borderRadius:20,boxShadow:this.state.input_shadow,width:"85%",aspectRatio:1/1,marginLeft:"auto",marginRight:"auto",cursor:"pointer"}}
                onClick={async()=>{
                    await nego.disconnect(this.props.fields);
                     nego.hangUP(this.props.audioId);
                     this.props.closeCallUI();
                     window.location.reload();
                 }}
                ><i className="bi bi-telephone-fill d-inline-block" style={{fontSize:"1.5vw"}}></i></div>
                <div id="flip-btn" className="pt-3 text-center" 
                onClick={async()=>{
                    document.getElementById("flip-btn").classList = "pt-3 text-center text-primary"
                    nego.replaceStream(this.display_me,()=>{document.getElementById("flip-btn").classList = "pt-3 text-center text-secondary"});
                 }}
                ><i className="bi bi-window-fullscreen" style={{fontSize:"1.5vw",cursor:"pointer"}}></i></div>
                <div id="settings-btn" className="p-3 text-center position-absolute start-50 translate-middle" style={{top:"90vh"}} 
                onClick={(e)=>{

                    if(document.getElementById("settings-btn").className == "p-3 text-center position-absolute start-50 translate-middle"){
                        document.getElementById("settings-btn").className ="p-3 text-center position-absolute start-50 translate-middle text-primary"
                        document.getElementById("parentBody").style.width="95%";
             
                    }else{
                        document.getElementById("settings-btn").className ="p-3 text-center position-absolute start-50 translate-middle";
                        document.getElementById("parentBody").style.width="70%";
                        
                    }
                }}
                ><i className="bi bi-three-dots-vertical" style={{fontSize:"1.5vw",cursor:"pointer"}}></i></div>
            </div>
                    </div>
                    <div id="parentBody" className='col' style={{width:"70%",height:"100vh",overflowX:"hidden",overflowY:"auto"}}>
                    <div id="body" className="row d-flex m-auto row justify-content-around">
                    
                    </div>
                    </div>
                    <div id="settings-page-parent" className='col pt-1' style={{width:"25%"}}>
                    <div id="settings-page" className="position-relative top-0 h-100">
                <div className="m-auto p-2 mt-2 mb-3" style={{height:"8vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div className="btn-group" role="group" aria-label="Basic radio toggle button group " style={{width:"95%",boxShadow:this.state.input_shadow , borderRadius:20}}>
                <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" onClick={()=>{
                    document.getElementById('scroll-space').scrollTo(0,0);
                }}/>
                <label className="btn btn-outline-primary fs-6 p-1 pt-3  align-middle border-secondary" htmlFor="btnradio1" style={{borderTopLeftRadius:20,borderBottomLeftRadius:20,border:"none",borderRight:"0.5px solid",outline:"none",overflowX:"hidden"}}><i className="bi bi-chat-left-text-fill me-3"></i>Chat</label>

                <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" onClick={()=>{
                    document.getElementById('scroll-space').scrollTo(this.state.callui_width * 30 / 100,0);
                }}/>
                <label id="participants" className="btn btn-outline-primary border-0 fs-6 p-1" htmlFor="btnradio2" style={{outline:"none",overflowX:"hidden"}}><i className="bi bi-person-circle me-3"></i>{(document.getElementById("body"))?document.getElementById("body").childNodes.length+1:1}<br/> <span className="fs-6">participants</span> </label>

                <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" onClick={()=>{
                    document.getElementById('scroll-space').scrollTo(2*this.state.callui_width * 30 / 100,0);
                }}/>
                <label className="btn btn-outline-primary fs-6 p-1 pt-3 border-secondary" htmlFor="btnradio3" style={{borderTopRightRadius:20,borderBottomRightRadius:20,border:"none",borderLeft:"0.5px solid #ddd",outline:"none",overflowX:"hidden"}}><i className="bi bi-gear-fill me-2"></i>Settings</label>
                </div>
                </div>
                <div id="scroll-space" className="w-100" style={{overflowX:"scroll",height:"90%",overflowY:"hidden",scrollSnapType: "x mandatory"}} onScroll={(e)=>{ 
                    if(document.getElementById('scroll-space').scrollLeft == 0){
                        document.getElementById("btnradio1").click();
                    }else if(document.getElementById('scroll-space').scrollLeft == 30/100 * this.state.callui_width){
                         document.getElementById("btnradio2").click();
                         
                     }else if(document.getElementById('scroll-space').scrollLeft == 2 * 30/100 * this.state.callui_width){
                        document.getElementById("btnradio3").click();
                     }
                }}>
                <div className="h-100" style={{width:"300%",display:"flex",flexDirection:"row",height:"90vh"}}>
                    <div className="w-100 position-relative" style={{scrollSnapAlign: "start"}}>
                        <div id="messageZone" className="m-auto pt-2 pb-2" style={{height:"75vh",width:"92%",borderRadius:20,boxShadow:this.state.reverse_shadow,overflowY:"auto"}}>

                        </div>
                         <div id="selectList" className='w-75 m-auto position-absolute start-50 translate-middle' style={{height:0,zIndex:2,overflowY:"scroll",overflowX:"hidden",border:"1px solid transparent",backgroundColor:this.state.display_color,borderRadius:20,bottom:20}}>
                                       { this.state.datachannel_list.map((value,index)=><div key={index} className="input-group mb-1 p-4 border-0">
                                        <div className="input-group-prepend bg-transparent">
                                            <div className="form-check form-check-inline me-3 border-0 bg-transparent">
                                            <input type="checkbox" className='form-check-input' aria-label="Checkbox for following text input" onClick={(e)=>{
                                                 if(e.target.checked){
                                                    sendTo.push(value.metadata.username)
                                                }else{
                                                    sendTo.splice(sendTo.indexOf(value.metadata.username),1)
                                                }
                                            }}/>
                                            </div>
                                        </div>
                                        <span>{value.metadata.username}</span>
                                        </div>)}
                         </div>
                        <div className="input-group p-1 m-2" style={{width:"100%",height:"10vh"}}>
                        <input type="text" id="messageBox" className="form-control me-2 fs-6 border-0" placeholder="Message" aria-label="Recipient's username" aria-describedby="button-addon2"
                         style={{color:this.state.text_color,borderRadius:20,width:"70%",backgroundColor:this.state.message_input}}
                         onInput={(e)=>{
                            if(this.state.datachannel_list.length)
                            if(e.target.value == "@"){
                                document.getElementById("selectList").style.height="200px";
                                document.getElementById("selectList").style.border="0.5px solid #ddd";
                                document.getElementById("hiddenDiv").innerHTML = "not all"
                                e.target.blur();
                            }

                        }}
                        onFocus={(e)=>{
                            document.getElementById("selectList").style.height="0px";
                            document.getElementById("selectList").style.border="0.5px solid transparent";
                            document.getElementById("hiddenDiv").innerHTML = "all"
                        }}
                         />
                        <button className="btn btn-primary fs-6 me-3" type="button" id="sendBtn" style={{width:"20%",borderRadius:20}}>Send</button>
                        </div>
                    </div>
                    <div className="w-100 h-100" style={{scrollSnapAlign: "start"}}>
                    <div id="people" className="m-auto pt-5 pb-5" style={{height:"85vh",width:"92%",borderRadius:20,boxShadow:this.state.reverse_shadow,overflowY:"auto"}}>
                  
                    </div>
                    </div>
                    <div className="w-100 h-100" style={{scrollSnapAlign: "start"}}>
                    <div className="m-auto pt-3 pb-5" style={{height:"85vh",width:"92%",borderRadius:20,boxShadow:this.state.reverse_shadow,overflowY:"scroll"}}>
                    <div className="card text-end d-block mt-5 m-auto p-3" style={{width:"85%",backgroundColor:this.state.display_color,boxShadow:this.state.input_shadow,borderRadius:20}}>
                    <div className="card-body">
                        <h5 className="card-title text-center mb-3">Display Mode</h5>
                        <p className="card-text text-start mb-5">Click The Below Button To Toggle Between Color States.</p>
                        <a href="#" className="btn btn-primary rounded-pill p-3" onClick={(e)=>{
                                                  if(e.target.innerHTML == "Light Mode"){
                                                      this.props.changeMode("light");
                                                      this.setState(state=>{
                                                        state.display_color="#F5F5F5";
                                                        state.input_shadow="-15px -15px 50px #FFFFFF,5px 5px 50px rgba(150,150,150,0.5)";
                                                        state.text_color="#000000";
                                                        state.reverse_shadow = "15px 15px 50px inset #cdcdce,-5px -5px 25px inset #FFFFFF";
                                                        state.message_input = "#EFEFEF";
                                                        return state;
                                                      })
                                                      e.target.innerHTML = "Dark Mode";
                                                  }
                                                  else{
                                                      this.props.changeMode("dark");
                                                      this.setState(state=>{
                                                        state.display_color="#323335";
                                                        state.input_shadow="-15px -15px 50px #484848,5px 5px 50px #000000";
                                                        state.text_color="#ffffff";
                                                        state.reverse_shadow = "15px 15px 50px inset #000000,-5px -5px 25px inset #707070";
                                                        state.message_input = "#707070";
                                                        return state;
                                                      })
                                                      e.target.innerHTML = "Light Mode";
                                                  }
                                                }}>{(this.state.display_color == "#323335")?"Light Mode":"Dark Mode"}</a>
                    </div>
                    </div>

                    <div className="card text-end d-block mt-5 m-auto p-3" style={{width:"85%",backgroundColor:this.state.display_color,boxShadow:this.state.input_shadow,borderRadius:20}}>
                    <div className="card-body">
                        <h5 className="card-title text-center mb-3">Change Layout</h5>
                        <p className="card-text text-start mb-5">Select The Number Of Video Columns You Need On A Row.</p>
                        <select id="columnsperrow" className="form-select bg-transparent" aria-label="Default select example" onInput={(e)=>{
                                                    if(document.getElementById("body").childNodes)
                                                    document.getElementById("body").childNodes.forEach(node=>{
                                                        if(e.target.value == "2")
                                                        node.style.width = "46%";
                                                        else if(e.target.value == "3")
                                                        node.style.width = "29.33%";
                                                        else if(e.target.value == "4")
                                                        node.style.width = "21%";
                                                        else if(e.target.value == "5")
                                                        node.style.width = "16%";
                                                    })
                                                }}>
                                                <option value="2">2 Columns</option>
                                                <option value="3">3 Columns</option>
                                                <option value="4">4 Columns</option>
                                                <option value="5">5 Columns</option>

                                                </select>
                    </div>
                    </div>

                    <div className="card text-end d-block mt-5 m-auto p-3" style={{width:"85%",backgroundColor:this.state.display_color,boxShadow:this.state.input_shadow,borderRadius:20}}>
                    <div className="card-body">
                        <h5 className="card-title text-center mb-3">Display Me</h5>
                        <p className="card-text text-start mb-5">Click The Below Button To Display Yourself.</p>
                        <span id="displayMeBtn" className="btn btn-primary rounded-pill p-3" onClick={(e)=>{
                                                    if(e.target.classList == "btn btn-secondary rounded-pill p-3"){
                                                        e.target.classList = "btn btn-primary rounded-pill p-3"
                                                        this.setState(state=>{
                                                            state.selfDisplay = "flex";
                                                            state.selfLeft = "60%";
                                                            state.selfTop = "70%";
                                                            document.getElementById("mydiv").style.left = state.selfLeft;
                                                            document.getElementById("mydiv").style.top = state.selfTop;
                                                            return state;
                                                        })
                                                    }else{
                                                        this.setState(state=>{
                                                            state.selfDisplay = "none";
                                                            return state;
                                                        })
                                                        e.target.classList = "btn btn-secondary rounded-pill p-3"
                                                    }
                                                }}>Display Me</span>
                    </div>
                    </div>

                    <div className="card text-end mt-5 m-auto p-3" style={{width:"85%",backgroundColor:this.state.display_color,boxShadow:this.state.input_shadow,borderRadius:20,display:(window.MediaStream)?"block":"none"}}>
                    <div className="card-body">
                        <h5 className="card-title text-center mb-3">Recording</h5>
                        <p className="card-text text-start mb-5">Click The Below Button To Start / Stop Recording</p>
                        <span id="displayMeBtn" className="btn btn-primary rounded-pill p-3" onClick={async(e)=>{
                                                    if(e.target.innerHTML == "Start"){
                                                        e.target.innerHTML = "Starting..."

                                                        setTimeout(()=>{
                                                            e.target.innerHTML = "Start"
                                                        },30000)

                                                        if(!(recorderScreenStream = nego.getRecordScreen()))
                                                        if(!recorderScreenStream)
                                                        recorderScreenStream = await navigator.mediaDevices.getDisplayMedia()

                                                        if(!recorderAudioStream)
                                                        recorderAudioStream = await navigator.mediaDevices.getUserMedia({video:false,audio:true})

                                                        recorderStream = new MediaStream([...recorderScreenStream.getTracks(),...recorderAudioStream.getTracks()]);

                                                        recorderStream.getVideoTracks()[0].oneneded=()=>{
                                                            recorderScreenStream = null;
                                                        }
                                                            e.target.innerHTML = "Stop"

                                                            let options = {mimeType: 'video/webm'};
                                                            chunks = [];
                                                            try {
                                                                mediaRecorder = new MediaRecorder(recorderStream, options);
                                                            } catch (e0) {
                                                                alert('Unable to create MediaRecorder with options Object: ', e0);
                                                                try {
                                                                options = {mimeType: 'video/webm,codecs=vp9'};
                                                                mediaRecorder = new MediaRecorder(recorderStream, options);
                                                                } catch (e1) {
                                                                alert('Unable to create MediaRecorder with options Object: ', e1);
                                                                try {
                                                                    options = 'video/vp8'; // Chrome 47
                                                                    mediaRecorder = new MediaRecorder(recorderStream, options);
                                                                } catch (e2) {
                                                                    alert('MediaRecorder is not supported by this browser.\n\n' +
                                                                    'Try Firefox 29 or later, or Chrome 47 or later, ' +
                                                                    'with Enable experimental Web Platform features enabled from chrome://flags.');
                                                                    return;
                                                                }
                                                                }
                                                            }
                                                            mediaRecorder.onstop = function(event) {
                                                                const blob = new Blob(chunks, {type: 'video/webm'});
                                                                const url = window.URL.createObjectURL(blob);
                                                                const a = document.createElement('a');
                                                                a.style.display = 'none';
                                                                a.href = url;
                                                                a.download = `ujoin-record-${Math.floor(1000000*Math.random())}.webm`;
                                                                document.body.appendChild(a);
                                                                a.click();
                                                                setTimeout(() => {
                                                                  document.body.removeChild(a);
                                                                  window.URL.revokeObjectURL(url);
                                                                }, 100);
                                                              }
                                                            mediaRecorder.ondataavailable = function(event) {
                                                                if (event.data && event.data.size > 0) {
                                                                  chunks.push(event.data);
                                                                }
                                                              }
                                                            mediaRecorder.start(100); // collect 100ms of data

                                                    }else if(e.target.innerHTML == "Stop"){
                                                        if(mediaRecorder){
                                                            e.target.innerHTML = "Start"
                                                            mediaRecorder.stop();
                                                        }
                                                    }
                                                }}>Start</span>
                    </div>
                    </div>
                    </div>
                    </div>
                </div>

                </div>
            </div>
                    </div>
                    </div>
                </div>
                                 
                <div id="hiddenDiv" className='d-none'>all</div>


            </div>:
            
            <div className="w-100" style={{height:this.state.height,overflowX:"hidden",overflowY:"hidden",backgroundColor:this.state.display_color,color:this.state.text_color,fontFamily:"Segoe UI",fontStyle:"italic",letterSpacing:"4px",flexDirection:"column"}}>
            <div id="settings-page" className="position-relative top-0 opacity-0" style={{height:0,overflow:"hidden"}}>
                <div className="m-auto p-2 mt-2" style={{height:"10%",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div className="btn-group" role="group" aria-label="Basic radio toggle button group" style={{width:"95%",boxShadow:this.state.input_shadow}}>
                <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" onClick={()=>{
                    document.getElementById('scroll-space').scrollTo(0,0);
                }}/>
                <label className="btn btn-outline-primary fs-1 p-4 pt-4 align-middle" htmlFor="btnradio1" style={{borderTopLeftRadius:20,borderBottomLeftRadius:20,border:"none",borderRight:"0.5px solid #ddd",outline:"none"}}><i className="bi bi-chat-left-text-fill me-3"></i>Chat</label>

                <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" onClick={()=>{
                    document.getElementById('scroll-space').scrollTo(this.state.callui_width,0);
                }}/>
                <label id="participants" className="btn btn-outline-primary border-0 fs-2 p-1" htmlFor="btnradio2" style={{outline:"none"}}><i className="bi bi-person-circle me-3"></i>{(document.getElementById("body"))?document.getElementById("body").childNodes.length+1:1}<br/> <span className="fs-5">participants</span> </label>

                <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" onClick={()=>{
                    document.getElementById('scroll-space').scrollTo(2*this.state.callui_width,0);
                }}/>
                <label className="btn btn-outline-primary fs-1 p-4 pt-4" htmlFor="btnradio3" style={{borderTopRightRadius:20,borderBottomRightRadius:20,border:"none",borderLeft:"0.5px solid #ddd",outline:"none"}}><i className="bi bi-gear-fill me-2"></i>Settings</label>
                </div>
                </div>
                <div id="scroll-space" className="w-100" style={{overflowX:"scroll",height:"90%",overflowY:"hidden",scrollSnapType: "x mandatory"}} onScroll={(e)=>{ 
                    if(document.getElementById('scroll-space').scrollLeft == 0){
                        document.getElementById("btnradio1").click();
                    }else if(document.getElementById('scroll-space').scrollLeft == this.state.callui_width){
                         document.getElementById("btnradio2").click();
                         
                     }else if(document.getElementById('scroll-space').scrollLeft == 2*this.state.callui_width){
                        document.getElementById("btnradio3").click();
                     }
                }}>
                <div className="h-100" style={{width:"300%",display:"flex",flexDirection:"row"}}>
                    <div className="w-100 h-100" style={{scrollSnapAlign: "start"}}>
                        <div id="messageZone" className="m-auto pt-5 pb-3" style={{height:"90%",width:"92%",borderRadius:20,boxShadow:this.state.reverse_shadow,overflowY:"auto"}}>

                        </div>
                         <div id="selectList" className='w-75 m-auto position-absolute start-50 translate-middle' style={{height:0,bottom:"120px",zIndex:2,overflowY:"scroll",overflowX:"hidden",border:"1px solid transparent",backgroundColor:this.state.display_color,borderRadius:20}}>
                                       { this.state.datachannel_list.map((value,index)=><div key={index} className="input-group mb-1 p-4 border-0">
                                        <div className="input-group-prepend bg-transparent">
                                            <div className="form-check form-check-inline me-3 border-0 bg-transparent">
                                            <input type="checkbox" className='form-check-input' aria-label="Checkbox for following text input" onClick={(e)=>{
                                                 if(e.target.checked){
                                                    sendTo.push(value.metadata.username)
                                                }else{
                                                    sendTo.splice(sendTo.indexOf(value.metadata.username),1)
                                                }
                                            }}/>
                                            </div>
                                        </div>
                                        <span>{value.metadata.username}</span>
                                        </div>)}
                         </div>
                        <div className="input-group p-4 ps-5 pe-5" style={{width:"100%",height:"10%"}}>
                        <input type="text" id="messageBox" className="form-control me-4 fs-1 border-0" placeholder="Message" aria-label="Recipient's username" aria-describedby="button-addon2"
                         style={{color:this.state.text_color,borderRadius:20,width:"70%",backgroundColor:this.state.message_input}}
                         onInput={(e)=>{
                            if(this.state.datachannel_list.length)
                            if(e.target.value == "@"){
                                document.getElementById("selectList").style.height="400px";
                                document.getElementById("selectList").style.borderColor="#ddd";
                                document.getElementById("selectList").style.backgroundColor="#333";
                                document.getElementById("hiddenDiv").innerHTML = "not all"
                                e.target.blur();
                            }

                        }}
                        onFocus={(e)=>{
                            document.getElementById("selectList").style.height="0px";
                            document.getElementById("selectList").style.border="1px solid transparent";
                            document.getElementById("selectList").style.backgroundColor="transparent";
                            document.getElementById("hiddenDiv").innerHTML = "all"
                        }}
                         />
                        <button className="btn btn-primary fs-1" type="button" id="sendBtn" style={{width:"20%",borderRadius:20}}>Send</button>
                        </div>
                    </div>
                    <div className="w-100 h-100" style={{scrollSnapAlign: "start"}}>
                    <div id="people" className="m-auto pt-5 pb-3" style={{height:"95%",width:"92%",borderRadius:20,boxShadow:this.state.reverse_shadow,overflowY:"auto"}}>
                  
                    </div>
                    </div>
                    <div className="w-100 h-100" style={{scrollSnapAlign: "start"}}>
                    <div className="m-auto mt-2 pt-5" style={{height:"95%",width:"92%",borderRadius:20,boxShadow:this.state.reverse_shadow}}>
                    <div className="card text-end d-block mt-5 m-auto p-3" style={{width:"85%",backgroundColor:this.state.display_color,boxShadow:this.state.input_shadow,borderRadius:20}}>
                    <div className="card-body">
                        <h5 className="card-title text-center mb-3">Display Mode</h5>
                        <p className="card-text text-start mb-5">Click The Below Button To Toggle Between Color States.</p>
                        <a href="#" className="btn btn-primary rounded-pill p-3" onClick={(e)=>{
                                                  if(e.target.innerHTML == "Light Mode"){
                                                      this.props.changeMode("light");
                                                      this.setState(state=>{
                                                        state.display_color="#F5F5F5";
                                                        state.input_shadow="-15px -15px 50px #FFFFFF,5px 5px 50px rgba(150,150,150,0.5)";
                                                        state.text_color="#000000";
                                                        state.reverse_shadow = "15px 15px 50px inset #cdcdce,-5px -5px 25px inset #FFFFFF";
                                                        state.message_input = "#EFEFEF";
                                                        return state;
                                                      })
                                                      e.target.innerHTML = "Dark Mode";
                                                  }
                                                  else{
                                                      this.props.changeMode("dark");
                                                      this.setState(state=>{
                                                        state.display_color="#323335";
                                                        state.input_shadow="-15px -15px 50px #484848,5px 5px 50px #000000";
                                                        state.text_color="#ffffff";
                                                        state.reverse_shadow = "15px 15px 50px inset #000000,-5px -5px 25px inset #707070";
                                                        state.message_input = "#707070";
                                                        return state;
                                                      })
                                                      e.target.innerHTML = "Light Mode";
                                                  }
                                                }}>{(this.state.display_color == "#323335")?"Light Mode":"Dark Mode"}</a>
                    </div>
                    </div>

                    <div className="card text-end d-block mt-5 m-auto p-3" style={{width:"85%",backgroundColor:this.state.display_color,boxShadow:this.state.input_shadow,borderRadius:20}}>
                    <div className="card-body">
                        <h5 className="card-title text-center mb-3">Change Layout</h5>
                        <p className="card-text text-start mb-5">Select The Number Of Video Columns You Need On A Row.</p>
                        <select id="columnsperrow" className="form-select bg-transparent" aria-label="Default select example" onInput={(e)=>{
                                                    if(document.getElementById("body").childNodes)
                                                    document.getElementById("body").childNodes.forEach(node=>{
                                                        if(e.target.value == "2")
                                                        node.style.width = "46%";
                                                        else if(e.target.value == "3")
                                                        node.style.width = "29.33%";
                                                    })
                                                }}>
                                                <option value="2">2 Columns</option>
                                                <option value="3">3 Columns</option>
                                                </select>
                    </div>
                    </div>

                    <div className="card text-end d-block mt-5 m-auto p-3" style={{width:"85%",backgroundColor:this.state.display_color,boxShadow:this.state.input_shadow,borderRadius:20}}>
                    <div className="card-body">
                        <h5 className="card-title text-center mb-3">Display Me</h5>
                        <p className="card-text text-start mb-5">Click The Below Button To Display Yourself.</p>
                        <span id="displayMeBtn" className="btn btn-primary rounded-pill p-3" onClick={(e)=>{
                                                    if(e.target.classList == "btn btn-secondary rounded-pill p-3"){
                                                        e.target.classList = "btn btn-primary rounded-pill p-3"
                                                        this.setState(state=>{
                                                            state.selfDisplay = "flex";
                                                            return state;
                                                        })
                                                    }else{
                                                        this.setState(state=>{
                                                            state.selfDisplay = "none";
                                                            return state;
                                                        })
                                                        e.target.classList = "btn btn-secondary rounded-pill p-3"
                                                    }
                                                }}>Display Me</span>
                    </div>
                    </div>

                    <div className="card text-end mt-5 m-auto p-3" style={{width:"85%",backgroundColor:this.state.display_color,boxShadow:this.state.input_shadow,borderRadius:20,display:(window.MediaStream)?"block":"none"}}>
                    <div className="card-body">
                        <h5 className="card-title text-center mb-3">Recording</h5>
                        <p className="card-text text-start mb-5">Click The Below Button To Start / Stop Recording</p>
                        <span id="displayMeBtn" className="btn btn-primary rounded-pill p-3" onClick={async(e)=>{
                                                    if(e.target.innerHTML == "Start"){
                                                        e.target.innerHTML = "Starting..."

                                                        setTimeout(()=>{
                                                            e.target.innerHTML = "Start"
                                                        },30000)

                                                        if(!(recorderScreenStream = nego.getRecordScreen()))
                                                        if(!recorderScreenStream)
                                                        recorderScreenStream = await navigator.mediaDevices.getDisplayMedia()

                                                        if(!recorderAudioStream)
                                                        recorderAudioStream = await navigator.mediaDevices.getUserMedia({video:false,audio:true})

                                                        recorderStream = new MediaStream([...recorderScreenStream.getTracks(),...recorderAudioStream.getTracks()]);

                                                        recorderStream.getVideoTracks()[0].oneneded=()=>{
                                                            recorderScreenStream = null;
                                                        }
                                                            e.target.innerHTML = "Stop"

                                                            let options = {mimeType: 'video/webm'};
                                                            chunks = [];
                                                            try {
                                                                mediaRecorder = new MediaRecorder(recorderStream, options);
                                                            } catch (e0) {
                                                                alert('Unable to create MediaRecorder with options Object: ', e0);
                                                                try {
                                                                options = {mimeType: 'video/webm,codecs=vp9'};
                                                                mediaRecorder = new MediaRecorder(recorderStream, options);
                                                                } catch (e1) {
                                                                alert('Unable to create MediaRecorder with options Object: ', e1);
                                                                try {
                                                                    options = 'video/vp8'; // Chrome 47
                                                                    mediaRecorder = new MediaRecorder(recorderStream, options);
                                                                } catch (e2) {
                                                                    alert('MediaRecorder is not supported by this browser.\n\n' +
                                                                    'Try Firefox 29 or later, or Chrome 47 or later, ' +
                                                                    'with Enable experimental Web Platform features enabled from chrome://flags.');
                                                                    return;
                                                                }
                                                                }
                                                            }
                                                            mediaRecorder.onstop = function(event) {
                                                                const blob = new Blob(chunks, {type: 'video/webm'});
                                                                const url = window.URL.createObjectURL(blob);
                                                                const a = document.createElement('a');
                                                                a.style.display = 'none';
                                                                a.href = url;
                                                                a.download = `ujoin-record-${Math.floor(1000000*Math.random())}.webm`;
                                                                document.body.appendChild(a);
                                                                a.click();
                                                                setTimeout(() => {
                                                                  document.body.removeChild(a);
                                                                  window.URL.revokeObjectURL(url);
                                                                }, 100);
                                                              }
                                                            mediaRecorder.ondataavailable = function(event) {
                                                                if (event.data && event.data.size > 0) {
                                                                  chunks.push(event.data);
                                                                }
                                                              }
                                                            mediaRecorder.start(100); // collect 100ms of data

                                                    }else if(e.target.innerHTML == "Stop"){
                                                        if(mediaRecorder){
                                                            e.target.innerHTML = "Start"
                                                            mediaRecorder.stop();
                                                        }
                                                    }
                                                }}>Start</span>
                    </div>
                    </div>
                    </div>
                    </div>
                </div>

                </div>
            </div>
            <h2 id="title" className="m-4 text-center">
                Ujoin
            </h2>
            <div className="text-center w-100 mt-0 m-auto" style={{height:this.state.height-240,overflowX:"hidden",overflowY:"auto"}}>
                <div id="body" className="row d-flex m-auto row justify-content-around">
                    
                </div>
            </div>
           
            <div className="row position-absolute bottom-0 text-center w-100 p-4 border-top border-secondary" style={{justifyContent:"space-around",alignItems:"center"}}>
                <div id="video-btn" className="p-4 col-1" style={{borderRadius:20,boxShadow:this.state.input_shadow}}
                onClick={()=>{
                    if(document.getElementById("video-btn").className == "p-4 col-1"){
                        document.getElementById("video-btn").className = "p-4 col-1 text-primary"
                    }else{
                        document.getElementById("video-btn").className = "p-4 col-1"
                    }
                    nego.toggleVideo();
                    for(let dc of datachannel_list){
                        dc.send("video")
                    }
                 }}
                ><i className="bi bi-camera-video-fill" style={{fontSize:"3vw"}}></i></div>
                <div id="audio-btn" className="p-4 col-1" style={{borderRadius:20,boxShadow:this.state.input_shadow}}
                onClick={()=>{
                    if(document.getElementById("audio-btn").className == "p-4 col-1"){
                        document.getElementById("audio-btn").className = "p-4 col-1 text-primary"
                    }else{
                        document.getElementById("audio-btn").className = "p-4 col-1"
                    }
                    nego.toogleAudio();
                    for(let dc of datachannel_list){
                        dc.send("audio")
                    }
                 }}
                ><i className="bi bi-mic-fill" style={{fontSize:"3vw"}}></i></div>
                <div id="hang-btn" className="p-4 rounded-pill col-3 bg-danger" style={{borderRadius:20,boxShadow:this.state.input_shadow}}
                onClick={async()=>{
                    await nego.disconnect(this.props.fields);
                     nego.hangUP(this.props.audioId);
                     this.props.closeCallUI();
                 }}
                ><i className="bi bi-telephone-fill d-inline-block" style={{fontSize:"3vw"}}></i></div>
                <div id="flip-btn" className="p-4 col-1" style={{borderRadius:20,boxShadow:this.state.input_shadow}} 
                onClick={async()=>{

                    document.getElementById("flip-btn").className = "p-4 col-1 text-primary"
                    if(document.getElementById("audio-btn").className="p-4 col-1"){
                     secon =true;
                      document.getElementById("audio-btn").className="p-4 col-1 text-primary";
                      nego.toogleAudio();
                    }
                    nego.flipCamera(this.display_me,()=>{document.getElementById("flip-btn").className = "p-4 col-1";if(secon){document.getElementById("audio-btn").className="p-4 col-1";nego.toogleAudio();secon=false}},this.props.audioId);
                 }}
                ><i className="bi bi-arrow-repeat" style={{fontSize:"3vw"}}></i></div>
                <div id="settings-btn" className="p-4 col-1" style={{borderRadius:20,boxShadow:this.state.input_shadow}} 
                onClick={(e)=>{

                    if(document.getElementById("settings-btn").className == "p-4 col-1"){
                        document.getElementById("settings-btn").className ="p-4 col-1 text-primary"
                        document.getElementById("settings-page").style.height = (this.state.height-150) + "px";
                        document.getElementById("settings-page").className="position-relative top-0 opacity-1";
                        document.getElementById("title").className="m-4 text-center opacity-0";
                        document.getElementById("body").className="row d-flex m-auto row justify-content-around opacity-0";
                    }else{
                        document.getElementById("settings-btn").className ="p-4 col-1";
                        document.getElementById("settings-page").style.height = 0;
                        document.getElementById("settings-page").className="position-relative top-0 opacity-0";
                        document.getElementById("title").className="m-4 text-center opacity-1";
                        document.getElementById("body").className="row d-flex m-auto row justify-content-around";
                    }
                }}
                ><i className="bi bi-three-dots-vertical" style={{fontSize:"3vw"}}></i></div>
            </div>

            <div id="hiddenDiv" className='d-none'>all</div>
            <div id="mydiv"
                                style={{position:"absolute",width:"25%",top:this.state.selfTop,left:this.state.selfLeft,display:this.state.selfDisplay,touchAction:'none'}}
                                onTouchMove={(e)=>{
                                  console.log(e)
                                    this.setState(state=>{
                                        state.selfLeft = e.touches[0].clientX+"px";
                                        state.selfTop = e.touches[0].clientY+"px";
                                        return state;
                                    })
                                }}
                                >
                                <div id="mydivheader" style={{height:200}}>
                                <button type="button"
                                    onClick={()=>{
                                        document.getElementById("displayMeBtn").classList="btn btn-secondary rounded-pill p-3"
                                            this.setState(state=>{
                                                state.selfDisplay = "none";
                                                return state;
                                            })
                                    }}
                                    onTouchStart={()=>{
                                        document.getElementById("displayMeBtn").classList="btn btn-secondary p-3"
                                        this.setState(state=>{
                                            state.selfDisplay = "none";
                                            return state;
                                        })
                                    }}
                                 className='btn btn-close btn-secondary bg-secondary m-1'></button>
                                 <video muted autoPlay className="w-100 h-100 border border-1 border-secondary rounded-3"></video>
                                </div>
                                </div>

        </div>
        )
    }
}

export default CallUI;
