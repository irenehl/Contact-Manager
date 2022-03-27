import React from 'react';
import './App.css';
import Header from './components/Header'
import AddContact from './components/AddContact'
import ContactList from './components/ContactList'

function App() {
  const contacts = [
    {
      id: 1,
      "name": "Daniela",
      "email": "26irenelopez@gmail.com"
    },
    {
      id: 2,
      "name": "Irene",
      "email": "26danielalopez@gmail.com"
    }
  ];
  
  return (
    <div className='ui container'>
      <Header/>
      <AddContact />
      <ContactList contacts={contacts}/>
    </div>
  )
}

export default App;
