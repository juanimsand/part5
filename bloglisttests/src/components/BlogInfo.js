import React from 'react'
import blogService from '../services/blogs'

const BlogInfo = ({ blog, userLoggedId, likeHandler }) => {
    /*
    const handleLike = async (event) => {
        event.preventDefault()
        try {
            // think a GET should be done for update the likes before increase by one
            await blogService.updateLikes(blog)
        }
        catch (exception) {
            console.log('Could not handleLike cause by: ', exception)
        }
    }
    */
    const handleDelete = async (event) => {
        event.preventDefault()
        try {
            //console.log(blog.id)
            if (window.confirm(`Delete blog ${blog.title} by ${blog.author}`)) {
                await blogService.deleteBlog(blog.id)
            }
        }
        catch (exception) {
            console.log('Could not handleLike cause by: ', exception)
        }
    }

    if (blog.user.id === userLoggedId) {
        return (
            <div>
                <p>{blog.url}</p>
                <p>likes {blog.likes} <button onClick={likeHandler}>like</button></p>
                <p>{blog.author}</p>
                <button onClick={handleDelete}>delete blog</button>
            </div>
        )
    }
    else {
        return (
            <div>
                <p>{blog.url}</p>
                <p>likes {blog.likes} <button onClick={likeHandler}>like</button></p>
                <p>{blog.author}</p>
            </div>
        )
    }
}

export default BlogInfo