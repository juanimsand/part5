import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ handleNewBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleFormFields = (event) => {
        event.preventDefault()
        handleNewBlog(title, author, url)
        setTitle('')
        setAuthor('')
        setUrl('')
    }
    return (
        <div>
            <h2>Create a new blog</h2>
            <form onSubmit={handleFormFields}>
                <div>
                title
                    <input
                        id="title"
                        type="text"
                        value={title}
                        name="Title"
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                author
                    <input
                        id="author"
                        type="text"
                        value={author}
                        name="Author"
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                url
                    <input
                        id="url"
                        type="text"
                        value={url}
                        name="Url"
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type="submit">create blog</button>
            </form>
        </div>
    )
}

BlogForm.propTypes = {
    handleNewBlog: PropTypes.func.isRequired
}

export default BlogForm