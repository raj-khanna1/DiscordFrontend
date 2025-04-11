const submit_btn=document.getElementById('submit_div');
const baseUrl='https://discordbackedrender.onrender.com';

submit_btn.addEventListener('click',async ()=>{
    const username=document.getElementById('username').value;
    const password=document.getElementById('password').value;
    const data={
        username: username,
        password: password
    };
    console.log(`username = ${username}`);

    const url='/api/v1/authUser';
    const result = fetch(`${baseUrl}${url}`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    credentials: 'include', // ✅ Add this line!
    body: JSON.stringify(data)
});
    result.then(async (value) => {value= await value.json();return  value;}) // ✅ Return the parsed JSON
.then((data) => {
    console.log("returned data = ", data);
    if(data.success){
        console.log("Loged in");
        window.location.href=`../roomsPage/rooms.html?username=${encodeURIComponent(data.data.username)}&name=${encodeURIComponent(data.data.name)}`;
    }
})
.catch((error) => {
    console.log("error = ", error);
});


});


const signupBtn = document.getElementById('signupBtn');
    const modal = document.getElementById('signupModal');
    
    signupBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
    
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });



    function submitUser() {
        const username = document.getElementById('username2').value;
        const password = document.getElementById('password2').value;
        const name = document.getElementById('name').value;
      
        console.log('user going for creating:', username, password);
      
        // sending the request to the backend
        const response=fetch(`${baseUrl}/api/v1/createUser`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',  
            body: JSON.stringify({
                username: username,
              password: password,
              name:name,
              rooms:[]
            })
        });
  
        response.then(async (value)=>{
          const data= await value.json();
          return data; 
        })
        .then((value)=>{
           if(value.success){
                console.log("User Created ,PLZ LOGIN");
           }
           else {
            console.log(value.message);
           }
        })
        .catch(error => {
          console.error("error can't create rom", error);
      });
      
        modal.style.display = 'none';
      }