# Basic Express

Basic express.js project with basic routes:

- Express
- Joi
- Fs

---

## URL

_Server_

```
http://localhost:3000 or http://localhost:5000
```

---

## Run Server

_Server_

```
"npm start" or "node index.js" or "nodemon index.js"
```

---

## Global Response

_Response (500 - Internal Server Error)_

```
{
  "message": "Internal Server Error"
}
```

---

## RESTful endpoints

### GET /all/:category

> Get all data vehicle by category

_Request Params_

```
<category_name>

```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
     data:{"<data_category>": [
	   <data_type>:[]
	   ]
}
    "message": "Success"

}
```

---

### GET /all/:category/:type

> Get all by type of vehicle
> _Request Params_

```
<category_name>/<type_name>

```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{

	data:[{name:"",
	description:"",
	releaseYear:""},

	{name:"",
	description:"",
	releaseYear:""}

	,...

	]

    "message": "Success"

}
```

---

### GET /:category/:type/:name

> Get by name

_Request Params_

```
<category_name>/<type_name>/<vehicle_name>

```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    data:{name:"",
    description:"",
    releaseYear:""
    },
    "message": "Success"
}
```

_Response (404)_

```
{
    "message": "Data Not Found"
}
```

---

### GET /:releaseYear

> Get by release year

_Request Params_

```
<release_year>

```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data":[{name:"",
    description:"",
    releaseDate:""},
    ...],
    
    "message": "Success"
}
```

_Response (404)_

```
{
    "message": "Data Not Found"
}
```

---

### POST /add/:category/:type

> Add new vehicle

_Request Header_

```
not needed
```

_Request Body_

```
{
  "name" : "<name>",
  "description" : "<description>",
  "releaseYear":<number>
}
```

_Response (201)_

```
{
     "data": {
        "name": "Mobil Baru",
        "description": "mobil yang baru baru banget",
        "releaseYear": 2023
    },
    "message": "Created"
}
```

_Response (404 - Not Found)_

```
{
    "message": "data category and type not found"
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"description\" is required"
}
```

---

### POST /add-category/

> Add new Category

_Request Header_

```
not needed
```

_Request Body_

```
{
  "name" : "<name>"
}
```

_Response (201)_

```
{
     "data": {
        <category_name>:{<type_name>},
        ....
        ,
        <new_category_name>:{}
    },
    "message": "Created New category"
}
```

_Response (409 - CONFLICT)_

```
{
    "message": "Category already Exists"
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"name\" is required"
}
```

---

### POST /add-type/:category

> Add new Category

_Request param_

```
<category_name>
```

_Request Header_

```
not needed
```

_Request Body_

```
{
  "name" : "<name>"
}
```

_Response (201)_

```
{
     "data": {
        <category_name>:{<type_name>},
        ....
        ,
        <category_name>:{<new_type_name>:[]}
    },
    "message": "Created New category"
}
```

_Response (404 - Not Found)_

```
{
    "message": "Category not found"
}
```

_Response (409 - CONFLICT Exist)_

```
{
    "message": "data already exist"
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"name\" is required"
}
```

---

### PUT /update/:category/:type/:name

> Update by name vehicle

_Request Params_

```
/<category_name>/<type_name>/<vehicle_name>
```

_Request Header_

```
not needed
```

_Request Body_

```
{
  "name": "<name>",
  "description": "<description>",
  "releaseYear":<release_year>
}
```

_Response (200)_

```
{
    "data": {
        "name": "Mobil Baru update",
        "description": "mobil yang baru baru banget yang baru diupdate",
        "releaseYear": 2025
    },
    "message": "Updated"
}
```

_Response (400 - Validation Error)_

```
{
    "status": "Validation Failed",
    "message": "\"name\" length must be at least 3 characters long"
}
```

_Response (404 - Error Not Found)_

```
{
    "message": "Data Not Found"
}
```

---

### DELETE /delete/:category/:type/:name

> Delete by name

_Request Params_

```
/<category_name>/<type_name>/<name>
```

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Deleted"
}
```

_Response (404 - Error Not Found)_

```
{
    "message": "Data Not Found"
}
```

---
