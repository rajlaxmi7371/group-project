let prompt=document.querySelector("#prompt")
let chatContainer=document.querySelector(".chat-container")
let imagebtn=document.querySelector("#image")
let image=document.querySelector("#image img")
let imageinput=document.querySelector("#image input")
const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAjT1W5bFVeA6e5EmWRAoMdYthrA9-tQp0"
let user={
    message:null,
    file:{
        mime_type: null,
            data: null
    }
}


function getCustomResponse(message) {
    const lowerCaseMessage = message.toLowerCase();

    const customReplies = [
        {
            keywords: ["Next Step", "what is Next Step", "about Next Step"],
            response: `NEXT STEP is a comprehensive internship tracking platform designed to assist students in managing their applications, deadlines, and progress efficiently in one centralized system.`
        },
        {
            keywords: ["tell summary of website", "summary", "how to apply","features","how can i start","how to use next step","how to start","guide","help with next step"],
            response: `👋 Welcome to NEXT STEP — your internship tracking companion!

🔹 To get started:
1. Register an account if you're new, or log in if you already have one.
2. You'll land on the Home page where you can explore:

• 📌 'Interns' – browse and apply for opportunities.
• 🏢 'Companies' – view organizations offering internships.
• 📚 'Courses' – access skill-based learning materials.
• 🛠️ 'Contact Us' – share issues or feedback.
• 👥 'About Us' – meet the team and understand our mission.

✅ When you're done, you can log out and return to the Index page for an overall summary of the platform.

Let me know if you'd like to explore any section in detail. 😊`
        },
        {
            keywords: ["tell me about courses", "what courses", "courses section", "skill courses","courses"],
            response: `📚 The Courses section offers various learning materials designed to enhance your skills and boost your internship readiness.  
You'll find tutorials and guides related to web development, programming, communication, resume building, and more.`
        },
        {
            keywords: ["what internships", "types of internships", "internship section","interns"],
            response: `📌 In the Internships section, you can explore active internship listings from various companies across different domains, such as Web Development, Data Science, Marketing, and Design.  
      Each listing includes eligibility, duration, and an 'Apply' option for quick access.`
          },
          {
            keywords: ["companies section", "internship companies", "partner companies","companies"],
            response: `🏢 The Companies page showcases organizations currently offering internships.  
      You can view company profiles, see available roles, and learn more about their internship requirements.`
          },
          {
            keywords: ["contact us", "report issue", "feedback", "help"],
            response: `🛠️ If you're facing any issue or have feedback, head to the Contact Us page.  
      You can send your message directly and our team will get back to you as soon as possible.`
          },
          {
            keywords: ["about us", "who made next step", "your team"],
            response: `👥 The About Us page gives insights into the team behind NEXT STEP—passionate developers and mentors committed to helping students succeed in their internship journey.`
          },
         /* {
            keywords: ["Help they help finding internship"],
            response:`🔍 1. Discover Verified Internships

                          * Users can browse a wide range of verified internship listings updated by admins.
                          * Filters like stipend, location, and field of interest help users quickly find relevant opportunities.

                        📝 2. Easy Application Tracking

                              * Users can track their application status in real-time (e.g., Pending, Accepted, Rejected).
                              * Keeps users informed and organized throughout the process.

                        📊 3. Personalized Dashboard

                            * Each user gets a custom dashboard to:
                              * View applied internships.
                              * See internship details and deadlines.
                              * Get alerts for updates and new internships.

                        📚 4. Preparation Resources

                              * Access to curated courses and interview preparation materials uploaded by admins.
                              * Helps users become more confident and well-prepared for internship interviews.

                        🗣️ 5. Feedback & Reviews

                              * Users can share feedback about internships they have done.
                              * Admins highlight the best feedback on the frontend, helping new users pick better internships.

                        📩 6. Email Notifications

                              * Users receive updates via email for:

                                  * New internships.
                                  * Application progress.
                                  * Admin messages or announcements.`
            },*/
          {
            keywords: ["ok"],
            response:`Would u like to know more about something else?`
          }
    ];

    for (let item of customReplies) {
        for (let keyword of item.keywords) {
            if (lowerCaseMessage.includes(keyword.toLowerCase())) {
                return item.response;
            }
        }
    }

    return null;
}



async function generateResponse(aiChatBox){

    let text=aiChatBox.querySelector(".ai-chat-area")
    let RequestOption={
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            "contents": [
                {"parts":[{text: user.message},(user.file.data?[{inline_data:user.file}]:[])

                ]
              }]
             })
    }
    try{
        let response=await fetch(Api_Url,RequestOption)
        let data =await response.json()
        let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)  \*\*/g,"$1").trim()
       text.innerHTML=apiResponse;
    }
    catch(error){
        console.log(error);
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        image.src=`image/img.svg`
          image.classList.remove("choose")
          user.file={}
    }
    
}

function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}


function handlechatResponse(userMessage){
    user.message=userMessage
    let html=`<img src="image/user.png" alt="Transparent" id="userImage" width="10%">
    <div class="user-chat-area">
        ${user.message}
        ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>`: ""}
        </div>`
        prompt.value=""
        let userChatBox=createChatBox(html,"user-chat-box")
        chatContainer.appendChild(userChatBox)

        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

            const customResponse=getCustomResponse(userMessage);
            if(customResponse){

                
        setTimeout(()=>{
            let html=`<img src="image/ai.png" alt="Transparent" id="aiImage" width="10%"> 
            <div class="ai-chat-area">${customResponse}</div>`;
            let aiChatBox=createChatBox(html,"ai-chat-box");
            chatContainer.appendChild(aiChatBox);
        },100);
    }else{
        //if no custom answer,call tthe Gemini API
        setTimeout(()=>{
            let html=`<img src="image/ai.png" alt="Transparent" id="aiImage" width="10%"> 
            <div class="ai-chat-area">
            <img src="image/loading.webp" alt="" class="load" width="50px">
            </div>`
            let aiChatBox=createChatBox(html,"ai-chat-box")
            chatContainer.appendChild(aiChatBox)
            generateResponse(aiChatBox)
        },100);
    }
    }

prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        handlechatResponse(prompt.value)

    }
})
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
            mime_type: file.type,
                data: base64string
        }
        image.src=`data:${user.file.mime_type};base64,${user.file.data}`
      image.classList.add("choose")
    }
    
    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})