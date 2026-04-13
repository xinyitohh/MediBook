terraform {
  backend "s3" {
    bucket         = "medibook-terraform-state-965377250388"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "medibook-terraform-locks"
    encrypt        = true
  }
}
