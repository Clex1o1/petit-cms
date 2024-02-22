# Nuxt 3 Based CMS

## Idea

Define Props on components and use them to generate JSON schemas and types.
These comeponents are special "cms" components with a directive that tells the compiler to generate the schema and types.
The date will be stored with an orm or datalayer in files by default using nitro storage.
To archive this we need to create a custom compiler that generates the schema and types.
Also we need an abstract class that can be extended to implement the storage layer API.
