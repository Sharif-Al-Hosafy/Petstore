# Petstore

It's an express application providing two types of users(customers and owners).
owners can add pets to the store and customers can purchase pets or bid on a pet, The owner then can list all bids and he also has a script for an auction to identify the winner and the loser

---

### How to run server

After cloning the repo you need to:
  
  1- Setup the environment variables in the project directory
  
  2- Build The Docker Image 
 
 ```
    docker build . -t petstore
 ```
 3- Run the Docker Image in a Container
 
 ```
    docker run -p 5000:5000 petstore
 ```
 4- Enjoooy !!
 
 ---
 
## * Note 
 you may find this warning while running the docker image but it's okay it's only related to npm version (just a warning) 
 
   ```
    npm notice 
    npm notice New patch version of npm available! 8.19.1 -> 8.19.2
    npm notice Changelog: <https://github.com/npm/cli/releases/tag/v8.19.2>
    npm notice Run `npm install -g npm@8.19.2` to update!
    npm notice 
   ```
 
 ---
 
 ### Important Links
 
 1- [Download Postman Api Collection Including Tests In Routes](https://drive.google.com/file/d/1s6cegPaFVn_HB0R9GuXbcznTMF1MMlv_/view?usp=sharing).
 
 2- [Swagger Api Documentation](https://app.swaggerhub.com/apis/sherifismail44/petstore/1.0.0#/).
 
