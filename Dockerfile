# Specify a base image
FROM node:alpine

#Install some dependencies

#workdir for project instead installing in the root dir of container which causes errors
WORKDIR /usr/app 

# First copy pkg.json then copy the rest of the files to the container in order not to run pkg.json everytime we make a change
# in the files ... aka -> use cache for pkg.json
COPY ./package.json ./
RUN npm install
COPY ./ ./

# localhost
EXPOSE 5000 


# Set up a default command
CMD [ "npm","start" ]