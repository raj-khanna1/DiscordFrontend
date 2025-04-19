const baseUrl='https://discordbackedrender.onrender.com';
const authors=document.getElementById('authors');
const queryStr=new URLSearchParams(window.location.search);// giving the query string
const username=queryStr.get('username');
const name=queryStr.get('name');


function joinRoom2(roomname){
  // passing it to the autors blog page
  window.location.href=`../roomPage/room.html?roomname=${encodeURIComponent(roomname)}&username=${encodeURIComponent(username)}&name=${encodeURIComponent(name)}`;
}






// Create tile dynamically
function createRoomTile(roomname) {
  console.log("romname= ",roomname);
  const tile = document.createElement("div");
  tile.className = "room-tile";
  tile.id=`${roomname}`;
  tile.innerHTML = `
    <img class="room-logo" src="${'https://i.pinimg.com/736x/aa/dd/92/aadd9228d3c28caabf28cecc04fe7a2d.jpg'}" alt="Room logo" />
    <div class="creator-name">${roomname}</div>
    <button class="join-btn" onclick="joinRoom2('${roomname}')">Join Room</button>
  `;

  document.getElementById("room-container").appendChild(tile);

}

fetch(`${baseUrl}/api/v1/authUser`, {
    method: 'POST',
    credentials: 'include',  // ✅ this is crucial
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json()) 
  .then(responseData => { 
      // console.log("API Response:", responseData);

      const rooms = responseData.data.rooms;
      // console.log("data= ",responseData);
      // console.log("data2= ",responseData.data);
      // console.log("data= ",responseData.data.rooms);
      if (!rooms || rooms.length === 0 ) {
          document.getElementById("backimg").src = "default.jpg"; 
      } else {
          // creating the outer div 
          for(let i=0;i<rooms.length;i++){
            createRoomTile(rooms[i]);
          }
          
      }
  })
  .catch(error => {
      console.error("Profile images not fetched properly:", error.message);
  });



// ---------------------
    const signupBtn = document.getElementById('signupBtn');
    const joinBtn = document.getElementById('joinBtn');
    const modal = document.getElementById('signupModal');
    const modal2 = document.getElementById('joinModal');
    
    signupBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
    joinBtn.addEventListener('click', () => {
      modal2.style.display = 'flex';
    });
    
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal2) {
        modal2.style.display = 'none';
      }
    });
    
    function submitRoom() {
      const roomName = document.getElementById('roomName').value;
      const roomPassword = document.getElementById('roomPassword').value;
      const roomKaNaam = document.getElementById('roomKaNaam').value;
    
      console.log('Room Created:', roomName, roomPassword);
    
      // sending the request to the backend
      const response=fetch(`${baseUrl}/api/v1/createRoom`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',  
          body: JSON.stringify({
            roomname: roomName,
            password: roomPassword,
            creator:username,
            name:roomKaNaam
          })
      });

      response.then(async (value)=>{
        const data= await value.json();
        return data; 
      })
      .then((value)=>{
         if(value.success){
          // console.log("kya re Duniya hila di tune to BOSS!");
          alert("Room Created");
          createRoomTile(value.data.name);
         }
      })
      .catch(error => {
        console.error("error can't create rom", error);
        alert("error can't create room chk console");
    });
    
      modal.style.display = 'none';
    }
    
// code for joing room
function joinRoom() {
  const roomName = document.getElementById('roomName2').value;
  const roomPassword = document.getElementById('roomPassword2').value;

  // console.log('Room Created:', roomName, roomPassword);

  // sending the request to the backend
  const response=fetch(`${baseUrl}/api/v1/updateUserRoom`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',  
      body: JSON.stringify({
        roomname: roomName,
        password: roomPassword
      })
  });

  response.then(async (value)=>{
    const data= await value.json();
    return data; 
  })
  .then((value)=>{
     if(value.success){
      alert("Room Joined");
      // console.log("value while room= ",value);
      createRoomTile(roomName);
     }
     else {
      alert("Can't Join Room Incorrect Credentials");
     }
  })
  .catch(error => {
    console.error("Error can't Join rom", error);
});

  modal.style.display = 'none';
}