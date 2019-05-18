# Prerequisite Command-Line Commands to Set up HyperLedger Fabric on Ubuntu 18.04


### Download Curl
```
sudo apt install curl
curl -v
```

### Setup Docker 
```
sudo groupadd docker
sudo usermod -aG docker $USER
docker run hello-world
```

### Install Docker Compose
```
sudo apt update
sudo apt install docker-compose
docker --version && docker-compose --version
```

### Install npm 
```
sudo bash -c "cat >/etc/apt/sources.list.d/nodesource.list" <<EOL
deb https://deb.nodesource.com/node_6.x xenial main
deb-src https://deb.nodesource.com/node_6.x xenial main
EOL
curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -
sudo apt update
sudo apt install nodejs
sudo apt install npm
node --version && npm --version
```

### Setup Go
```
sudo apt update
sudo curl -O https://storage.googleapis.com/golang/go1.9.2.linux-amd64.tar.gz
sudo tar -xvf go1.9.2.linux-amd64.tar.gz
sudo mv go /usr/local
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.profile
source ~/.profile
go version
```

### Setup Hyperledger Fabric
```
curl -sSL https://goo.gl/6wtTN5 | bash -s 1.4.0
docker tag hyperledger/fabric-tools:x86_64-1.0.2 hyperledger/fabric-tools:latest
export PATH=$PWD/bin:$PATH
```