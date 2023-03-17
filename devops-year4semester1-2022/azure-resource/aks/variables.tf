# Resource group
variable "rg_name" {
  type = string
}
variable "rg_location" {
  type = string
}
variable "rg_name_real" {
  type = string
}
variable "rg_location_real" {
  type = string
}

# AKS
variable "aks_subnet_id" {
  type = string
}
variable "aks_os_disk_size_gb" {
  type = number
}
variable "aks_sku_tier" {
  type = string
}
variable "aks_enable_auto_scaling" {
  type = bool
}
variable "aks_agents_size" {
  type = string
}
variable "aks_agents_min_count" {
  type = number
}
variable "aks_agents_max_count" {
  type = number
}
variable "aks_agents_max_pods" {
  type = number
}
variable "aks_enable_log_analytics_workspace" {
  type = bool
}
variable "aks_net_profile_dns_service_ip" {
  type = string
}
variable "aks_net_profile_docker_bridge_cidr" {
  type = string
}
variable "aks_net_profile_service_cidr" {
  type = string
}
