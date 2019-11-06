const A=[0,1,1,0]
let count=0
console.log(A)

let half =Number.parseInt(A.length/2)
let length =(A.length)
console.log("half",half)

for(let i=half;i>=0;i--){
    if(A[i]===A[i-1]) {
        A[i-1]=((A[i-1] + 1) % 2)
        count++;
    }
}
for(let i=half;i<length;i++){
    if(A[i]===A[i+1]) {
        A[i+1]=((A[i+1] + 1) % 2)
        count++;
    }
}
console.log(A)

console.log("latest",count)