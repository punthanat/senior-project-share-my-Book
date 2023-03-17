# Firewall
output "fw_name" {
  value = azurerm_firewall.fw.name
}
output "fw_nat_rule" {
  value = azurerm_firewall_nat_rule_collection.fw-nat.rule
}
output "fw_network_rule" {
  value = azurerm_firewall_network_rule_collection.fw-network.rule
}

# Route table
output "rt_name" {
  value = azurerm_route_table.fw-route.name
}
output "rt_route" {
  value = azurerm_route_table.fw-route.route
}