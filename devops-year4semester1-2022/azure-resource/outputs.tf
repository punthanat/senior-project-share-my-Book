# Resource group
output "resource_group_name" {
  value = module.rg.resource_group_name
}
output "resource_group_location" {
  value = module.rg.resource_group_location
}

# VNET
output "vnet_address" {
  value = module.vnet.vnet_address
}
output "vnet_name" {
  value = module.vnet.vnet_name
}
output "vnet_subnets" {
  value = module.vnet.vnet_subnets
}
output "vnet_id" {
  value = module.vnet.vnet_id
}
output "fw_subnet_id0" {
  value = module.vnet.fw_subnet_id0
}

# Public ip 
output "pip_name" {
  value = module.vnet.pip_name
}
output "pip_id" {
  value = module.vnet.pip_id
}
output "pip_ip_address" {
  value = module.vnet.pip_ip_address
}

# AKS
output "aks_id" {
  value = module.aks.aks_id
}
output "aks_host" {
  value = module.aks.aks_host
}
output "aks_routing_zone" {
  value = module.aks.aks_routing_zone
}
output "aks_username" {
  value = module.aks.aks_username
}
output "aks_password" {
  value = module.aks.aks_password
}
output "aks_node_resource_group" {
  value = module.aks.aks_node_resource_group
}

# Firewall
output "fw_name" {
  value = module.firewall.fw_name
}
output "fw_nat_rule" {
  value = module.firewall.fw_nat_rule
}
output "fw_network_rule" {
  value = module.firewall.fw_network_rule
}

# Route table
output "rt_name" {
  value = module.firewall.rt_name
}
output "rt_route" {
  value = module.firewall.rt_route
}
