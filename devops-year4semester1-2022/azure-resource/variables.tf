# Resource group
variable "rg" {
  type = map(string)
}

# VNET
variable "vnet" {
  type = map(list(string))
}

# Public ip
variable "pip" {
  type = map(string)
}

# AKS
variable "aks" {
  type = object({
    os_disk_size_gb                = number
    sku_tier                       = string
    enable_auto_scaling            = bool
    agents_size                    = string
    agents_min_count               = number
    agents_max_count               = number
    agents_max_pods                = number
    enable_log_analytics_workspace = bool
    net_profile_dns_service_ip     = string
    net_profile_docker_bridge_cidr = string
    net_profile_service_cidr       = string
  })
}


# Firewall
variable "firewall" {
  type = object({
    sku_tier = string
    nat = object({
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
    network = object({
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
    route_table = object({
      disable_bgp_route_propagation = bool
      route                         = map(string)
    })
  })
}




