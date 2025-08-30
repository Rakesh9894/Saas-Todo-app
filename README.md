User data for Ec2 setup 

#!/bin/bash
# Update and upgrade
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Git
sudo apt-get install -y git
echo "Git Version: $(git --version)"

# Install Docker
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker
echo "Docker Version: $(docker --version)"

# Install Jenkins
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update -y
sudo apt-get install -y openjdk-17-jdk
sudo apt-get install -y jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins
echo "Jenkins Version: $(systemctl status jenkins | head -n 5)"

# Add Jenkins user to the docker group
sudo groupadd docker || true   # Create docker group if not exists
sudo usermod -aG docker jenkins

# Restart Docker to apply group changes
sudo systemctl restart docker

# Optional: Restart Jenkins if needed
sudo systemctl restart jenkins

echo "Jenkins user added to docker group"


# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
echo "NodeJS Version: $(node --version)"
echo "NPM Version: $(npm --version)"

# Install Terraform
sudo apt-get install -y wget unzip
wget https://releases.hashicorp.com/terraform/1.8.5/terraform_1.8.5_linux_amd64.zip
unzip terraform_1.8.5_linux_amd64.zip
sudo mv terraform /usr/local/bin/
echo "Terraform Version: $(terraform --version)"

# Install AWS CLI version 2
curl "https://awscli.amazonaws.com/aws

# Install kubectl using apt
sudo curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-archive-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update -y
sudo apt-get install -y kubectl
echo "Kubectl Version: $(kubectl version --client --short)"

