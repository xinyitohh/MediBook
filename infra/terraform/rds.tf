resource "aws_db_instance" "main" {
  identifier              = "medibook"
  instance_class          = "db.t3.micro"
  engine                  = "postgres"
  engine_version          = "17.6"
  username                = "postgres"
  password                = var.db_password
  allocated_storage       = 20
  storage_type            = "gp2"
  storage_encrypted       = true
  kms_key_id              = "arn:aws:kms:us-east-1:965377250388:key/50e7d609-eddf-45c4-98ec-46e9dbdaf370"
  db_subnet_group_name    = "default-vpc-0473eff37f3591be0"
  vpc_security_group_ids  = ["sg-04fa3e1c73b41e397", "sg-0873028616e0cc3ed"]
  publicly_accessible     = true
  port                    = 5432
  parameter_group_name    = "default.postgres17"
  option_group_name       = "default:postgres-17"
  backup_retention_period = 1
  backup_window           = "14:41-15:11"
  maintenance_window      = "sun:16:24-sun:16:54"
  copy_tags_to_snapshot   = true
  skip_final_snapshot     = true
  deletion_protection     = false
  multi_az                = false
  tags                    = {}
}
