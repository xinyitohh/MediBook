resource "aws_acm_certificate" "main" {
  domain_name               = "medibook.xinyitoh.com"
  subject_alternative_names = ["*.medibook.xinyitoh.com"]
  validation_method         = "DNS"
}
