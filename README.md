# simple-nodejs-api-with-google-oauth2


### GET /glogin
Get Google Login Link for Google Login Button

###### Parameter

###### Result
> message : 'success' or error

> data: { loginLink }


### GET /auth_callback
Save User Info after Login

###### Parameter

###### Result
> message : 'success' or error

> data: { name, email }


### GET /library
Get All Books

###### Parameter

###### Result
> message : 'success' or error

> data: { books }


### POST /save_page
Save User's lesson progress

###### Parameter
> lesson_id : int

> last_page : int

###### Result
> message : 'success' or error

> data: null


### POST /favorite
Save User's favorite book

###### Parameter
> book_id : int

> favorite : boolean

###### Result
> message : 'success' or error

> data: null


### POST /contact_us
Save User Inquiry

###### Parameter
> text : string

###### Result
> message : 'success' or error

> data: null

