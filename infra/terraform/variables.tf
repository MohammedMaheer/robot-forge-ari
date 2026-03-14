variable "region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (staging or production)"
  type        = string

  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be either 'staging' or 'production'."
  }
}

variable "domain_name" {
  description = "Root domain name for the application (e.g., robotforge.io)"
  type        = string
}

variable "db_instance_class" {
  description = "RDS instance class for Aurora PostgreSQL"
  type        = string
  default     = "db.t3.medium"
}

variable "db_storage_gb" {
  description = "Allocated storage in GB for the database (Aurora manages this automatically, used for budgeting reference)"
  type        = number
  default     = 100
}

variable "eks_node_count" {
  description = "Desired number of EKS worker nodes"
  type        = number
  default     = 3
}

variable "eks_node_type" {
  description = "EC2 instance type for EKS worker nodes"
  type        = string
  default     = "t3.large"
}
