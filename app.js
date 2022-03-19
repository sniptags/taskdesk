const app=require('./index')
const port= process.env.PORT||3000
const User=require('./db/models/user')
const Comment=require('./db/models/comments')

// chat
const cookie=require('cookie')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)
var jwtAuth = require('socketio-jwt-auth');
const { networkInterfaces } = require('os')

io.use(jwtAuth.authenticate({
    secret: process.env.JWT_TOKEN
  }, function(payload, done) {
    // you done callback will not include any payload data now
    // if no token was supplied
    if (payload) {
      User.findOne({_id: payload._id}, function(err, user) {
        if (err) {
          // return error
          return done(err);
        }
        if (!user) {
          // return fail with an error message
          return done(null, false, 'user does not exist');
        }
        // return success with a user info
        return done(null, user);
      });
    } else {
      return done() // in your connection handler user.logged_in will be false
    }
  }));
io.on('connection',(socket)=>{
  var room=''
  const user=socket.request.user
    socket.on('join',(roomName)=>{
      room=roomName
        socket.join(roomName)
        socket.emit('onlineMessage',`${user.name} is online`)
    })
    socket.on('message',async(m)=>{
      let comment= new Comment()
      comment.comment=m
      comment.postedBy=user._id
      comment.task=room
      io.to(room).emit('message',{message:comment.comment,user})
      await comment.save()
    })
})
server.listen(port)