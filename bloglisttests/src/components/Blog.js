import React from 'react'
import './Blog.css'

const Blog = ({ blog }) => (
    <div className="classBlog">
        {blog.title} {blog.author}
    </div>
)

export default Blog
