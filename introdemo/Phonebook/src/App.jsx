import { useState, useEffect } from 'react'
import personService from './services/persons'
import Person from './components/Person'
import Notification from './components/Notifications'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const del = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name} ?`)
    if (!confirmDelete) return

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        showNotification(`Deleted '${name}'`, 'success')
      })
      .catch(error => {
        showNotification(`The person '${name}' was already deleted from server`, 'error')
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
            showNotification(`Updated number for '${returnedPerson.name}'`, 'success')
          })
          .catch(error => {
            showNotification(`Information of ${newName} has already been removed from server`, 'error')
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
        showNotification(`Added '${returnedPerson.name}'`, 'success')
      })
      .catch(error => {
        console.error('Erro ao adicionar pessoa:', error)
        showNotification('Failed to add person', 'error')
      })
  }

  const handlePersonChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().startsWith(filter.toLowerCase())
      )
    : persons

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification?.message} type={notification?.type} />

      <div>
        Filter shown with:
        <input 
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      <h2>Add new</h2>
      <form onSubmit={addPerson}>
        <div>
          Name:
          <input 
            value={newName} 
            onChange={handlePersonChange}
          />
        </div>
        <div>
          Number:
          <input 
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">Add</button>
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