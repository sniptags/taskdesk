const $signupButton= document.getElementById('signupButton')
const $email= document.getElementById('email')
const $password= document.getElementById('password')
const $name=document.getElementById('name')
$signupButton.addEventListener('click',(e)=>{
    const validData=document.getElementById('signupForm').checkValidity()
    if(!validData)
        return 
    e.preventDefault()
    const data=JSON.stringify({
        name:$name.value,
        email:$email.value,
        password:$password.value
    })
    $.ajax({
        url:'/user',
        type:'post',
        data:data,
        dataType: "json",
        contentType: "application/json",
        error:(e)=>{
            if(e)
                return alert('please provide valid data')
        },
        success: (result)=>{
            window.location.href='/user/profile'
        }
    })
})