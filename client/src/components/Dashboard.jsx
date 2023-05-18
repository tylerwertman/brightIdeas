import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
// import jwtdecode from 'jwt-decode'
import withAuth from './WithAuth'
import { toast } from 'react-toastify';


const Dashboard = (props) => {
    const { count, setCount, user, welcome, darkMode } = props
    const [ideaList, setIdeaList] = useState([])
    const [oneIdea, setOneIdea] = useState({ idea: "" })
    const [errors, setErrors] = useState({})
    const toastAdded = () => toast.success(`➕ You added an idea`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastFav = (id) => toast.success(`👍 You favorited an idea`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastUnfav = (id) => toast.error(`👎 You unfavorited an idea`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });
    const toastDelete = (id) => toast.error(`🗑 You deleted ${id}`, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light"
    });

    useEffect(() => {
        axios.get(`http://localhost:8000/api/ideas`)
            .then(res => {
                setIdeaList(res.data.idea)
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line
    }, [count]);

    const changeHandler = (e) => {
        setOneIdea({
            ...oneIdea,
            [e.target.name]: e.target.value
        })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/ideas', oneIdea, { withCredentials: true })
            .then(res => {
                setIdeaList([...ideaList, res.data.idea])
                toastAdded()
                setOneIdea({
                    idea: "",
                })
                setErrors({
                    idea: "",
                })
            })
            .catch(err => {
                console.log(`submit errer`, err)
                setErrors({
                    idea: err.response.data.error.errors.idea,
                })
                console.log(errors)
            })
    }

    const favoriteIdea = (idea) => {
        axios.post(`http://localhost:8000/api/ideas/${idea._id}/favorite`, {}, { withCredentials: true })
            .then(res => {
                setCount(count + 1)
                toastFav(idea.idea)
            })
            .catch(err => console.log(`FAV error`, err))
    }

    const unfavoriteIdea = (idea) => {
        axios.post(`http://localhost:8000/api/ideas/${idea._id}/unfavorite`, {}, { withCredentials: true })
            .then(res => {
                setCount(count + 1)
                toastUnfav(idea.idea)
            })
            .catch(err => console.log(`UNfav error`, err))
    }

    const removeIdea = (idea) => {
        axios.delete(`http://localhost:8000/api/ideas/${idea._id}`)
            .then(res => {
                setCount(count + 1)
                toastDelete(idea.idea)
            })
            .catch(err => console.log(err))

    }
    return (
        <div>
            <h1 className='mt-5'>Welcome to Bright Ideas</h1>
            <div className={darkMode ? "mainDivDark" : "mainDivLight"}>
                <div className={darkMode ? "col-md-4 offset-1 bg-dark mx-auto text-light" : "col-md-4 offset-1 mx-auto"}>
                    <form className={darkMode ? "mx-auto bg-dark text-light" : "mx-auto"} onSubmit={submitHandler}>
                        {oneIdea.idea && oneIdea.idea?.length < 2 ? <p className="text-danger">Idea must be at least 2 characters</p> : null}
                        {errors.idea ? <p className="text-danger">{errors.idea.message}</p> : null}
                        <div class="input-group">
                            <div class="form-floating">
                                <input type="text" className="form-control" name="idea" value={oneIdea.idea} onChange={changeHandler} placeholder='Add a new idea!' />
                                <label className="darkText" for="idea">Add a new idea!</label>
                            </div>
                            <button type="submit" class="input-group-text btn btn-success" onSubmit={submitHandler}>Add idea!</button>
                        </div>
                    </form>
                </div>
                <div>
                    <h3 className='mt-5'>All Ideas</h3>
                    {/* <table className='mx-auto mb-3'>
                        <thead>
                            <tr>
                                <th className={darkMode ? "lightText" : null}>Title</th>
                                <th className={darkMode ? "lightText" : null}>Author</th>
                                <th className={darkMode ? "lightText" : null}>Added By</th>
                                <th className={darkMode ? "lightText" : null}>Date</th>
                                <th className={darkMode ? "lightText" : null}>Actions</th>
                                </tr>
                        </thead>
                        <tbody> */}
                    {ideaList.map((idea, index) => {
                        return (

                            <div className="mt-4" key={idea._id}>
                                <Link to={`/users/${idea.addedBy._id}`}>@{idea?.addedBy.displayName}</Link><span> says:</span>&nbsp;
                                <span style={{ border: "1px solid", padding: "5px 10px" }}>{idea.idea}</span>&nbsp;
                                { // fav/unfav
                                    ideaList[index].favoritedBy.some(ideaObj => ideaObj._id === user?._id)
                                        ? <><button className="btn btn-outline-danger" onClick={() => unfavoriteIdea(idea)}>✩</button>&nbsp;&nbsp;</>
                                        : <><button className="btn btn-outline-success" onClick={() => favoriteIdea(idea)}>★</button>&nbsp;&nbsp;</>
                                }
                                { // delete if logged in user or 'admin' email user
                                    (welcome === (oneIdea?.addedBy?.firstName + " " + oneIdea?.addedBy?.lastName) || user?.email === "t@w.com") ? <><button className={darkMode ? "btn btn-outline-danger" : "btn btn-outline-dark"} onClick={() => removeIdea(idea)}>🅧</button>&nbsp;&nbsp;</> : null
                                }
                            </div>

                            // <tr className="mt-4" key={idea._id}>
                            //     <td className={darkMode ? "lightText" : null}><><Link to={`/ideas/${idea?._id}`}>{idea?.idea}</Link></></td>
                            //     <td className={darkMode ? "lightText" : null}>{idea.author}</td>
                            //     <td className={darkMode ? "lightText" : null}>{ideaList[index]?.addedBy?._id ? <p className='mb-1'><Link to={`/users/${ideaList[index]?.addedBy?._id}`}>{idea?.addedBy?.firstName} {idea?.addedBy?.lastName}</Link></p> : <p>(added by Deleted User)</p>}</td>
                            //     <td className={darkMode ? "lightText" : null}>{new Date(idea.updatedAt).toLocaleString()}</td>
                            //     <td className={darkMode ? "lightText" : null}>
                            //     </td>
                            // </tr>
                        )
                    })}
                    {/* </tbody>
                    </table> */}
                    <br /><br />
                </div>
            </div>
        </div>
    )
}

export default withAuth(Dashboard)
// export default Dashboard