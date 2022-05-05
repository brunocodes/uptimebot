const utcString = "2020-12-02T07:05:49.040Z";
// let newTime = new Date(utcString).toTimeString();
// let newTime2 = new Date(utcString).toLocaleTimeString();
// console.log(newTime)
// console.log(newTime2)
const utcString = "2020-12-02T07:05:49.040Z";
console.log(new Date(utcString).toTimeString())

console.log(new Date(new Date().getTime()).toLocaleString());