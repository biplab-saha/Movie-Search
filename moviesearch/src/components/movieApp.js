import React, { useState } from 'react'
import './movieApp.css'
import { AiOutlineSearch } from "react-icons/ai";
import axios from 'axios';
export default function () {
  const [searchQuery, setSearchQuery] = useState('')
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  }
  const handleSearchSubmit = async () => {
    const response  = await axios.get(
        'https://api.themoviedb.org/3/search/movie', 
    )
  }
  return (
    <div>
        <h1>MovieHome</h1>
        <div className='search-bar'>
            <input type='text' placeholder='Search Movie....' value={searchQuery} onChange={handleSearchChange} className='search-input'></input>
            <button onClick={handleSearchSubmit} className='search-button'>
              <AiOutlineSearch />
            </button>
        </div>
    </div>
  )
}
