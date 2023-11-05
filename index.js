const express = require('express')
const app = express()
const morgan = require('morgan')

const url = 'mongodb+srv:fernandojhernandez123:<IBxCd8FqskO0o4xR>@fullstackopen-part3c-cl.loaztib.mongodb.net/?retryWrites=true&w=majority'

app.use(express.json())

morgan.token('morganMessage', function (request, response) {
    console.log("morganMessage", request.body)
    return `${JSON.stringify(request.body)}`
})

app.use(morgan(':method :url :status :response-time :req[header] :morganMessage'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
////////exercise 3.2 completed with the five lines of code below!!!! whoo!
app.get('/info', (request, response) => {
    const date = new Date()
    const numPeople = persons.length
    response.send(`Phonebook has info for ${numPeople} <br> ${date}`)
})

//the get below shows all the elements in the persons array. 
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

//exercise 3.3 completed below
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)


    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

//exercise 3.4 completed below

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

//exercise 3.5 completed below
const generateId = () => {
    // const maxId = persons.length > 0
    //     ? Math.max(...persons.map(n => n.id))
    //     : 0
    // return maxId + 1
    const personId = Math.floor(Math.random() * 100)
    return personId
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number || false

    }
    //exercise 3.6 completed below
    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }



    persons = persons.concat(person)

    response.json(persons)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)
