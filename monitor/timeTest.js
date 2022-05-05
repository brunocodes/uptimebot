const tZ = [
    'UTC',
    'America/Los_Angeles',
    'America/Vancouver',
    'America/Denver',
    'America/Belize',
    'America/Mexico_City',
    'America/Chicago',    
    'America/Kentucky/Louisville',
    'America/Indiana/Indianapolis',
    'America/New_York',
    'America/Toronto',
    'America/Detroit',
    'America/Puerto_Rico',
    'America/Sao_Paulo',
    'America/Fortaleza',
    'America/Argentina/Buenos_Aires',    
    'Europe/London',
    'Europe/Dublin',
    'Europe/Paris',    
    'Europe/Vienna',
    'Africa/Johannesburg',
    'Asia/Dubai',
    'Australia/Melbourne',
    'Australia/Sydney',
    'Australia/Lindeman',
]
tZ.forEach((timeZone)=> {
    const nDate = new Date().toLocaleString('en-US', {
        timeZone: `${timeZone}`
    });
    console.log(nDate,timeZone);
});
let isoDate = new Date('yourdatehere').toISOString();
// // // // //
const utcString = "2020-12-02T07:05:49.040Z";
let newTime = new Date(utcString).toTimeString();
let newTime2 = new Date(utcString).toLocaleTimeString();
console.log(newTime)
console.log(newTime2)