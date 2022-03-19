const $signinButton= document.getElementById('signinButton')
const $email= document.getElementById('email')
const $password= document.getElementById('password')


$signinButton.addEventListener('click',(e)=>{
    const validData=document.getElementById('signinForm').checkValidity()
    if(!validData)
        return 
    e.preventDefault()
    const data=JSON.stringify({
        email:$email.value,
        password:$password.value
    })
    $.ajax({
        url:'/user/login',
        type:'post',
        data:data,
        dataType: "json",
        contentType: "application/json",
        error:(e)=>{
            if(e)
                console.log(e)
                return alert('Authentication Failed')
        },
        success: (res)=>{
                window.location.href='/user/profile'
        }
    })
})