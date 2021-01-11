import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Mensaje from './components/Mensaje'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import BlogInfo from './components/BlogInfo'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [userId, setUserId] = useState(null)
    const [mensaje, setMensaje] = useState(null)
    const [msjEstado, setMsjEstado] = useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs => {
            sortBlogs(blogs)
            setBlogs(blogs)
        })
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const userLogged = JSON.parse(loggedUserJSON)
            console.log(userLogged.username)
            setUser(userLogged.username)
            setUserId(userLogged.id)
            blogService.setToken(userLogged.token)
        }
    }, [])

    const BlogFormRef = useRef()
    const BlogInfoRef = useRef()

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const userLog = await loginService.login({
                username, password,
            })
            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(userLog)
            )
            blogService.setToken(userLog.token)
            setUser(userLog.username)
            setUserId(userLog.id)
            setUsername('')
            setPassword('')
            setMsjEstado('p')
            setMensaje('Logged in')
            setTimeout(() => {
                setMensaje(null)
                setMsjEstado(null)
            }, 5000)
        } catch (exception) {
            setMsjEstado('n')
            setMensaje('Wrong credentials')
            setTimeout(() => {
                setMensaje(null)
                setMsjEstado(null)
            }, 5000)
        }
    }

    const handleNewBlog = async (title, author, url) => {
        try {
            const newBlog = await blogService.createBlog({
                title, author, url
            })
            const updatedBlogs = await blogService.getAll()
            sortBlogs(updatedBlogs)
            console.log(updatedBlogs)
            setBlogs(updatedBlogs)
            BlogFormRef.current.toggleVisibility()
            setMsjEstado('p')
            setMensaje(`A new blog ${newBlog.title} by ${newBlog.author} added`)
            setTimeout(() => {
                setMensaje(null)
                setMsjEstado(null)
            }, 5000)
        } catch (exception) {
            setMsjEstado('n')
            setMensaje('Cannot create blog')
            setTimeout(() => {
                setMensaje(null)
                setMsjEstado(null)
            }, 5000)
        }
    }

    const handleLogout = async (event) => {
        event.preventDefault()
        try {
            window.localStorage.removeItem('loggedBlogappUser')
            blogService.deleteToken()
            setUser(null)
            setUserId(null)
            setMsjEstado('p')
            setMensaje('Logout successfully')
            setTimeout(() => {
                setMensaje(null)
                setMsjEstado(null)
            }, 5000)
        }
        catch (exception) {
            setMsjEstado('n')
            setMensaje('Could not logout')
            setTimeout(() => {
                setMensaje(null)
                setMsjEstado(null)
            }, 5000)
        }
    }

    const handleLike = async (blog) => {
        //event.preventDefault()
        try {
            // think a GET should be done for update the likes before increase by one
            await blogService.updateLikes(blog)
        }
        catch (exception) {
            console.log('Could not handleLike cause by: ', exception)
        }
    }

    const sortBlogs = (blogs) => {
        blogs.sort((a, b) => {
            return b.likes - a.likes
        })
    }
    const loginForm = () => (
        <div>
            <h2>Log in to application</h2>
            <div>
                <Mensaje msj={mensaje} msjestado={msjEstado} />
            </div>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
    const blogsShown = () => (
        <div>
            <h2>Blogs</h2>
            <div>{user} logged in <button onClick={handleLogout}>logout</button></div>
            <div>
                <Mensaje msj={mensaje} msjestado={msjEstado} />
            </div>
            <Togglable buttonLabelForOpen="new blog" buttonLabelForClose="cancel" ref={BlogFormRef} >
                <BlogForm handleNewBlog={handleNewBlog} />
            </Togglable>
            {blogs.map(blog => (
                <div key={blog.id}>
                    <Blog key={blog.id} blog={blog} />
                    <Togglable buttonLabelForOpen="view" buttonLabelForClose="hide" ref={BlogInfoRef} >
                        <BlogInfo blog={blog} userLoggedId={userId} likeHandler={handleLike} />

                    </Togglable>
                </div>
            ))}
        </div>
    )
    return (
        <div>
            {user === null && loginForm()}
            {user !== null && blogsShown()}
        </div>
    )
}

export default App