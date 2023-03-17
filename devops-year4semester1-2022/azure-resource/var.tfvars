################################################################################
# Resource group
################################################################################
# Resource group
rg = {
  name     = "smb"
  location = "East Asia"
}


################################################################################
# VNET
################################################################################
# VNET
vnet = {
  address_space   = ["10.0.0.0/16"]
  subnet_prefixes = ["10.0.1.0/24", "10.0.2.0/24"]
  subnet_names    = ["AzureFirewallSubnet", "workload"]
}

# Public ip
pip = {
  pip_name          = "fw-pip"
  allocation_method = "Static"
  sku               = "Standard"
}


################################################################################
# AKS
################################################################################
# AKS
aks = {
  os_disk_size_gb                = 50
  sku_tier                       = "Paid"
  enable_auto_scaling            = true
  agents_size                    = "Standard_B2s"
  agents_min_count               = 1
  agents_max_count               = 1
  agents_max_pods                = 110
  enable_log_analytics_workspace = false
  net_profile_dns_service_ip     = "10.0.3.10"
  net_profile_docker_bridge_cidr = "172.17.0.1/16"
  net_profile_service_cidr       = "10.0.3.0/24"
}



################################################################################
# Firewall
################################################################################
# Firewall
firewall = {
  sku_tier = "Standard"
  # nat
  nat = {
    name     = "dnat-rule"
    priority = 200
    action   = "Dnat"
    rules = {
      rule1 = {
        name               = "dnat-80"
        protocols          = ["TCP", "UDP"]
        source_addresses   = ["*"]
        destination_ports  = ["80"]
        translated_address = "10.0.2.107" //Don't forgot to change (vm or ingress PrivateIp => 10.0.2.106)
        translated_port    = 80
      }
      rule2 = {
        name               = "dnat-443"
        protocols          = ["TCP", "UDP"]
        source_addresses   = ["*"]
        destination_ports  = ["443"]
        translated_address = "10.0.2.107" //Don't forgot to change (vm or ingress PrivateIp => 10.0.2.106)
        translated_port    = 443
      }
      rule3 = {
        name               = "dnat-22"
        protocols          = ["TCP", "UDP"]
        source_addresses   = ["*"]
        destination_ports  = ["22"]
        translated_address = "10.0.2.107" //Don't forgot to change (vm or ingress PrivateIp => 10.0.2.106)
        translated_port    = 22
      }
      rule4 = {
        name               = "dnat-3000"
        protocols          = ["TCP", "UDP"]
        source_addresses   = ["*"]
        destination_ports  = ["3000"]
        translated_address = "10.0.2.107" //Don't forgot to change (vm or ingress PrivateIp => 10.0.2.106)
        translated_port    = 3000
      }
      rule5 = {
        name               = "dnat-6379"
        protocols          = ["TCP", "UDP"]
        source_addresses   = ["*"]
        destination_ports  = ["6379"]
        translated_address = "10.0.2.107" //Don't forgot to change (vm or ingress PrivateIp => 10.0.2.106)
        translated_port    = 6379
      }
    }
  }
  # network
  network = {
    name     = "network-rule"
    priority = 200
    action   = "Allow"
    rule = {
      name                  = "allow-all"
      protocols             = ["TCP", "UDP"]
      source_addresses      = ["*"]
      destination_addresses = ["*"]
      destination_ports     = ["80", "443", "22", "27017", "46902", "2379", "8443","6379"]
    }

  }
  # Route table
  route_table = {
    disable_bgp_route_propagation = false
    route = {
      name                   = "fw-route"
      address_prefix         = "0.0.0.0/0"
      next_hop_type          = "VirtualAppliance"
      next_hop_in_ip_address = "10.0.1.4"
    }
  }

}


