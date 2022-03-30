import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import './App.css';
import api from '../src/api/contacts'
import Header from './components/Header'
import AddContact from './components/AddContact'
import ContactList from './components/ContactList'
import ContactDetail from './components/ContactDetail';
import EditContact from './components/EditContact';
import { BrowserRouter as Routes, Switch, Route, BrowserRouter } from 'react-router-dom';

function App() {
  const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSerchResults] = useState([])

  //RetrieveContacts
  const retrieveContacts = async () => {
    const response = api.get("/contacts");

    return response.data;
  }

  const addContactHandler = async (contact) => {
    const request = {
      id: nanoid(),
      ...contact
    }

    const response = await api.post("/contacts", request)

    setContacts([...contacts, response.data])
  }


  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact);
    const { id, name, email } = response.data;

    setContacts(contacts.map((contact) => {
      return contact.id === id ? { ...response.data } : contact;
    }));
  };

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);

    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(newContactList)
  }

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);

    if (searchTerm !== "") {
      const newContactList = contacts.filter((contact) => {
        return Object.values(contact)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase);
      })
      setSerchResults(newContactList)
    } 
    else {
      setSerchResults(contacts)
    }
  };

  useEffect(() => {
    // const retriveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // retriveContacts ?? setContacts(retriveContacts);
    const getAllContacts = async () => {
      const allContacts = await retrieveContacts();
      if (allContacts) setContacts(allContacts);
    }

    getAllContacts();
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts])

  return (
    <div className='ui container'>
      <BrowserRouter>
        <Routes>
          <Header />
            <Route path="/" exact render={(props) => (<ContactList {...props} contacts={searchTerm.length < 1 ? contacts : searchResults} getContactId={removeContactHandler} term={searchTerm} searchKeyword={searchHandler} />)} />
            <Route path="/add" render={(props) => (<AddContact {...props} addContactHandler={addContactHandler} />)} />
            <Route path="/edit" render={(props) => (<EditContact {...props} updateContactHandler={updateContactHandler} />)} />
            <Route path="/contact/id" component={ContactDetail} />
          {/* <AddContact addContactHandler={addContactHandler}/> */}
          {/* <ContactList contacts={contacts} getContactId={removeContactHandler}/> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
