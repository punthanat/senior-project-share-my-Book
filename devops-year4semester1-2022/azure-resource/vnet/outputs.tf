# VNET
output "vnet_address" {
  value = module.vnet.vnet_address_space
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
  value = module.vnet.vnet_subnets[0]
}

# Public ip 
output "pip_name" {
  value = azurerm_public_ip.pip.name
}
output "pip_id" {
  value = azurerm_public_ip.pip.id
}
output "pip_ip_address" {
  value = azurerm_public_ip.pip.ip_address
}




