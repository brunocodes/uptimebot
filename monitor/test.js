const fetch = require('node-fetch');

fetch( "https://google.com" , {
    method: "GET"
})
.then(response => {
    if (response.status === 200) {
        console.log(response);
        //   cb(res.timingPhases.firstByte);
    } else {
        console.log("* Not 200");
    //   cb("OUTAGE");
    }
}).catch(err=>{
    console.log(err)
})