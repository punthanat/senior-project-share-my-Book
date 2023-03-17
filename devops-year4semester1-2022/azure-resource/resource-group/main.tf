resource "azurerm_resource_group" "rg" {
  name     = "${var.rg_name}-resource"
  location = var.rg_location
}