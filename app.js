//sometimes the video stops on its own so to avoid it 
document.addEventListener('click', () => {
    document.querySelectorAll("video").forEach(video => {
        video.play();
    });
}, { once: true });
setTimeout(()=>{document.querySelector('video').play()},1);
setInterval(()=>{document.querySelector('video').play()},5000);


//to store username of the person
let userName="";


//so we will add our new elements to the task div
let addDiv=document.querySelector(".task");
let clickedDiv="";
let taskNo=0;

//to check if my screen is rotated or not
let isRot=false;

//first we make the pop out for the clicked div
let bigBox=document.querySelector("body");
bigBox.addEventListener("click",(event)=>{
    
    if(event.target.classList.contains("tasks")||event.target.classList.contains("inpTask"))
        {clickedDiv=event.target;
            document.querySelector(".todo").classList.add("blurred");
            popUpEdit();}
    else if(event.target.classList.contains("adds"))
    {clickedDiv=event.target;
        document.querySelector(".todo").classList.add("blurred");
        addNewTask();}
    else if(event.target.classList.contains("deletes"))
        {clickedDiv=event.target;
            deleteTask(event.target);}
    else if((event.target.classList.contains("rotateBtn")||(event.target.classList.contains("rotateBtni"))))
    {
        clickedDiv=event.target;
        isRot=!isRot;
        rotateToDo(event.target);}
});

function popUpEdit()
{
//now if my paragraph is clicked then
if(clickedDiv.classList.contains("inpTask"))
clickedDiv=clickedDiv.parentElement;

//now we will insert a small div at that position which will grow
let pop=document.createElement("div");
console.log("ELement created");

//lets give the details to the newly created div
pop=giveDetail(clickedDiv,pop);
pop.classList.add("pop");

//now we will add elements to this newly created div after 1second when the animation is over
setTimeout(()=>{addElement(pop)},1000);
}

function giveDetail(parent,popup)
{
    parent= parent.getBoundingClientRect();
    document.querySelector("body").append(popup);

    popup.style.position="absolute";
    popup.style.left   = parent.left + "px";
    popup.style.top    = parent.top + "px";
    popup.style.width  = parent.width + "px";
    popup.style.height = parent.height + "px";
    return popup;
}

function addElement(newDiv)
{
    console.log("elements added");
    //we have to create a input area and a button
    let inp=document.createElement("textarea");
    console.log(newDiv.children);
    inp.value=clickedDiv.children[0].innerText;
    let btn=document.createElement("button");
    newDiv.insertAdjacentElement("afterbegin",inp);
    newDiv.insertAdjacentElement("beforeend",btn);
    inp.classList.add("afterInp");
    btn.classList.add("afterBtn");
    btn.innerText="Done";
    inp.focus();
    inp.addEventListener("keydown",(event)=>{
        if(event.key==="Enter")
        submit(inp);
    })
    btn.addEventListener("click",()=>{submit(inp)})
}

function submit(inp)
{  
   let val=inp.value.trim();
   if(val=="")return;
   console.log(val);
   clickedDiv.children[0].innerText=val;
   inp.parentElement.remove();
   taskNo++;
   document.querySelector(".todo").classList.remove("blurred");
   addStorage(val.trim());
}

//now lets add a new task 
//for adding a new task it is simple we just have to create a copy of already existing section to which we have to add classes and then we have to toggle submit so that user can the value inside it and it done 
function newTask()
{
    let sec=document.createElement("section");
    let div=document.createElement("div");
    let p=document.createElement("p");
    let btn=document.createElement("button");
    addDiv.append(sec);
    sec.append(div,btn);
    div.append(p);
    sec.classList.add("taskCombo");
    div.classList.add(`task${addDiv.children.length}`);
    div.classList.add("tasks");
    p.classList.add("inpTask");
    btn.classList.add("delete");
    btn.innerHTML='<i class="fa-solid fa-check"></i>';
    btn.children[0].classList.add("deletes");
    if(isRot==true)
        sec.classList.add("changeSec");
    return div;
}

function addNewTask()
{
    clickedDiv=newTask();
    popUpEdit();
}

function deleteTask(btnDlt)
{
    //this is the btn whose parent has to be deleted 
    btnDlt.parentElement.classList.add("btnDlt");
    // console.log(btnDlt.parentElement.previousElementSibling.children[0].innerText);
    btnDlt.parentElement.previousElementSibling.children[0].classList.add("cut");
    btnDlt.parentElement.previousElementSibling.classList.add("smalls");
    console.log(taskStorage[taskStorage.indexOf(btnDlt.parentElement)]);
    const textToDelete = btnDlt.parentElement.previousElementSibling.children[0].innerText.trim();

    // const index = taskStorage.findIndex(task => task && task.trim() === textToDelete);
    // if (index !== -1) {
    //     taskStorage[index] = undefined;
    // }

    //sometimes internally spaces arer added but we cant see so always use trim function
    if (!Array.isArray(taskStorage)) taskStorage = []; 
    taskStorage[taskStorage.indexOf(btnDlt.parentElement.previousElementSibling.children[0].innerText.trim())]=undefined;
    console.log(taskStorage);
    setTimeout(()=>{btnDlt.parentElement.parentElement.remove()},1500);
}

function rotateToDo(press)
{
    if(press.classList.contains("rotateBtni"))
        press=press.parentElement;

    console.log(":class apklie");
    press.classList.toggle("rotateBtn2");
    let todoBg=press.parentElement.parentElement.nextElementSibling.children[1];
    todoBg.classList.toggle("change");
    let allSec=todoBg.children[0].children[0].children;
    todoBg.children[0].children[0].classList.toggle("change2");
    for(let Sec of allSec)
        Sec.classList.toggle("changeSec");
}
document.querySelector("select").addEventListener("change",()=>{font()});
function font()
{
    let sel=document.querySelector("select");
    val=sel.value;
    let cL=document.querySelector(".task").classList;
    console.log(cL);
    for(let c of cL)
        if(c.indexOf("font")==0)
            cL.remove(c);
    cL.add(`font${val}`);
    console.log(cL);
}

//storage
let taskStorage=[];
function addStorage(Val)
{
    taskStorage[taskNo]=Val;
    console.log(taskStorage);
}

window.addEventListener("beforeunload",()=>{makeStore()});

function makeStore()
{
    let newA=[];
    for(let el of taskStorage)
        if(el!=null && el!=undefined && el!="" && el!=' ')
            newA.push(el);
    taskStorage=[...newA];
    localStorage.setItem("myTasks", JSON.stringify(taskStorage));
}

document.addEventListener("DOMContentLoaded",()=>{start()});

function start()
{
    userName = JSON.parse(localStorage.getItem("userName"));
    if(!userName)
        setup();
    else
    {
        document.querySelector(".userName").innerText=`Welcome ${userName}`;
    }

    taskStorage = JSON.parse(localStorage.getItem("myTasks"));
    console.log(taskStorage);
    if (!Array.isArray(taskStorage)) taskStorage = [];


    for (let el of taskStorage)
    {
        taskNo++;
        let sec=document.createElement("section");
        let div=document.createElement("div");
        let p=document.createElement("p");
        let btn=document.createElement("button");
        addDiv.append(sec);
        sec.append(div,btn);
        div.append(p);
        sec.classList.add("taskCombo");
        div.classList.add(`task${addDiv.children.length}`);
        div.classList.add("tasks");
        p.classList.add("inpTask");
        btn.classList.add("delete");
        btn.innerHTML='<i class="fa-solid fa-check"></i>';
        btn.children[0].classList.add("deletes");
        p.innerText=el;
    }
}

setInterval(()=>{picAdd()},100);

function picAdd()
{
    let sel=document.querySelector(".allDone");
    let selS=document.querySelector(".task");
    if(selS.children.length==0)
    {
        sel.classList.add("disIn");
    }
    else
        sel.classList.remove("disIn");
}

function setup()
{
    document.querySelector(".sign").style.display="block";
    let applyTemp=document.querySelector("body").children;
    for(let i=0;i<applyTemp.length-2;i++)
    applyTemp[i].classList.add("blurred");
    document.querySelector(".setup input").addEventListener("keypress",(event)=>{
        if(event.key=="Enter")
        storeName()});
    document.querySelector(".setup button").addEventListener("click",()=>{storeName()});
    document.querySelector(".txts").focus();
}

function storeName()
{
    let val=document.querySelector(".txts").value;
    console.log(val);
    localStorage.setItem("userName", JSON.stringify(val));
    userName=val;
    document.querySelector(".userName").innerText=`Welcome ${userName}`;
    let sel=document.querySelector(".sign");
    sel.classList.add("ended");
    setTimeout(()=>{removeClass()},800);
    setTimeout(()=>{document.querySelector(".sign").style.display="none";});
}

function removeClass()
{
    let lis=document.querySelector("body").children;
    for(let li of lis)
        li.classList.remove("blurred");
}