const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000 ;

app.use(session({secret : 'your-secret-key', resave:true ,saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

const User = require('./users');
passport.use(new LocalStrategy(
    async(username,password, done)=>{
        try{const user = await User.findOne({username});
    if(!user || !user.isValidPassword(password)){
        return done(null,false,{message : 'Invalid username or password'});
    }
    return done(null , user);
    }catch(error){
    return done(error);
    }}
));

passport.serializeUser((user,done)=>{
    done(null , user.id);
});

passport.deserializeUser((id, done)=>{});

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

io.on('connection',(socket)=>{
    console.log('A user connected');
    socket.on('disconnect', ()=>{
        console.log('User disconnected');
    });
});

server.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket)=>{
    console.log('A user connected');

    socket.on('chat message', (msg)=>{
        io.emit('chat message', msg);
    });
    socket.on('disconnect',()=>{
        console.log('User disconnected');
    });
});

app.use(express.static(__dirname));

app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

app.get('/' , (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});