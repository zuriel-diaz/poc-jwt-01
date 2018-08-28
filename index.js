const   express     = require('express'),
        bodyParser  = require('body-parser'),
        morgan      = require('morgan'),
        jwt         = require('jsonwebtoken'),
        config      = require('./configuration/config'),
        ProtectedRoutes = express.Router(),
        app         = express();

app.set('Secret', config.secret);

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/api', ProtectedRoutes);

app.listen(3000,()=>{
    console.log('server is running on port 3000');
});

app.get('/', function(req, res){
    res.send('Never give up app is running on http://localhost:3000/');
});

app.post('/authenticate', (req, res) => {
    if(req.body.username==="aymen"){
        if(req.body.password==="12345"){

            const payload = {
                check: true
            };

            var token = jwt.sign(payload, app.get('Secret'), {
                expiresIn: 1440
            });

            res.json({
                message: 'authentication done',
                token: token

            });
        }else{
            res.json({ message: 'Please check your password.' });
        }
    }else{
        res.json({ message: 'User not found!' });
    }
});

ProtectedRoutes.use( (req, res, next) => {
    var token = req.headers['access-token'];

    if(token){
        jwt.verify(token, app.get('Secret'), (err, decoded) => {
            if(err){   
                return res.json({ message: 'invalid token' });
            }else{
                console.log('valid!');
                req.decoded = decoded;
                next();
            }
        });
    }else{
        res.send({ message:'No token provided.' });
    }
});

ProtectedRoutes.get('/getAllProducts',(req,res) => {
    let products = [ {id:1,name:'cheese'},{id:2,name:'carottes'} ];
    res.json(products);
});