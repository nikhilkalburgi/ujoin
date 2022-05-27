
import firebase from "firebase/app";
import   "firebase/database";
import Peer from "peerjs";

let peers = {}
let uid = null;
let mediaStream = null;
let streams = null;
let videoList = {};
let memberList = {};
let streamList = [];
let VT = null , AT = null;
let conversation_blocks = [];
let videoPerRow = 0;
let nego_offMyVideo=null,nego_offMyAudio=null;
let toogleCamera = true;

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

const firebaseConfig = {
  apiKey: "AIzaSyBZShGCc1RiXWugsfDoKMdBXaGL9F1l-0s",
  authDomain: "u-join.firebaseapp.com",
  projectId: "u-join",
  storageBucket: "u-join.appspot.com",
  messagingSenderId: "581753659416",
  appId: "1:581753659416:web:add0e753d9dbd446e5236d"
};

  const app = firebase.initializeApp(firebaseConfig);
  var database = firebase.database(app);


  function joinMeet(input,videoGrid,send_message,display_me,display_conversation,memberGrid,offMyVideo,offMyAudio,audioId,remove_message){
    let myPeer = new Peer();
    const myVideo = document.createElement('video')
    myVideo.muted = true
    nego_offMyVideo=offMyVideo;nego_offMyAudio=offMyAudio;
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId:audioId,
        echoCancellation:false,
        noiseSuppression:false,
        autoGainControl:false,
        latency:0,

      },
      video: {
        width: 400,
        height: 350
      }
    }
    ).then(stream => {
      streams=stream;
      display_me(stream);
      VT = stream.getVideoTracks()[0];
      AT = stream.getAudioTracks()[0];

      VT.enabled = offMyVideo;
      AT.enabled = offMyAudio

      myPeer.on('call', call => {
        call.answer(stream)
        const video_block = document.createElement("div");
        video_block.style.borderRadius = "15px";
        video_block.style.width = "46%";
        const username_block = document.createElement("div");


        if(getDeviceType() == "desktop"){
          username_block.classList = "position-absolute start-50 translate-middle container ps-4 pe-3 bottom-0"
          username_block.innerHTML = '\
          <div class="row d-flex justify-content-between">\
          <div class="col-2 bg-secondary text-center rounded-circle text-center opacity-75" style="width:30px;height:30px;display:flex;justify-content:center;align-items:center">\
          <i class="bi bi-mic-fill fs-6"></i>\
          </div>\
          <div class="col-7 bg-secondary text-center rounded-pill p-1 opacity-75 text-nowrap overflow-hidden fw-bolder">\
          '+call.metadata.username+'\
          </div>\
          </div>\
          ';
          video_block.classList = "position-relative border border-primary m-3 mb-2 p-0 overflow-hidden";
          username_block.children[0].children[0].className= (!call.metadata.audio)?"col-2 bg-secondary rounded-circle text-center ps-2 opacity-75 text-dark":"col-2 bg-secondary rounded-circle text-center ps-2 opacity-75 text-primary";

        }else{
          username_block.classList = "position-absolute start-50 translate-middle bottom-0 container ps-4 pe-3 bottom-0"
          username_block.innerHTML = '\
          <div class="row d-flex justify-content-between">\
          <div class="col-2 bg-scondary rounded-circle text-center ps-3 opacity-75" style="width:60px;height:60px;display:flex;justify-content:center;align-items:center">\
          <i class="bi bi-mic-fill fs-4"></i>\
          </div>\
          <div class="col-7 bg-secondary text-center rounded-pill p-1 opacity-75 text-nowrap overflow-hidden fw-bolder" style="margin-top:25px">\
          '+call.metadata.username+'\
          </div>\
          </div>\
          ';
          video_block.classList = "position-relative border border-primary m-3 mb-4 p-0 overflow-hidden";
          username_block.children[0].children[0].className= (!call.metadata.audio)?"col-2 bg-secondary rounded-circle text-center ps-3 opacity-75 text-dark":"col-2 bg-secondary rounded-circle text-center ps-3 opacity-75 text-primary";

        }

        const video = document.createElement('video');
        video.classList="w-100 h-100 m-0 p-0"
        video_block.append(video);
        video_block.append(username_block);
        videoList[call.peer] = video_block

        const member = document.createElement("div");
        member.classList = "row row-cols-3 m-auto p-4 text-center overflow-hidden border-bottom border-secondary";
        member.style.width = "85%";
        member.style.borderRadius = "20px";
        member.style.flexDirection = "row";
        member.style.alignItems = "center";
        const memberVisual = document.createElement("canvas");
        memberVisual.classList = "col-2 border me-1 border-5 border-primary text-center rounded-circle"
        memberVisual.style.width = "100px";
        memberVisual.style.height = "100px";
        const memberName = document.createElement("h6");
        memberName.classList = "overflow-hidden col-7 ps-4 p-5 text-nowrap fs-3";
        const memberOthers = document.createElement("div");
        memberOthers.classList = "d-flex justify-content-between col-3 p-1 fs-1";
        if(getDeviceType() == "desktop"){
          memberVisual.style.width = "50px";
          memberVisual.style.height = "50px";
          member.classList = "row row-cols-3 flex-nowrap m-auto text-center p-2 overflow-hidden border-bottom border-secondary";
          memberName.classList = "overflow-hidden col-7 text-nowrap fs-6";
          memberOthers.classList = "d-flex justify-content-between col-3 p-1 fs-6";
        }
        memberName.innerHTML = call.metadata.username;
        memberOthers.innerHTML = '\
        <button type="button" class="border-0 bg-transparent">\
                                <i class="bi bi-pin-angle-fill"></i>\
                                </button>\
                                <span>\
                                <i class="bi bi-mic-fill"></i>\
                                </span>\
                                <span>\
                                <i class="bi bi-camera-video-fill"></i>\
                                </span>\
        ';

        memberOthers.children[1].children[0].className=(!call.metadata.audio)?"bi bi-mic-fill text-secondary":"bi bi-mic-fill text-primary";
        memberOthers.children[2].children[0].className=(!call.metadata.video)?"bi bi-camera-video-fill text-secondary":"bi bi-camera-video-fill text-primary";

        memberOthers.children[0].onclick=(e)=>{
          if(e.target.classList == "bi bi-pin-angle-fill"){

            if(videoPerRow < 6){
              if(videoPerRow == 0) videoGrid.innerHTML = "";
              video_block.children[0].play()
                videoGrid.append(video_block);
                e.target.classList = "bi bi-pin-angle-fill text-primary";
                videoPerRow++
                // videoGrid.classList = `position-relative m-auto row row-cols-${(videoPerRow<4)?videoPerRow:3} h-100 justify-content-around`;
                videoGrid.childNodes.forEach(child=>{
                  child.style.removeProperty("height")
                  if(videoPerRow == 1){
                   child.style.width="96%";
                   if(getDeviceType() == "mobile" || getDeviceType() == "tablet")child.style.height = (window.innerHeight-240)+"px";
                    else child.style.height="96vh";
                  }
                  else if(videoPerRow == 2)
                  child.style.width = "46%";
                  else if(videoPerRow >= 3)
                  child.style.width = "29.33%";
                })
            }
          }else{
            if(videoPerRow > 0){
              if(videoPerRow == 1){
                videoGrid.innerHTML = "";
                for(let i in videoList){
                  videoList[i].children[0].play()
                  videoGrid.append(videoList[i]);
                }
                videoPerRow--;
                e.target.classList = "bi bi-pin-angle-fill";
                // videoGrid.classList = `position-relative m-auto row row-cols-2 row-cols-md-4 justify-content-around`;
                videoGrid.childNodes.forEach(child=>{
                  child.style.removeProperty("height")
                  if(document.getElementById("columnsperrow").value == 2){
                    child.style.width = "46%";
                  }else if(document.getElementById("columnsperrow").value == 3){
                    child.style.width = "29.33%";
                  }else if(document.getElementById("columnsperrow").value == 4){
                    child.style.width = "21%";
                  }else if(document.getElementById("columnsperrow").value == 5){
                    child.style.width = "16%";
                  }
                })
              }else{
                if(videoList[call.peer])
                videoList[call.peer].remove();
                e.target.classList = "bi bi-pin-angle-fill";
                videoPerRow--;
                // videoGrid.classList = `position-relative m-auto row row-cols-${(videoPerRow<4)?videoPerRow:3} h-100 justify-content-around`;
                videoGrid.childNodes.forEach(child=>{
                  child.removeAttribute("height")
                  if(videoPerRow == 1){
                    if(getDeviceType() == "mobile" || getDeviceType() == "tablet")child.style.height = (window.innerHeight-240)+"px";
                    else child.style.height="96vh";
                    child.style.width = "96%";
                  }
                  else if(videoPerRow == 2)
                  child.style.width = "46%";
                  else if(videoPerRow >= 3)
                  child.style.width = "29.33%";
                })
              }
            }
          }
        }
        member.append(memberVisual);
        member.append(memberName);
        member.append(memberOthers);
        memberList[call.peer] = member;

        call.on('stream', userVideoStream => {
          memberGrid.append(member);
          addVideoStream(video, userVideoStream,videoGrid,video_block,call.peer,memberGrid,memberVisual)
        })
        peers[call.peer] = call;
        if(call.metadata.conversation.length)
        display_conversation(call.metadata);
      })
      myPeer.on("connection",(dataChannel)=>{
        send_message(dataChannel);
      })

      var user_connected = database.ref(`${input.room}/join-room`);
      user_connected.on("value",async snapshot=>{
        const join_data =  snapshot.val();
          if(join_data != "value")
           if(join_data.uid != uid){
             conversation_blocks = [];
             for(let i=0;i<sessionStorage.length;i++){
               if(JSON.parse(sessionStorage.getItem(i.toString())))
              conversation_blocks.push(JSON.parse(sessionStorage.getItem(i.toString())))
             }

             connectToNewUser(input,join_data, stream,myPeer,videoGrid,send_message,memberGrid)
           }
      })


      var user_disconnected = database.ref(`${input.room}/disconnect`);
      user_disconnected.on("value",async snapshot=>{
        const disconnect_data =  snapshot.val();
        if(disconnect_data != "value")
        if(disconnect_data.uid != uid){
          if (peers[disconnect_data.uid]){
            if(memberList[disconnect_data.uid].children[2].children[0].children[0].className == "bi bi-pin-angle-fill text-primary")
            memberList[disconnect_data.uid].children[2].children[0].click();
            videoList[disconnect_data.uid].remove()
            remove_message(memberList,disconnect_data.uid);
            memberList[disconnect_data.uid].remove();
            peers[disconnect_data.uid].close()
            delete videoList[disconnect_data.uid];
            delete memberList[disconnect_data.uid];
            delete peers[disconnect_data.uid];
          }
          document.getElementById("participants").innerHTML='<i class="bi bi-person-circle me-3"></i> ' + (document.getElementById("body").childNodes.length + 1) +'<br/> <span class="fs-6">participants</span>';
        }else{
          user_connected.off("value");
          user_disconnected.off("value");
          user_connected = null;
          user_disconnected = null;
          myPeer = null;
        }
      })
    })
    .catch((err)=>{
      alert(err);
    })
    else{
      alert("Media Not Supported");
    }

    myPeer.on('open', id => {
        uid = id
        database.ref(`${input.room}/join-room`).set({
            uid:id,
            username:input.username,
            reverse:true,
            video:offMyVideo,
            audio:offMyAudio
        });
        database.ref(`${input.room}/join-room`).set("value");
    })
}

function connectToNewUser(input,user, stream,myPeer,videoGrid,send_message,memberGrid) {
try{const call = myPeer.call(user.uid, stream,{metadata:{
    uid:uid,
    username:input.username,
    conversation:conversation_blocks,
    video:nego_offMyVideo,
    audio:nego_offMyAudio
  }});
  const dataChannel = myPeer.connect(user.uid,{
    metadata:{
      username:input.username
    },
    serialization:"json"
  });
  dataChannel.on("open",()=>{
    send_message(dataChannel,user.username);
  })
  const video_block = document.createElement("div");
  video_block.classList = "position-relative border border-primary m-3 mb-4 p-0 overflow-hidden";
  video_block.style.borderRadius = "15px";
  video_block.style.width = "46%";
  const username_block = document.createElement("div");

  if(getDeviceType() == "desktop"){
    username_block.classList = "position-absolute start-50 translate-middle container ps-4 pe-3 bottom-0"
    username_block.innerHTML = '\
    <div class="row d-flex justify-content-between">\
    <div class="col-2 bg-secondary rounded-circle text-center opacity-75" style="width:30px;height:30px;display:flex;justify-content:center;align-items:center">\
    <i class="bi bi-mic-fill fs-6"></i>\
    </div>\
    <div class="col-7 bg-secondary text-center rounded-pill p-1 opacity-75 text-nowrap overflow-hidden fw-bolder">\
    '+user.username+'\
    </div>\
    </div>\
    ';
    video_block.classList = "position-relative border border-primary m-3 mb-2 p-0 overflow-hidden";
    username_block.children[0].children[0].className= (!call.metadata.audio)?"col-2 bg-secondary rounded-circle text-center ps-2 opacity-75 text-dark":"col-2 bg-secondary rounded-circle text-center ps-2 opacity-75 text-primary";
  }else{
    username_block.classList = "position-absolute start-50 translate-middle bottom-0 container ps-4 pe-3 bottom-0"
    username_block.innerHTML = '\
    <div class="row d-flex justify-content-between">\
    <div class="col-2 bg-secondary rounded-circle text-center ps-3 opacity-75" style="width:60px;height:60px;display:flex;justify-content:center;align-items:center">\
        <i class="bi bi-mic-fill fs-4"></i>\
    </div>\
    <div class="col-7 bg-secondary text-center rounded-pill p-1 opacity-75 text-nowrap overflow-hidden fw-bolder" style="margin-top:25px">\
        '+user.username+'\
    </div>\
    </div>\
    ';
    username_block.children[0].children[0].className= (!call.metadata.audio)?"col-2 bg-secondary rounded-circle text-center ps-3 opacity-75 text-dark":"col-2 bg-secondary rounded-circle text-center ps-3 opacity-75 text-primary";
  }
  const video = document.createElement('video');
  video.classList="w-100 h-100 m-0 p-0"
  video_block.append(video);
  video_block.append(username_block);
  videoList[user.uid] = video_block;

        const member = document.createElement("div");
        member.classList = "row row-cols-3 m-auto p-4 text-center overflow-hidden border-bottom border-secondary";

        member.style.width = "85%";

        member.style.borderRadius = "20px";
        member.style.flexDirection = "row";
        member.style.alignItems = "center";
        const memberVisual = document.createElement("canvas");
        memberVisual.classList = "col-2 border me-1 border-5 border-primary text-center rounded-circle"
        memberVisual.style.width = "100px";
        memberVisual.style.height = "100px";
        const memberName = document.createElement("h6");
        memberName.classList = "overflow-hidden col-7 ps-4 p-5 text-nowrap fs-3";
        const memberOthers = document.createElement("div");
        memberOthers.classList = "d-flex justify-content-between col-3 p-1 fs-1";
        memberName.innerHTML = user.username;

        if(getDeviceType() == "desktop"){
          memberVisual.style.width = "50px";
          memberVisual.style.height = "50px";
          member.classList = "row row-cols-3 flex-nowrap text-center m-auto p-2 overflow-hidden border-bottom border-secondary";
          memberName.classList = "overflow-hidden col-7 text-nowrap fs-6";
          memberOthers.classList = "d-flex justify-content-between col-3 p-1 fs-6";
        }
        memberOthers.innerHTML = '\
        <button type="button" class="border-0 bg-transparent text-center">\
                                <i class="bi bi-pin-angle-fill"></i>\
                                </button>\
                                <span>\
                                <i class="bi bi-mic-fill"></i>\
                                </span>\
                                <span>\
                                <i class="bi bi-camera-video-fill"></i>\
                                </span>\
        ';

        memberOthers.children[1].children[0].className=(!user.audio)?"bi bi-mic-fill text-secondary":"bi bi-mic-fill text-primary";
        memberOthers.children[2].children[0].className=(!user.video)?"bi bi-camera-video-fill text-secondary":"bi bi-camera-video-fill text-primary";

        memberOthers.children[0].onclick=(e)=>{
          if(e.target.classList == "bi bi-pin-angle-fill"){
            if(videoPerRow <= 6){
              if(videoPerRow == 0) videoGrid.innerHTML = "";
              video_block.children[0].play()
                videoGrid.append(video_block);
                e.target.classList = "bi bi-pin-angle-fill text-primary";
                videoPerRow++;
                // videoGrid.classList = `position-relative m-auto row row-cols-${(videoPerRow<4)?videoPerRow:3} h-100 justify-content-around`;
                videoGrid.childNodes.forEach(child=>{
                  child.style.removeProperty("height")
                  if(videoPerRow == 1){
                    child.style.width="96%";
                    if(getDeviceType() == "mobile" || getDeviceType() == "tablet")child.style.height = (window.innerHeight-240)+"px";
                    else child.style.height="96vh";
                  }
                  else if(videoPerRow == 2)
                  child.style.width = "46%";
                  else if(videoPerRow >= 3)
                  child.style.width = "29.33%";
                })
            }
          }else{
            if(videoPerRow > 0){
              if(videoPerRow == 1){
                videoGrid.innerHTML = "";
                for(let i in videoList){
                  videoList[i].children[0].play()
                  videoGrid.append(videoList[i]);
                }
                videoPerRow--;
                e.target.classList = "bi bi-pin-angle-fill";
                // videoGrid.classList = `position-relative m-auto row row-cols-2 row-cols-md-4 justify-content-around`;
                videoGrid.childNodes.forEach(child=>{
                  child.style.removeProperty("height")
                  if(document.getElementById("columnsperrow").value == 2){
                    child.style.width = "46%";
                  }else if(document.getElementById("columnsperrow").value == 3){
                    child.style.width = "29.33%";
                  }else if(document.getElementById("columnsperrow").value == 4){
                    child.style.width = "21%";
                  }else if(document.getElementById("columnsperrow").value == 5){
                    child.style.width = "16%";
                  }
                })
              }else{
                if(videoList[user.uid])
                videoList[user.uid].remove();
                e.target.classList = "bi bi-pin-angle-fill";
                videoPerRow--;
                // videoGrid.classList = `position-relative m-auto row row-cols-${(videoPerRow<4)?videoPerRow:3} h-100 justify-content-around`;
                videoGrid.childNodes.forEach(child=>{
                  child.style.removeProperty("height")
                  if(videoPerRow == 1){
                    if(getDeviceType() == "mobile" || getDeviceType() == "tablet")child.style.height = (window.innerHeight-240)+"px";
                    else child.style.height="96vh";
                    child.style.width = "96%";
                  }
                  else if(videoPerRow == 2)
                  child.style.width = "46%";
                  else if(videoPerRow >= 3)
                  child.style.width = "29.33%";
                })
              }
            }
          }
        }
        member.append(memberVisual);
        member.append(memberName);
        member.append(memberOthers);
        memberList[user.uid] = member;

  call.on('stream', userVideoStream => {
    memberGrid.append(member);
    addVideoStream(video, userVideoStream,videoGrid,video_block,user.uid,memberGrid,memberVisual)
  })
  call.on('close', () => {
    if(video)
    video.remove()
  })

  peers[user.uid] = call
}
catch(err){alert(err)}

}

function addVideoStream(video, stream,videoGrid,video_block,uid,memberGrid,visualizer) {
  if(!streamList.includes(stream))
  {
    video.srcObject = stream;
    video.style.width="100%"
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    streamList.push(stream);
    if(videoPerRow == 0)
    videoGrid.append(video_block)
    sortMembers(stream,uid,memberGrid,visualizer,videoGrid);
  }
  document.getElementById("participants").innerHTML='<i class="bi bi-person-circle me-3"></i> ' + (document.getElementById("body").childNodes.length + 1) +'<br/> <span class="fs-6">participants</span>';
}

async function replaceStream(display_me,indicateClose){
  if(!mediaStream){
    if(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)
    try{
      mediaStream =await navigator.mediaDevices.getDisplayMedia({ audio: {
        echoCancellation:false,
        noiseSuppression:false,
        autoGainControl:false,
        latency:0,
      }, video: { width:400,height:350 } });
    }catch(err){
      indicateClose();
    }
    else{
      alert("Media not supported")
    }
  }

  if(mediaStream){
    display_me(mediaStream);

    mediaStream.getVideoTracks().forEach(track=>{
      if(track)VT = track;
      console.log(track)
    })
    mediaStream.getAudioTracks().forEach(track=>{
      if(track)AT = track;
      console.log(track)
    })

    Object.values(peers).map(peer=>{
      peer.peerConnection?.getSenders().map(sender=>{
        if(sender.track.kind == "audio"){
          if(mediaStream.getAudioTracks().length > 0){
            mediaStream.getAudioTracks().forEach(track=>{
              if(track)
              sender.replaceTrack(track);
            })
          }
        }
        if(sender.track.kind == "video"){
          if(mediaStream.getVideoTracks().length > 0){
            mediaStream.getVideoTracks().forEach(track=>{
              if(track)
              sender.replaceTrack(track);
            })
          }
        }

      })
    })
    mediaStream.getVideoTracks()[0].onended=async()=>{
      mediaStream = null;
      VT = streams.getVideoTracks()[0];
      AT = streams.getAudioTracks()[0];
      Object.values(peers).map(peer=>{
        peer.peerConnection?.getSenders().map(sender=>{
          if(sender.track.kind == "audio"){
            if(streams.getAudioTracks().length > 0){
              sender.replaceTrack(streams.getAudioTracks()[0]);
            }
          }
          if(sender.track.kind == "video"){
            if(streams.getVideoTracks().length > 0){
              sender.replaceTrack(streams.getVideoTracks()[0]);
            }
          }

        })
      })
      display_me(streams);
      indicateClose();
    }
  }
}

async function disconnect(input){
  await  database.ref(`${input.room}/disconnect`).set({
        uid:uid
    });
   await database.ref(`${input.room}/join-room`).set("value");
   await database.ref(`${input.room}/disconnect`).set("value");
}

function toggleVideo(){
  if(VT)
  VT.enabled = !VT.enabled;

  if(VT.enabled)nego_offMyVideo=true; else nego_offMyVideo=false;
}
function toogleAudio(){
  if(AT)
  AT.enabled = !AT.enabled;
  if(AT.enabled)nego_offMyAudio=true; else nego_offMyAudio=false;
}
function hangUP(){
  if(!toogleCamera){
    if(mediaStream){
      (mediaStream.getVideoTracks()[0]).stop();
      (mediaStream.getAudioTracks()[0]).stop();
    }
    mediaStream = null;
  }
sessionStorage.clear();
videoList = {};
streamList = [];
memberList = {};
peers = {};
videoPerRow = 0;
VT = null;AT = null;mediaStream = null;
conversation_blocks=[];
if(streams){
  streams.getTracks().forEach((item, i) => {
    item.enabled=true;
    item.stop();
  });

}
if(mediaStream){
  mediaStream.getTracks().forEach((item, i) => {
    item.stop();
  });
}
}

function getRecordScreen(){
  return mediaStream;
}

function updateOnAV(channelMessage,uid){
  if(channelMessage == "audio")
  if(memberList[uid].children[2].children[1].children[0].classList == "bi bi-mic-fill text-primary"){
    memberList[uid].children[2].children[1].children[0].classList = "bi bi-mic-fill text-secondary";

    if(getDeviceType() == "mobile" || getDeviceType() == "tablet")
    videoList[uid].children[1].children[0].children[0].className="col-2 bg-secondary rounded-circle text-center ps-3 opacity-75 text-dark";
    else
    videoList[uid].children[1].children[0].children[0].className="col-2 bg-secondary rounded-circle text-center ps-2 opacity-75 text-dark";
  }
  else{
    memberList[uid].children[2].children[1].children[0].classList = "bi bi-mic-fill text-primary";

    if(getDeviceType() == "mobile" || getDeviceType() == "tablet")
    videoList[uid].children[1].children[0].children[0].className="col-2 bg-secondary rounded-circle text-center ps-3 opacity-75 text-primary";
    else
    videoList[uid].children[1].children[0].children[0].className="col-2 bg-secondary rounded-circle text-center ps-2 opacity-75 text-primary";
   }
  else
  if(memberList[uid].children[2].children[2].children[0].classList == "bi bi-camera-video-fill text-primary"){
    memberList[uid].children[2].children[2].children[0].classList = "bi bi-camera-video-fill text-secondary";
  }
  else{memberList[uid].children[2].children[2].children[0].classList = "bi bi-camera-video-fill text-primary";}
}

function clearRoom(room){
  database.ref(`/${room}`).remove();
  database.ref("/rooms").once("value",(snap)=>{
    const data = snap.val();
    if(data && data.includes(room))
      data.splice(data.indexOf(room),1)
    database.ref("/rooms").set(data);
  })
}
async function fetchRooms(){
  const data =  await database.ref("/rooms").once("value")
  return data.val();
}
function createMeet(input){
  database.ref(`/${input.value}`).set({
    disconnect:"value",
    "join-room":{
      uid:"value",
      username:"value",
      video:"true",
      audio:"true"
    }
  })
  database.ref("/rooms").once("value",(snap)=>{

    const data = snap.val();

    if(data != "value")
    if(!data.includes(input.values))
    data.push(input.value);
    else {
      alert("This Meet Code Is Already Taken...")
    }
    else
    data = [input.value];
    database.ref("/rooms").set(data);
    document.getElementById("create_input").value="";
  })


}

function sortMembers(stream,uid,memberGrid,visualizer,videoGrid){
  if(AudioContext){
    const audioContext = new AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();
    mediaStreamSource.connect(analyser);
    analyser.fftSize = 256;
    drawVisualizer();
    function drawVisualizer() {
      requestAnimationFrame(drawVisualizer)
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)
      const width = visualizer.width
      const height = visualizer.height
      const barWidth = 10

      const canvasContext = visualizer.getContext('2d')
      canvasContext.clearRect(0, 0, width, height)

      let x = 0
      dataArray.forEach((item, index,array) => {
        const y = item / 255 * height*1.1
        if(item>125){
          if(memberList[uid])
          if(memberGrid.children[0] != memberList[uid]){
            memberList[uid].remove();
            videoList[uid].remove();
            videoGrid.insertBefore(videoList[uid],videoGrid.children[0]);
            memberGrid.insertBefore(memberList[uid],memberGrid.children[0])
          }
        }
        canvasContext.strokeStyle = `blue`
        if(index > dataArray.length/2){
          x = x+barWidth
          canvasContext.beginPath();
          canvasContext.lineCap = "round";
          canvasContext.lineWidth = 40;
          canvasContext.moveTo(x, height);
          canvasContext.lineTo(x, height - y);
          canvasContext.stroke();
        }else if(index > dataArray.length/4 && index < dataArray.length/2){
          x = x+barWidth
          canvasContext.beginPath();
          canvasContext.lineCap = "round";
          canvasContext.lineWidth = 50;
          canvasContext.moveTo(x, height);
          canvasContext.lineTo(x, height - y);
          canvasContext.stroke();
        }
      })
    }

  }else{
    alert("Audio Context not supported")
  }
}

async function flipCamera(display_me,indicateClose,audioId){
  if(toogleCamera){
    if(streams){
      (streams.getVideoTracks()[0]).stop();
      (streams.getAudioTracks()[0]).stop();
    }

    if(!mediaStream){
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      try{
        mediaStream =await navigator.mediaDevices.getUserMedia({ audio: {
          deviceId:audioId,
          echoCancellation:false,
          noiseSuppression:false,
          autoGainControl:false,
          latency:0,
        }, video: { width:400,height:350,facingMode: {exact:"environment"}  } }
        );
      }catch(err){
        alert(err)
        indicateClose();
      }
      else{
        alert("Media not supported")
      }
    }

    if(mediaStream){
      display_me(mediaStream);
      VT = mediaStream.getVideoTracks()[0];
      AT = mediaStream.getAudioTracks()[0];

      Object.values(peers).map(peer=>{
        peer.peerConnection?.getSenders().map(sender=>{
          if(sender.track.kind == "audio"){
            if(mediaStream.getAudioTracks().length > 0){
              sender.replaceTrack(mediaStream.getAudioTracks()[0]);
            }
          }
          if(sender.track.kind == "video"){
            if(mediaStream.getVideoTracks().length > 0){
              sender.replaceTrack(mediaStream.getVideoTracks()[0]);
            }
          }

        })
      })

    }
    toogleCamera = false
  }else{
    toogleCamera = true
    if(mediaStream){
      (mediaStream.getVideoTracks()[0]).stop();
      (mediaStream.getAudioTracks()[0]).stop();
    }
    mediaStream = null;

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    navigator.mediaDevices.getUserMedia({audio:{
      deviceId:audioId,
      echoCancellation:false,
      noiseSuppression:false,
      autoGainControl:false,
      latency:0
    },video:{width:400,height:350}}).then(stream=>{
      streams = stream
      VT = streams.getVideoTracks()[0];
      AT = streams.getAudioTracks()[0];
      Object.values(peers).map(peer=>{
        peer.peerConnection?.getSenders().map(sender=>{
          if(sender.track.kind == "audio"){
            if(streams.getAudioTracks().length > 0){
              sender.replaceTrack(streams.getAudioTracks()[0]);
            }
          }
          if(sender.track.kind == "video"){
            if(streams.getVideoTracks().length > 0){
              sender.replaceTrack(streams.getVideoTracks()[0]);
            }
          }
        })
      })
      display_me(streams);
      indicateClose();
    })
  }
}


export default {joinMeet,disconnect,replaceStream,toggleVideo,toogleAudio,hangUP,updateOnAV,clearRoom,fetchRooms,createMeet,getRecordScreen,flipCamera}
