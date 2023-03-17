module "aks" {
  source              = "Azure/aks/azurerm"
  version             = "4.16.0"
  resource_group_name = var.rg_name_real
  cluster_name        = "${var.rg_name}-cluster"
  kubernetes_version  = "1.23.12"
  prefix              = "prefix"

  network_plugin  = "azure" //Azure CNI
  vnet_subnet_id  = var.aks_subnet_id
  os_disk_size_gb = var.aks_os_disk_size_gb //Default: 50
  sku_tier        = var.aks_sku_tier        # defaults to Free 

  enable_auto_scaling = var.aks_enable_auto_scaling //Default: false
  agents_size         = var.aks_agents_size         //Default: "Standard_D2s_v3"
  agents_min_count    = var.aks_agents_min_count
  agents_max_count    = var.aks_agents_max_count
  agents_count        = null # Please set `agents_count` `null` while `enable_auto_scaling` is `true` to avoid possible `agents_count` changes. //Default: 2
  agents_max_pods     = var.aks_agents_max_pods
  agents_pool_name    = "exnodepool" //Default: "nodepool"
  #   agents_availability_zones = ["1", "2"]
  agents_type                    = "VirtualMachineScaleSets"              //Defaults to VirtualMachineScaleSets.
  enable_log_analytics_workspace = var.aks_enable_log_analytics_workspace //Default: true

  net_profile_dns_service_ip     = var.aks_net_profile_dns_service_ip
  net_profile_docker_bridge_cidr = var.aks_net_profile_docker_bridge_cidr
  net_profile_service_cidr       = var.aks_net_profile_service_cidr

}
