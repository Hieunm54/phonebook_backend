const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json()) // middleware build-in

//tu dinh nghia token moi ten body
morgan.token('body', (request) => { // body chinh la ten thuoc tinh can in ra,no tra ve gtri JSON.Stringify
    //console.log('helloo ',request.body)
    return JSON.stringify(request.body);
})
//dung new morgan logger duoc dinh nghia san cac kieu tra ve
app.use(morgan(':method :url :status :body :response-time')) // nhet body vao day
// build tokens

//using my own middleware
const requestLogger = (request,response,next) =>{
    console.log("method: ",request.method)
    console.log("path: ",request.path)
    console.log("body: ",request.body)
    console.log('-----------------')
    next(); // phai co next neu ko se bi tac
}


app.use(requestLogger)


let persons = 
[
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 1
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 2
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 3
      }
]

//middleware for catching request made to unknown routes 
const unknownRoute = (request,response) =>{
    response.status(404).send({error:'unknown endpoint'})
}

//http get - safety and idempotence

app.get('/api/persons',(request,response) =>{
    response.json(persons);
})


app.get('/info',(request,response) =>{
    //console.log();
    response.send(`Phonebook has info of ${persons.length} people <br> ${new Date()}`)
  
})

app.get('/api/persons/:id',(request,response) =>{
    const id = Number(request.params.id); // dang tra ve cua param la string => phai ep kieu
    const returnPerson = persons.find(person => person.id === id);
    if(!returnPerson){
        console.log('ID Not found');
        return response.status(404).end();
    }
    console.log('matched id: ',id);
    response.json(returnPerson);
})


//post new person
// neither safety nor idempotence 


app.post('/api/persons',(request,response) =>{
    const body = request.body;
    const newPerson = {
        name : body.name,
        number: body.number,
        id: Math.random()*(10000)
    }
    if(!newPerson.name || !newPerson.number){
        return response.status(400 ).json({
            error : 'invalid person'
        })
    }
    const invalidName = persons.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase());
    if(invalidName){
        return response.status(400).json({
            error : 'name must be unique. Mind the case'
        })
    }
    //console.log('new person: ',newPerson);

    persons = persons.concat(newPerson);
    response.json(newPerson);
})



//delete person
app.delete('/api/persons/:id',(request,response) =>{
    const id = Number(request.params.id);
    console.log('delete id: ',id);
    persons = persons.filter(person => person.id !== id);
    
    response.status(204).end()
})

app.use(unknownRoute);


const PORT = process.env.PORT || 3001
app.listen(PORT,() =>{
    console.log(`app is running at Port: ${PORT}`);
})
