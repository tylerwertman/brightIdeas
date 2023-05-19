import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import withAuth from './WithAuth'


const IdeaDetail = (props) => {
    const { darkMode } = props
    const { id } = useParams()
    const navigate = useNavigate();
    const [oneUser, setOneUser] = useState({})
    // const ideaFavByContainsLoggedInUser = oneUser.favoritedBy ? oneUser.favoritedBy.some(ideaObj => ideaObj._id === user._id) : false;


    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/${id}`)
            .then(res => {
                setOneUser(res.data.user)
            })
            .catch(err => console.log(err))

        // eslint-disable-next-line
    }, []);

    return (
        <div className='text-start col-8 offset-2'>
            <br />
            <h1 className='text-start mt-5'>User Details</h1>

            <button className="btn btn-primary" onClick={() => (navigate('/dashboard'))}>Home</button>&nbsp;&nbsp;

            <h3>Name: {oneUser?.name}</h3>
            <h3>Display Name: @{oneUser?.displayName}</h3>
            <hr />
            <h5 style={{textDecoration:"underline"}}>@{oneUser.displayName} posted {oneUser.ideasAdded?.length} ideas</h5>
            {oneUser.ideasAdded?.map((ideasAdded, i) => {
                return (
                    <div key={ideasAdded._id}>
                        <p className={darkMode ? "lightText" : null}>•({ideasAdded.favoritedBy?.length} {ideasAdded.favoritedBy?.length === 1 ? "Like" : "Likes"}) {ideasAdded.idea}</p>
                    </div>
                )
            })}
            <br />
            <h5 style={{textDecoration:"underline"}}>@{oneUser.displayName} liked {oneUser.ideasFavorited?.length} ideas</h5>
            {oneUser.ideasFavorited?.map((ideasFaved, i) => {
                return (
                    <div key={ideasFaved._id}>
                        <p className={darkMode ? "lightText" : null}>•({ideasFaved.favoritedBy?.length} {ideasFaved.favoritedBy?.length === 1 ? "Like" : "Likes"}) {ideasFaved.idea}</p>
                    </div>
                )
            })}
            <br /><br />
        </div>
    )
}

export default withAuth(IdeaDetail)