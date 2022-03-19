const socket=io({query: `auth_token=${document.cookie.slice(14)}`})
const $comment= document.getElementById('comments')
let $messageTemplate=document.getElementById('messageTemplate').innerHTML
const $message=document.getElementById('input-message')
const $form=document.getElementById('messageForm')
const $modalBody=document.getElementById('modalBody')

let roomId=''
$('#modalComments').on('show.bs.modal', (e)=>{
    activeLoader()
    room=$(e.relatedTarget).attr('data-id')
    if(room===roomId){
        return
    }
    roomId==room
    $comment.innerHTML=''
    $.ajax({
        url:`/task/comment/${room}`,
        method:'get',
        async:false,
        success:(data)=>{
            data.forEach((m)=>{
                const imageUrl=`user/avatar/${m.postedBy._id}`
                $comment.innerHTML+=Mustache.render($messageTemplate,{name:m.postedBy.name,image:imageUrl, message: m.comment, date:new Date(m.createdAt).toLocaleString('en-US') })
            })
        },
        error:(e)=>{
            console.log(e)
        }
    })
    console.log($modalBody.scrollHeight)
    deactiveLoader()
    socket.emit('join',room)
})
socket.on('message',(m)=>{
    const imageUrl=`user/avatar/${m.user._id}`
    $comment.innerHTML+=Mustache.render($messageTemplate, {name:m.user.name,image:imageUrl, message: m.message, date:new Date(Date.now()).toLocaleString('en-US') })
    $modalBody.scrollTop=$modalBody.scrollHeight
})

$form.addEventListener('submit',(e)=>{
    e.preventDefault()
    if($message.value=='')
        return
    socket.emit('message',$message.value)
    $message.value=''
    $message.focus()
})