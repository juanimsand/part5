describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Juan Imsand',
            username: 'jimsand',
            password: 'secreta'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        const user2 = {
            name: 'Diego Maradona',
            username: 'eldiego10',
            password: 'laclaudia'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user2)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        cy.contains('login')
    })

    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.contains('login')
            cy.get('#username').type('jimsand')
            cy.get('#password').type('secreta')
            cy.get('#login-button').click()

            cy.contains('Logged in')
        })

        it('fails with wrong credentials', function () {
            cy.contains('login')
            cy.get('#username').type('jimsand')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()

            cy.get('.classMensajeNeg').should('contain', 'Wrong credentials')
            cy.get('.classMensajeNeg').should('have.css', 'background-color', 'rgb(255, 0, 0)')
        })
    })

    describe.only('When logged in', function () {
        beforeEach(function () {
            cy.login({ username: 'jimsand', password: 'secreta' })
        })

        it('A blog can be created', function () {
            cy.contains('new blog').click()
            cy.get('#title').type('a blog created by cypress')
            cy.get('#author').type('Cypress')
            cy.get('#url').type('http://cypresscreatedablog.com')
            cy.contains('create blog').click()

            cy.contains('A new blog a blog created by cypress by Cypress added')
        })

        it('A blog can be liked', function () {
            // I need to create a blog before liking it
            cy.createBlog({ title: 'a blog created by cypress', author: 'Cypress', url: 'http://cypresscreatedablog.com' })
            // Now I could like it
            cy.contains('view').click()
            cy.contains('like').click()
        })

        it('A blog can be deleted by the user who created it', function () {
            // I need to create a blog before deleting it
            cy.createBlog({ title: 'a blog created by cypress', author: 'Cypress', url: 'http://cypresscreatedablog.com' })
            // Now I could delete it
            cy.contains('view').click()
            cy.contains('delete blog').click()

        })

        it('A blog cannot be deleted by a user who did not create it', function () {
            // I need to create a blog before deleting it
            cy.createBlog({ title: 'a blog created by cypress', author: 'Cypress', url: 'http://cypresscreatedablog.com' })
            // Now I must log out from the user who create the blog and log in with another one
            cy.contains('logout').click()
            cy.login({ username: 'eldiego10', password: 'laclaudia' })
            // Now I could delete it
            cy.contains('view').click()
            cy.get('html').should('not.contain', 'delete blog')

        })

        it.only('A blog cannot be deleted by a user who did not create it', function () {
            let i
            // I need to create some blogs but I won't like them
            cy.createBlog({ title: 'a blog created by cypress', author: 'Cypress', url: 'http://cypresscreatedablog.com' })
            cy.createBlog({ title: 'second blog created by cypress', author: 'Cypress', url: 'http://cypresscreatedsecondblog.com' })
            // Now I create another blog
            cy.createBlog({ title: 'another blog created by cypress', author: 'Cypress', url: 'http://cypresscreatedanotherblog.com' })
            // Now I like the last blog created and rendered once
            cy.contains('another blog created by cypress').parent().contains('view').as('viewbutton')
            cy.get('@viewbutton').click()    // should be the view button of the last blog
            cy.contains('another blog created by cypress').parent().contains('like').as('likebutton')
            cy.get('@likebutton').click()
            // Reload the page for get the blogs and its data again
            cy.reload()
            // Wait for 2 sec for the right render of page
            cy.wait(2000)
            // Get the view buttons and click them for make likes of blogs visible
            cy.get('button').then(buttons => {
                for (i = 4; i < buttons.length; i += 4)
                cy.wrap(buttons[i]).click()
            })
            // Get the first <p> element which contains likes, if it contain a 1 then the blogs were sorted
            cy.get('p').contains('likes').should('contain', 1)
        })

    })

})