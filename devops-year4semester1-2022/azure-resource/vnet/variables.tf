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

# VNET
variable "address_space" {
  type = list(string)
}
variable "subnet_prefixes" {
  type = list(string)
}
variable "subnet_names" {
  type = list(string)
}

# Public ip
variable "pip_name" {
  type = string
}
variable "allocation_method" {
  type = string
}
variable "sku" {
  type = string
}
