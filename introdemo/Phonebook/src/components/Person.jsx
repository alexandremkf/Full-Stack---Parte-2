const Person = ({ person, handleDelete }) => {
    return (
      <li>
        {person.name} {person.number}
        <button onClick={() => handleDelete(person.id, person.name)}>del</button>
      </li>
    )
  }
  
export default Person  