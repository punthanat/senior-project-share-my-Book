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

# Firewall
variable "fw_sku" {
  type = string
}
variable "fw_destination_addresses" {
  type = list(string)
}
variable "fw_public_ip_address_id" {
  type = string
}
variable "fw_subnet_id" {
  type = string
}

# nat
variable "fw_nat" {
  type = object({
    name     = string
    priority = number
    action   = string
    rules = map(object({
      name               = string
      protocols          = list(string)
      source_addresses   = list(string)
      destination_ports  = list(string)
      translated_address = string
      translated_port    = number
    }))
  })
}

# network
variable "fw_network" {
  type = object({
    name     = string
    priority = number
    action   = string
    rule = object({
      name                  = string
      protocols             = list(string)
      source_addresses      = list(string)
      destination_addresses = list(string)
      destination_ports     = list(string)
    })
  })
}

# Route table
variable "fw_route_table" {
  type = object({
    disable_bgp_route_propagation = bool
    route                         = map(string)
  })
}


