import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import BlogInfo from './BlogInfo'
import Togglable from './Togglable'
import BlogForm from './BlogForm'

test('rendering just title and author', () => {
    const blog = {
        title: 'Testing front-end blog',
        author: 'Juan Imsand',
        url: 'http://testingblogsbyjuan.com',
        likes: 5
    }

    const component = render(
        <Blog blog={blog} />
    )

    const div = component.container.querySelector('.classBlog')
    expect(div).toHaveTextContent(
        'Testing front-end blog Juan Imsand'
    )
    expect(div).not.toHaveTextContent(
        'http://testingblogsbyjuan.com'
    )
    expect(div).not.toHaveTextContent(
        '5'
    )
})

test('clicking the view button for blog info', () => {

    
    const blog = {
        title: 'Testing front-end blog',
        author: 'Juan Imsand',
        url: 'http://testingblogsbyjuan.com',
        likes: 5,
        user: {
            id: 0
        }
    }

    const mockHandler = jest.fn()
    
    const component = render(
        <Togglable buttonLabelForOpen="view" buttonLabelForClose="hide" >
            <BlogInfo blog={blog} userLoggedId="0" likeHandler={mockHandler} />
        </Togglable>
    )
    
    let div = component.container.querySelector('.classTogglable')

    expect(div).toHaveStyle('display: none')

    const button = component.getByText('view')
    fireEvent.click(button)

    div = component.container.querySelector('.classTogglable')
    expect(div).toHaveTextContent(
        'http://testingblogsbyjuan.com'
    )

    expect(div).toHaveTextContent(
        '5'
    )
})

test('clicking twice the like button calls the like event handler twice', () => {
    const blog = {
        title: 'Testing front-end blog',
        author: 'Juan Imsand',
        url: 'http://testingblogsbyjuan.com',
        likes: 5,
        user: {
            id: 0
        }
    }

    const mockHandler = jest.fn()

    const component = render(
        <BlogInfo blog={blog} userLoggedId="0" likeHandler={mockHandler} />
    )

    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('right details when calls onSubmit for create a new blog', () => {
    
    const blog = {
        title: 'Testing front-end blog',
        author: 'Juan Imsand',
        url: 'http://testingblogsbyjuan.com',
        likes: 5,
        user: {
            id: 0
        }
    }
    
    const createBlog = jest.fn()

    const component = render(
        <BlogForm handleNewBlog={createBlog} />
    )

    const inputTitle = component.container.querySelector('#title')
    const inputAuthor = component.container.querySelector('#author')
    const inputUrl = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(inputTitle, {
        target: { value: 'Testing front-end blog' }
    })
    
    fireEvent.change(inputAuthor, {
        target: { value: 'Juan Imsand' }
    })

    fireEvent.change(inputUrl, {
        target: { value: 'http://testingblogsbyjuan.com' }
    })
    
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toBe(blog.title)
    expect(createBlog.mock.calls[0][1]).toBe(blog.author)
    expect(createBlog.mock.calls[0][2]).toBe(blog.url)
})