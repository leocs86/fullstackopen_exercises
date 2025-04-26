const express = require('express')
const morgan = require('morgan')
const Person = require('./models/Person')

const app = express()
app.use(express.static('dist'))
app.use(express.json())

morgan.token('data', (req, _res) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :data'
  )
)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1><p>Phonebook Backend</p>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((resp) => {
      response.json(resp)
    })
    .catch((err) => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      //null or person
      if (!person) {
        return response
          .status(404)
          .json({ error: 'person doesn\'t exist' })
      }
      response.json(person)
    })
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((resp) => {
      if (!resp) {
        //person is not in the DB
        return response
          .status(404)
          .json({ error: 'person doesn\'t exist' })
      }
      response.status(204).end()
    })
    .catch((err) => next(err))
})

app.post('/api/persons', (request, response, next) => {
  console.log('post')
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({ error: 'content missing' })
  }

  Person.exists({ name: request.body.name })
    .then((resp) => {
      //check if person exists -> true
      if (resp) {
        return response
          .status(409)
          .json({ error: 'person.name already exists' })
      } else {
        const person = new Person({
          name: request.body.name,
          number: request.body.number,
        })

        return person
          .save()
          .then((result) => {
            response.status(201).json(result)
          })
          .catch((err) => next(err))
      }
    })
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response
          .status(404)
          .json({ error: 'person doesn\'t exist' })
      }
      person.number = request.body.number
      return person
        .save()
        .then((resp) => {
          response.json(resp)
        })
        .catch((err) => next(err))
    })
    .catch((err) => next(err))
})

app.get('/info', (request, response, next) => {
  const now = new Date()
  Person.countDocuments()
    .then((result) => {
      response.send(
        `<p>Phonebook has info for ${result} persons</p><p>${now.toString()}</p>`
      )
    })
    .catch((err) => next(err))
})

const errorHandler = (error, request, response, next) => {
  console.log('[!] errorHandler', error.name)
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
