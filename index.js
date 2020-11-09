const express = require('express')
const app = express()

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
app.use(express.json())
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
    console.log('new person: ',newPerson);

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



const PORT = 3001
app.listen(PORT,() =>{
    console.log(`app is running at Port: ${PORT}`);
})
