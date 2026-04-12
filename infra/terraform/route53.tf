resource "aws_route53_zone" "main" {
  name          = "medibook.xinyitoh.com"
  comment       = ""
  force_destroy = false
}

resource "aws_route53_record" "frontend" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "medibook.xinyitoh.com"
  type    = "A"

  alias {
    name                   = "dzpwjpm6pf2jn.cloudfront.net"
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.medibook.xinyitoh.com"
  type    = "A"

  alias {
    name                   = "d251wja8y2k42v.cloudfront.net"
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "acm_validation" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "_c77dd441182cab10a03186fda947cb56.medibook.xinyitoh.com"
  type    = "CNAME"
  ttl     = 300
  records = ["_b001a1c5e5af9e4dc74a93504d831069.jkddzztszm.acm-validations.aws."]
}
