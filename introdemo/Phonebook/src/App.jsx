import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Person from './components/Person'
import { AddedNotification, ChangedNotification } from './components/Notifications'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [addedMessage, setAddedMessage] = useState(null)
  const [changedMessage, setChangedMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const del = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name} ?`)
    if (!confirmDelete) return
  
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => {
        alert(`The person '${name}' was already deleted from server`)
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
            ))
            setNewName('')
            setNewNumber('')
            setChangedMessage(
              `Updated number for '${returnedPerson.name}'`
            )
            setTimeout(() => {
              setChangedMessage(null)
            }, 5000)
          })
          .catch(error => {
            alert(`Information of ${newName} has already been removed from server`)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return
    } 

    const personObject = {
      name: newName,
      number: newNumber,
      id: crypto.randomUUID(),
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons([...persons, returnedPerson])
        setNewName('')
        setNewNumber('')
        setAddedMessage(
          `Added '${returnedPerson.name}'`
        )
        setTimeout(() =>{
          setAddedMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.error('Erro ao adicionar pessoa:', error)
      })
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter(person => 
        person.name.toLowerCase().startsWith(filter.toLowerCase())
      )
    : persons

  return (
    <div>
      <h1>Phonebook</h1>
      <AddedNotification message={addedMessage} />
      <ChangedNotification message={changedMessage} />
      <div>
        filter shown with:
        <input 
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      <h2>Add new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: 
          <input 
            value={newName} 
            onChange={handlePersonChange}
          />
        </div>
        <div>
          number:
          <input 
          value={newNumber}
          onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => (
          <Person 
          key={person.id} 
          person={person} 
          handleDelete={del} 
        />
        ))}
      </ul>
    </div>
  )
}

export default App