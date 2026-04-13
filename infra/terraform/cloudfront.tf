resource "aws_cloudfront_distribution" "frontend" {
  enabled         = true
  aliases         = ["medibook.xinyitoh.com"]
  price_class     = "PriceClass_All"
  http_version    = "http2"
  is_ipv6_enabled = true
  comment         = ""
  web_acl_id      = "arn:aws:wafv2:us-east-1:965377250388:global/webacl/CreatedByCloudFront-661b78c0/156df775-1ddd-4a8d-b232-3bc94006d7c1"

  origin {
    origin_id   = "medibook-frontend-965377250388-us-east-1-an.s3-website-us-east-1.amazonaws.com-mndfqio9uip"
    domain_name = "medibook-frontend-965377250388-us-east-1-an.s3-website-us-east-1.amazonaws.com"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "http-only"
      origin_ssl_protocols     = ["SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2"]
      origin_read_timeout      = 30
      origin_keepalive_timeout = 5
    }
  }

  default_cache_behavior {
    target_origin_id       = "medibook-frontend-965377250388-us-east-1-an.s3-website-us-east-1.amazonaws.com-mndfqio9uip"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.main.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = {
    Name = "medibook"
  }
}

resource "aws_cloudfront_distribution" "api" {
  enabled         = true
  aliases         = ["api.medibook.xinyitoh.com"]
  price_class     = "PriceClass_All"
  http_version    = "http2"
  is_ipv6_enabled = true
  comment         = ""
  web_acl_id      = "arn:aws:wafv2:us-east-1:965377250388:global/webacl/CreatedByCloudFront-62cec422/1948e1e1-1db2-493f-afce-4fbd1887cd04"

  origin {
    origin_id   = "medibook-backend-env.eba-yihhmxfc.us-east-1.elasticbeanstalk.com-mndgnyp12ao"
    domain_name = "medibook-api-env.eba-gipazmur.us-east-1.elasticbeanstalk.com"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "http-only"
      origin_ssl_protocols     = ["SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2"]
      origin_read_timeout      = 60
      origin_keepalive_timeout = 60
    }
  }

  default_cache_behavior {
    target_origin_id         = "medibook-backend-env.eba-yihhmxfc.us-east-1.elasticbeanstalk.com-mndgnyp12ao"
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    origin_request_policy_id = "216adef6-5c7f-47e4-b989-5492eafa07d3"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.main.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = {
    Name = "medibook-api"
  }
}
