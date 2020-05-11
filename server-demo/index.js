const express = require('express')
const app = express()

app.use(express.json())

app.get('/user-app/users', (req, res) => {
    res.json([
        {firstName: "FirstName1", lastName: "LastName1", email: "user1@email.com"},
        {firstName: "FirstName2", lastName: "LastName2", email: "user2@email.com"},
        {firstName: "FirstName3", lastName: "LastName3", email: "user3@email.com"},
        {firstName: "FirstName4", lastName: "LastName4", email: "user4@email.com"},
        {firstName: "FirstName5", lastName: "LastName5", email: "user5@email.com"}
    ])
})

app.listen(3000, () => console.log(`Server listening on 3000`))
