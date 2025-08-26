terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Use default VPC & subnets
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.8.5"

  cluster_name    = "todo-eks"
  cluster_version = "1.30"

  vpc_id     = data.aws_vpc.default.id
  subnet_ids = data.aws_subnets.default.ids

  cluster_encryption_config   = []
  create_cloudwatch_log_group = false
  enable_irsa                 = true

  eks_managed_node_groups = {
    default = {
      instance_types = ["t3.small"] # free-tier friendly
      desired_capacity = 1
      max_capacity     = 2
      min_capacity     = 1
    }
  }
}

