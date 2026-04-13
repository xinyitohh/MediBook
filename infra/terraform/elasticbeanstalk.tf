resource "aws_elastic_beanstalk_application" "main" {
  name = "medibook-api"
}

resource "aws_elastic_beanstalk_environment" "main" {
  name                = "medibook-api-env"
  application         = aws_elastic_beanstalk_application.main.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.12.0 running Docker"
}
