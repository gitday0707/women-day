const introMessages = [
"Món quà nho nhỏ cho ngày 8/3 🥰",
"Chuẩn bị phát bài hát....",
"Hy vọng em sẽ nghe bài nhạc này",
"Nghe hết bài thì vẫn còn điều khác nữa chờ đợi phía sau",
"Enjoy the music "
]

const endingMessages = [
"Cảm ơn em đã nghe hết bài hát 💗💗",
"Mặc dù cũng sắp hết ngày rồi",
"Nhưng mà đây là món quà nho nhỏ anh làm lúc trông lớp ",
"Dạo này chúng mình cũng có nhiều cãi vã",
"nhưng anh mong chúng mình sẽ bao dung tha thứ những điều nhỏ nhặt cho nhau ❤️‍🩹",
"Chúc mừng tháng thứ 8 yêu nhau",
"Mong rằng chúng mình cùng nhau cố gắng để có thể đón 8 năm hay 80 năm cùng nhau",
"Chúc em một ngày 8/3 vui vẻ và hạnh phúc💞",
"Have a wonderful day 💕",
"Yêu em 😍😍"
]

const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"

/* ---------- GOOGLE VOICE ---------- */
function removeEmoji(text){
  return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
}

async function speak(text){
  
text = removeEmoji(text)
const res = await fetch("https://api.fpt.ai/hmi/tts/v5",{
method:"POST",
headers:{
"api-key":"Z665PjxGpVKUCqPsiq318KHzlfx5IQRi",
"voice":"leminh",
"speed":"0"
},
body:text
})

const data = await res.json()


const audio = new Audio(data.async)

audio.oncanplaythrough = () => {
  audio.play()
}

}

/* ---------- HACKER TEXT ---------- */

function hackerLine(text, element, callback){

let result=""
let i=0

function type(){

if(i >= text.length){

element.innerHTML=result

speak(text)

if(callback) callback()
return
}

let char=text[i]

if(char===" "){
result+=" "
element.innerHTML=result
i++
setTimeout(type,30)
return
}

let scramble=0

let interval=setInterval(()=>{

element.innerHTML=result+letters[Math.floor(Math.random()*letters.length)]

scramble++

if(scramble>5){

clearInterval(interval)

result+=char
element.innerHTML=result

i++

setTimeout(type,30)

}

},20)

}

type()

}

/* ---------- HEART BACKGROUND ---------- */

function createHeart(){

const heart=document.createElement("div")

heart.innerHTML="💖"
heart.className="heart"

heart.style.left=Math.random()*100+"vw"
heart.style.fontSize=(20+Math.random()*30)+"px"
heart.style.animationDuration=(4+Math.random()*4)+"s"

document.body.appendChild(heart)

setTimeout(()=>{
heart.remove()
},8000)

}

setInterval(createHeart,500)

/* ---------- INTRO ---------- */

const introBox=document.getElementById("intro")
const playerBox=document.getElementById("playerBox")
const audio=document.getElementById("audio")
const playBtn=document.getElementById("playBtn")

let introIndex=0

function runIntro(){

if(introIndex>=introMessages.length){

introBox.classList.add("hidden")
playerBox.classList.remove("hidden")

audio.play()

return
}

let line=document.createElement("div")

introBox.appendChild(line)

hackerLine(introMessages[introIndex],line,()=>{

introIndex++

setTimeout(runIntro,800)

})

}

runIntro()

/* ---------- PLAY BUTTON ---------- */

playBtn.onclick=()=>{

if(audio.paused){

audio.play()
playBtn.innerHTML="⏸"

}else{

audio.pause()
playBtn.innerHTML="▶"

}

}

/* ---------- PROGRESS BAR ---------- */

const progressContainer=document.getElementById("progressContainer")

progressContainer.addEventListener("click",(e)=>{

let width=progressContainer.clientWidth
let clickX=e.offsetX

let duration=audio.duration

audio.currentTime=(clickX/width)*duration

})

const progressBar=document.getElementById("progressBar")

audio.addEventListener("timeupdate",()=>{

let percent=(audio.currentTime/audio.duration)*100

progressBar.style.width=percent+"%"

updateLyrics()

})

/* ---------- LYRICS ---------- */

let lyrics=[]
let currentIndex=0

const lyricBox=document.getElementById("lyrics")

function timeToSeconds(time){

let parts=time.split(":")
let sec=parseFloat(parts[2].replace(",","."))
return parseInt(parts[0])*3600+parseInt(parts[1])*60+sec

}

fetch("song.srt")
.then(res=>res.text())
.then(text=>{

let blocks=text.trim().split(/\n\n+/)

blocks.forEach(block=>{

let lines=block.split("\n")

if(lines.length>=3){

let timeLine=lines[1]
let lyricText=lines.slice(2).join(" ")

let start=timeLine.split(" --> ")[0]

lyrics.push({
time:timeToSeconds(start),
text:lyricText
})

}

})

})

function updateLyrics(){

let current=audio.currentTime

if(currentIndex>=lyrics.length) return

if(current>=lyrics[currentIndex].time){

let div=document.createElement("div")

div.className="line active"

div.innerText=lyrics[currentIndex].text

let prev=document.querySelector(".line.active")

if(prev){

prev.classList.remove("active")
prev.classList.add("past")

}

lyricBox.appendChild(div)

lyricBox.scrollTop=lyricBox.scrollHeight

currentIndex++

}

}

/* ---------- ENDING ---------- */

const endingBox=document.getElementById("ending")

audio.onended=()=>{

playerBox.classList.add("hidden")

let i=0

function show(){

if(i>=endingMessages.length) return

let line=document.createElement("div")

endingBox.appendChild(line)

hackerLine(endingMessages[i],line,()=>{

i++

setTimeout(show,800)

})

}

show()

}
