module "rg" {
  source = "./resource-group"

  # Resource group
  rg_name     = var.rg.name
  rg_location = var.rg.location

}


module "vnet" {
  source     = "./vnet"
  depends_on = [module.rg]

  rg_name          = var.rg.name
  rg_location      = var.rg.location
  rg_name_real     = module.rg.resource_group_name
  rg_location_real = module.rg.resource_group_location

  # VNET
  address_space   = var.vnet.address_space
  subnet_prefixes = var.vnet.subnet_prefixes
  subnet_names    = var.vnet.subnet_names

  # Public ip
  pip_name          = var.pip.pip_name
  allocation_method = var.pip.allocation_method
  sku               = var.pip.sku

}


module "aks" {
  source     = "./aks"
  depends_on = [module.rg, module.vnet]

  rg_name          = var.rg.name
  rg_location      = var.rg.location
  rg_name_real     = module.rg.resource_group_name
  rg_location_real = module.rg.resource_group_location

  aks_subnet_id = module.vnet.vnet_subnets[1]

  aks_os_disk_size_gb                = var.aks.os_disk_size_gb
  aks_sku_tier                       = var.aks.sku_tier
  aks_enable_auto_scaling            = var.aks.enable_auto_scaling
  aks_agents_size                    = var.aks.agents_size
  aks_agents_min_count               = var.aks.agents_min_count
  aks_agents_max_count               = var.aks.agents_max_count
  aks_agents_max_pods                = var.aks.agents_max_pods
  aks_enable_log_analytics_workspace = var.aks.enable_log_analytics_workspace
  aks_net_profile_dns_service_ip     = var.aks.net_profile_dns_service_ip
  aks_net_profile_docker_bridge_cidr = var.aks.net_profile_docker_bridge_cidr
  aks_net_profile_service_cidr       = var.aks.net_profile_service_cidr

}


module "firewall" {
  source     = "./firewall"
  depends_on = [module.rg, module.vnet]

  rg_name          = var.rg.name
  rg_location      = var.rg.location
  rg_name_real     = module.rg.resource_group_name
  rg_location_real = module.rg.resource_group_location

  fw_destination_addresses = [module.vnet.pip_ip_address]
  fw_public_ip_address_id  = module.vnet.pip_id
  fw_subnet_id             = module.vnet.vnet_subnets[0]

  fw_sku         = var.firewall.sku_tier
  fw_nat         = var.firewall.nat
  fw_network     = var.firewall.network
  fw_route_table = var.firewall.route_table

}








