require('dotenv').config({ path: '../.env'})
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const email = require('./email')
var bodyParser = require('body-parser')
const fs = require('fs')
const util = require('util')
const path = require('path')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)


// parse application/json
app.use(bodyParser.json())


const isEmailInList = async (email) => {
    try {
        const emailsBuffer = await readFile('./.flatdb.txt', 'utf-8')
        const emails = emailsBuffer.split('\n')
        if (emails.includes(email)) {
            return true
        } else {
            
            emails.push(email)
            return writeToDB(emails)
        }
    } catch (error) {
        console.error(error)
    }
    
    
}

const emailsLength = async() => {
    const emails = await readFile('./.flatdb.txt', 'utf-8')
    return emails.split('\n').length
}

const writeToDB = async (emails) => {
    emails = emails.join('\n')
    return writeFile('./.flatdb.txt', emails, 'utf-8')
}

app.post('/validate', async(req, res) => {
    const _email = req.body.email
    const validEmail = email.validate(_email)
    const firstName = req.body.firstName
    if(validEmail) {
        const emailTaken = await isEmailInList(_email)
        if (emailTaken) {
            console.log(`Already taken ${_email}`)
            res.status(500).send({'message': 'Email Taken'})
        } else {
            console.log(`Valid ${_email}`)
            email.mailTo(_email, firstName)
            res.status(200).send({'message': 'Success'}) 
        }
        

    } else {
        console.log(`Invalid email ${_email}`)
        res.status(500).send({'message': 'Invalid email'})
    }
    
})

app.get('/pledgeCount', async (req, res) => {
    const emails = await emailsLength()
    res.status(200).json({ 'message': 'Success', 'length': emails })
})

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../build')))
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../build', 'index.html'))
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`))