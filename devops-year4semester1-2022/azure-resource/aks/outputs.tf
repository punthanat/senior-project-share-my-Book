# AKS
output "aks_id" {
    value = module.aks.aks_id
}
output "aks_host" {
    value = module.aks.host
}
output "aks_routing_zone" {
    value = module.aks.http_application_routing_zone_name
}
output "aks_username" {
    value = module.aks.username
}
output "aks_password" {
    value = module.aks.password
}
output "aks_node_resource_group" {
    value = module.aks.node_resource_group
}
