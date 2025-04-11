// page ke load hote samay hi hum messages ko fetch kar lenge!
const queryStr=new URLSearchParams(window.location.search);// giving the query string
const roomname=queryStr.get('roomname');
const username=queryStr.get('username');
const name1=queryStr.get('name');
const baseUrl='http://127.0.0.1:8000';

const inputBox=document.getElementById('inputBox');
const sendBtn=document.getElementById('send');

const socket = io(baseUrl);
let mainDiv=document.getElementById('mainDiv');

socket.on("chat", (data) => {
    console.log(`${data.from}: ${data.msg}`);
    createMessageBubble(data.from,data.msg,data.crntTime);
});

socket.on("response",(data)=>{
    console.log(data);
});


// we will only build the socket connection to the room if the user has valid token and valid url with respect to it.
const socketConnecResponse=fetch(`${baseUrl}/api/v1/authUserForSokcet`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',  
    body: JSON.stringify({
      roomname: roomname,
      sendedUsername:username
    })
});

socketConnecResponse.then(async (value)=>{
    const data= await value.json();
    return data; 
  })
  .then(async (value)=>{
    if(value.success){
        console.log("val= ",value);
    //   once the user is verified , than we will connect it to the room, bcoz agar hum aesa nahi karte to , to humare
    // pass aek hi option bachta or wo hai, har bar connection establish karna jab bhi message db mein store hoke succes -> true de
    // lekin ya na karke humne page load hote hi uer verified kar liya, or connection build kar liya
        return socket.emit("join-room", roomname);

    }
  })
  .catch(error => {
    console.error("Some Err while Verifying userr for Scoket Connection", error);
  });














async function fetchUsername(id){

    const response=await fetch(`${baseUrl}/api/v1/getUserById`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',  
        body: JSON.stringify({
          id:id
        })
    });
    
    const result=await response.json();
    if(result.success){
      console.log("UserName Fetched!");
      return result.data.name;    
    }

    else{
        return undefined;
      };

}


const response=fetch(`${baseUrl}/api/v1/getMsg`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',  
    body: JSON.stringify({
      roomname: roomname,
      sendedUsername:username
    })
});

  response.then(async (value)=>{
    const data= await value.json();
    return data; 
  })
  .then(async (value)=>{
    if(value.success){
      console.log("kya re Duniya hila di tune to BOSS! ");
        
        console.log("roomname= ",roomname);
        console.log("username= ",username);
        console.log("value= ",value);
        // now traversing the array
        for(let i=0;i<value.data.length;i++){
            let cUserId=value.data[i].sender;// cuser= crnt user
            // fetching the username from userId
            let cname=await fetchUsername(cUserId);
            let cMsg=value.data[i].message;
            let cUt=value.data[i].updatedAt;
            console.log("timre= ",cUt);
            createMessageBubble(cname,cMsg,cUt);
        }

    }
  })
  .catch(error => {
    console.error("Msg Can't be fetched due to some problem bhaiya", error);
  });


//   adding the functionalities relaed to sending the msg
sendBtn.addEventListener('click',()=>{
    let msg=inputBox.value;
    if(msg.length>0){
        // now we will send the request to the backend for saving the msg
        // but Raj we also have to manage a CASE , in which user is valid bcoz of his token but in the url he explicitly sended the username as some other user , due to which the msg will be not in the name of the sender but it will be saved with the url's username, so we mhave to manage this case into out backend .
        // THAT user must have a valid token and token's username is same as the link's user name and the user should have the room joined.

        // so in the post request we will be sending a 'sendedUsername' member with value of the url username

        const response=fetch(`${baseUrl}/api/v1/createMsg`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',  
            body: JSON.stringify({
              roomname: roomname,
              sendedUsername:username,
              message:msg
            })
        });
        
          response.then(async (value)=>{
            const data= await value.json();
            return data; 
          })
          .then((value)=>{
            if(value.success){
              console.log("Messaage Created BOSS! ");
            //   once the msg is create broadcast to all
            const currentTime = new Date();
                socket.emit("chat", {
                    room: roomname,
                    msg: value.data.message,
                    name:name1,
                    crntTime:currentTime
                });
                createMessageBubble(name1,value.data.message,currentTime);
            
            }
          })
          .catch(error => {
            console.error("Msg Can't be Created bhaiya", error);
          });
        
    }
});

function createMessageBubble( from, msg,time ) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    if (from === name1) {
        messageDiv.classList.add('sender');
    } else {
        messageDiv.classList.add('receiver');
    }

    messageDiv.innerHTML = `
        <strong>${from}</strong>
        <div>${msg}</div>
        <div class="meta">${new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;

    mainDiv.appendChild(messageDiv);
    mainDiv.scrollTop = mainDiv.scrollHeight;
}
