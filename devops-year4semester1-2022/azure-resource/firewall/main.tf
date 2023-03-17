resource "azurerm_firewall" "fw" {
  resource_group_name = var.rg_name_real
  location            = var.rg_location_real
  name                = "${var.rg_name}-firewall"
  sku_tier            = var.fw_sku

  ip_configuration {
    name                 = "ip_configuration"
    subnet_id            = var.fw_subnet_id
    public_ip_address_id = var.fw_public_ip_address_id
  }
}


resource "azurerm_firewall_nat_rule_collection" "fw-nat" {
  depends_on          = [azurerm_firewall.fw]
  name                = var.fw_nat.name
  azure_firewall_name = azurerm_firewall.fw.name
  resource_group_name = var.rg_name_real
  priority            = var.fw_nat.priority
  action              = var.fw_nat.action

  rule {
    name                  = var.fw_nat.rules.rule1.name
    protocols             = var.fw_nat.rules.rule1.protocols
    source_addresses      = var.fw_nat.rules.rule1.source_addresses
    destination_addresses = var.fw_destination_addresses
    destination_ports     = var.fw_nat.rules.rule1.destination_ports
    translated_address    = var.fw_nat.rules.rule1.translated_address //Don't forgot to change (vm or ingress PrivateIp => 10.0.2.106)
    translated_port       = var.fw_nat.rules.rule1.translated_port
  }
  rule {
    name                  = var.fw_nat.rules.rule2.name
    protocols             = var.fw_nat.rules.rule2.protocols
    source_addresses      = var.fw_nat.rules.rule2.source_addresses
    destination_addresses = var.fw_destination_addresses
    destination_ports     = var.fw_nat.rules.rule2.destination_ports
    translated_address    = var.fw_nat.rules.rule2.translated_address //Don't forgot to change (vm or ingress PrivateIp => 10.0.2.106)
    translated_port       = var.fw_nat.rules.rule2.translated_port
  }
  rule {
    name                  = var.fw_nat.rules.rule3.name
    protocols             = var.fw_nat.rules.rule3.protocols
    source_addresses      = var.fw_nat.rules.rule3.source_addresses
    destination_addresses = var.fw_destination_addresses
    destination_ports     = var.fw_nat.rules.rule3.destination_ports
    translated_address    = var.fw_nat.rules.rule3.translated_address //Don't forgot to change (vm or ingress PrivateIp => 10.0.2.106)
    translated_port       = var.fw_nat.rules.rule3.translated_port
  }
  rule {
    name                  = var.fw_nat.rules.rule4.name
    protocols             = var.fw_nat.rules.rule4.protocols
    source_addresses      = var.fw_nat.rules.rule4.source_addresses
    destination_addresses = var.fw_destination_addresses
    destination_ports     = var.fw_nat.rules.rule4.destination_ports
    translated_address    = var.fw_nat.rules.rule4.translated_address //Don't forgot to change (vm or ingress PrivateIp => 10.0.2.106)
    translated_port       = var.fw_nat.rules.rule4.translated_port
  }
}


resource "azurerm_firewall_network_rule_collection" "fw-network" {
  depends_on          = [azurerm_firewall.fw]
  name                = var.fw_network.name
  azure_firewall_name = azurerm_firewall.fw.name
  resource_group_name = var.rg_name_real
  priority            = var.fw_network.priority
  action              = var.fw_network.action

  rule {
    name                  = var.fw_network.rule.name
    protocols             = var.fw_network.rule.protocols
    source_addresses      = var.fw_network.rule.source_addresses
    destination_addresses = var.fw_network.rule.destination_addresses
    destination_ports     = var.fw_network.rule.destination_ports
  }
}


resource "azurerm_route_table" "fw-route" {
  resource_group_name           = var.rg_name_real
  location                      = var.rg_location_real
  name                          = "${var.rg_name}-route-table"
  disable_bgp_route_propagation = var.fw_route_table.disable_bgp_route_propagation

  route {
    name                   = var.fw_route_table.route.name
    address_prefix         = var.fw_route_table.route.address_prefix
    next_hop_type          = var.fw_route_table.route.next_hop_type
    next_hop_in_ip_address = var.fw_route_table.route.next_hop_in_ip_address
  }

}
